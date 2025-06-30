import {
  BlockfrostProvider,
  deserializeAddress,
  serializePlutusScript,
  MeshTxBuilder,
  Asset,
  BrowserWallet,
  stringToHex,
  deserializeDatum,
  ConStr0,
  ConStr1,
  PubKeyHash,
  Integer,
  UTxO,
  Bytes,
} from "@meshsdk/core";
import { applyParamsToScript } from "@meshsdk/core-csl";

// Import contract blueprint from your Aiken workspace
import contractBlueprint from "../../../smart-contract/plutus.json";

// Apply parameters to script if needed and get the contract address
const scriptCbor = applyParamsToScript(
  contractBlueprint.validators[0].compiledCode,
  []
);
const contractAddress = serializePlutusScript(
  { code: scriptCbor, version: "V3" },
  undefined,
  0
).address;

// Blockfrost provider setup
const blockfrostApiKey = process.env.NEXT_PUBLIC_BLOCKFROST_API_KEY || "";
const nodeProvider = new BlockfrostProvider(blockfrostApiKey);

// Token constants
const tokenPolicyId =
  "f4c9f9c4252d86702c2f4c2e49e6648c7cffe3c8f2b6b7d779788f50";
const tokenName = "COTREE";

// Define data types that match the Aiken contract
export type TreePlantingRecord = ConStr0<
  [Bytes, ConStr0<[Integer, Integer]>, Bytes, Integer, Integer]
>;

export type CarbonData = ConStr0<[Bytes, Integer, Integer, Integer]>;

export type VardanoDatum = ConStr0<
  [
    Bytes,
    PubKeyHash[],
    TreePlantingRecord[],
    CarbonData[],
    ConStr0<[Bytes, Integer]>[]
  ]
>;

// Helper to get wallet info
async function getWalletInfo(wallet: BrowserWallet) {
  const walletAddress = await wallet.getChangeAddress();
  const utxos = await wallet.getUtxos();
  const collateral = (await wallet.getCollateral())[0];
  return { walletAddress, utxos, collateral };
}

// Helper function to convert string|number|null to bigint safely
export const mInt = (amount: string | number | undefined | null): bigint => {
  if (amount === undefined || amount === null) {
    throw new Error(`Cannot convert ${amount} to BigInt`);
  }

  try {
    return BigInt(amount);
  } catch (error) {
    throw new Error(`Failed to convert value '${amount}' to BigInt: ${error}`);
  }
};

// Helper function to create Plutus integer with validation
function plutusInt(value: number | string | undefined | null): string {
  if (value === undefined || value === null) {
    throw new Error("Cannot convert undefined/null to integer");
  }

  const num = typeof value === "string" ? parseFloat(value) : value;

  if (typeof num !== "number" || isNaN(num)) {
    throw new Error(`Invalid number value: ${value}`);
  }

  if (!isFinite(num)) {
    throw new Error(`Number is infinite: ${value}`);
  }

  const flooredValue = Math.floor(num);
  if (!Number.isSafeInteger(flooredValue)) {
    throw new Error(`Number ${value} is too large to safely convert to integer`);
  }

  return flooredValue.toString();
}

// Helper to serialize BigInt recursively
function serializeBigInt(value: any): any {
  if (typeof value === "bigint") {
    return value.toString();
  } else if (Array.isArray(value)) {
    return value.map(serializeBigInt);
  } else if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, serializeBigInt(v)])
    );
  }
  return value;
}

import type { IWallet } from "@meshsdk/core";

/**
 * Register a new farmer to the protocol
 */
export async function registerFarmer(wallet: BrowserWallet): Promise<boolean> {
  try {
    // Get wallet information
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);
    const farmerHash = deserializeAddress(walletAddress).pubKeyHash;

    // Get current contract state
    const contractUtxos = await nodeProvider.fetchAddressUTxOs(contractAddress);
    let currentDatum: VardanoDatum;

    if (contractUtxos.length > 0 && contractUtxos[0].output.plutusData) {
      currentDatum = deserializeDatum<VardanoDatum>(
        contractUtxos[0].output.plutusData
      );
    } else {
      // Initialize with empty state if no UTXO exists (correctly typed!)
      currentDatum = mConStr0([
        new Uint8Array([]), // Bytes
        [],                // PubKeyHash[]
        [],                // TreePlantingRecord[]
        [],                // CarbonData[]
        [],                // ConStr0<[Bytes, Integer]>[]
      ]);
    }

    // Create transaction builder
    const txBuild = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    let txDraft;

    if (contractUtxos.length > 0) {
      // Update existing contract UTXO
      const utxo = contractUtxos[0];

      // Add farmer to farmers list (fields[1])
      const updatedFarmers = [...currentDatum.fields[1], farmerHash];

      const updatedDatum = mConStr0([
        currentDatum.fields[0],
        updatedFarmers,
        currentDatum.fields[2],
        currentDatum.fields[3],
        currentDatum.fields[4],
      ]);

      txDraft = await txBuild
        .setNetwork("preprod")
        .spendingPlutusScript("V3")
        .txIn(
          utxo.input.txHash,
          utxo.input.outputIndex,
          utxo.output.amount,
          utxo.output.address
        )
        .txInScript(scriptCbor)
        .spendingReferenceTxInInlineDatumPresent()
        .spendingReferenceTxInRedeemerValue(mConStr0([stringToHex(farmerHash)]))
        .txOut(contractAddress, utxo.output.amount)
        .txOutInlineDatumValue(updatedDatum)
        .changeAddress(walletAddress)
        .txInCollateral(
          collateral.input.txHash,
          collateral.input.outputIndex,
          collateral.output.amount,
          collateral.output.address
        )
        .selectUtxosFrom(utxos)
        .complete();
    } else {
      // Create initial contract UTXO with first farmer
      const initialDatum = mConStr0([
        new Uint8Array([]),
        [farmerHash],
        [],
        [],
        [],
      ]);

      const assets: Asset[] = [{ unit: "lovelace", quantity: "2000000" }];

      txDraft = await txBuild
        .setNetwork("preprod")
        .txOut(contractAddress, assets)
        .txOutInlineDatumValue(initialDatum)
        .changeAddress(walletAddress)
        .selectUtxosFrom(utxos)
        .complete();
    }

    // Sign transaction
    const signedTx = await wallet.signTx(txDraft);

    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);

    return true;
  } catch (error) {
    console.error("Error registering farmer:", error);
    return false;
  }
}

/**
 * Plant trees and record on the blockchain
 */
export async function plantTrees(
  wallet: BrowserWallet,
  treeData: {
    treeType: string;
    latitude: number;
    longitude: number;
    treeCount: number;
  }
): Promise<boolean> {
  try {
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);
    const farmerHash = deserializeAddress(walletAddress).pubKeyHash;

    const contractUtxos = await nodeProvider.fetchAddressUTxOs(contractAddress);
    if (contractUtxos.length === 0 || !contractUtxos[0].output.plutusData) {
      console.error("No contract UTXO found");
      return false;
    }

    const currentDatum = deserializeDatum<VardanoDatum>(
      contractUtxos[0].output.plutusData
    );

    // Tree planting record
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const treeRecord = mConStr0([
      farmerHash,
      mConStr0([
        plutusInt(Number(treeData.latitude * 1_000_000)),
        plutusInt(Number(treeData.longitude * 1_000_000)),
      ]),
      stringToHex(treeData.treeType || ""),
      plutusInt(currentTimestamp),
      plutusInt(Math.max(1, treeData.treeCount)),
    ]);

    // Append new tree record
    const treeRecords = [...currentDatum.fields[2], treeRecord];

    const updatedDatum = mConStr0([
      currentDatum.fields[0],
      currentDatum.fields[1],
      treeRecords,
      currentDatum.fields[3],
      currentDatum.fields[4],
    ]);

    const serializedDatum = serializeBigInt(updatedDatum);

    const utxo = contractUtxos[0];
    const txBuild = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    const txDraft = await txBuild
      .setNetwork("preprod")
      .spendingPlutusScript("V3")
      .txIn(
        utxo.input.txHash,
        utxo.input.outputIndex,
        utxo.output.amount,
        utxo.output.address
      )
      .txInScript(scriptCbor)
      .spendingReferenceTxInInlineDatumPresent()
      .spendingReferenceTxInRedeemerValue(mConStr1([serializeBigInt(treeRecord)]))
      .txOut(contractAddress, utxo.output.amount)
      .txOutInlineDatumValue(serializedDatum)
      .requiredSignerHash(farmerHash)
      .changeAddress(walletAddress)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address
      )
      .selectUtxosFrom(utxos)
      .complete();

    const signedTx = await wallet.signTx(txDraft);
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);

    return true;
  } catch (error) {
    console.error("Error planting trees:", error);
    return false;
  }
}

/**
 * Update carbon data for a farmer (admin only)
 */
export async function updateCarbonData(
  wallet: BrowserWallet,
  carbonData: {
    farmerId: string;
    ndvi: number;
    co2Absorbed: number;
  }
): Promise<boolean> {
  try {
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);
    const signerHash = deserializeAddress(walletAddress).pubKeyHash;

    const contractUtxos = await nodeProvider.fetchAddressUTxOs(contractAddress);
    if (contractUtxos.length === 0 || !contractUtxos[0].output.plutusData) {
      console.error("No contract UTXO found");
      return false;
    }

    const currentDatum = deserializeDatum<VardanoDatum>(
      contractUtxos[0].output.plutusData
    );

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const carbonRecord = mConStr0([
      carbonData.farmerId,
      mInt(Math.floor(carbonData.ndvi * 1000)),
      mInt(Math.floor(carbonData.co2Absorbed * 100)),
      mInt(currentTimestamp),
    ]);

    const carbonRecords = [...currentDatum.fields[3], carbonRecord];

    const updatedDatum = mConStr0([
      currentDatum.fields[0],
      currentDatum.fields[1],
      currentDatum.fields[2],
      carbonRecords,
      currentDatum.fields[4],
    ]);

    const utxo = contractUtxos[0];
    const txBuild = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    const txDraft = await txBuild
      .setNetwork("preprod")
      .spendingPlutusScript("V3")
      .txIn(
        utxo.input.txHash,
        utxo.input.outputIndex,
        utxo.output.amount,
        utxo.output.address
      )
      .txInScript(scriptCbor)
      .spendingReferenceTxInInlineDatumPresent()
      .spendingReferenceTxInRedeemerValue(mConStr0([carbonRecord]))
      .txOut(contractAddress, utxo.output.amount)
      .txOutInlineDatumValue(updatedDatum)
      .changeAddress(walletAddress)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address
      )
      .selectUtxosFrom(utxos)
      .complete();

    const signedTx = await wallet.signTx(txDraft);
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);

    return true;
  } catch (error) {
    console.error("Error updating carbon data:", error);
    return false;
  }
}

/**
 * Mint COTREE tokens as reward for carbon capture (admin only)
 */
export async function mintTokens(
  wallet: BrowserWallet,
  mintData: {
    farmerId: string;
    amount: number;
  }
): Promise<boolean> {
  try {
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);
    const signerHash = deserializeAddress(walletAddress).pubKeyHash;

    const contractUtxos = await nodeProvider.fetchAddressUTxOs(contractAddress);
    if (contractUtxos.length === 0 || !contractUtxos[0].output.plutusData) {
      console.error("No contract UTXO found");
      return false;
    }

    const currentDatum = deserializeDatum<VardanoDatum>(
      contractUtxos[0].output.plutusData
    );

    const mintRecord = mConStr0([mintData.farmerId, mInt(mintData.amount)]);

    const mintRecords = [...currentDatum.fields[4], mintRecord];

    const updatedDatum = mConStr0([
      currentDatum.fields[0],
      currentDatum.fields[1],
      currentDatum.fields[2],
      currentDatum.fields[3],
      mintRecords,
    ]);

    const tokenAsset: Asset = {
      unit: `${tokenPolicyId}.${Buffer.from(tokenName).toString("hex")}`,
      quantity: mintData.amount.toString(),
    };

    const minAda: Asset = { unit: "lovelace", quantity: "1500000" };

    const utxo = contractUtxos[0];
    const txBuild = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    const farmerAddress = await nodeProvider.resolveAddress(mintData.farmerId);

    const txDraft = await txBuild
      .setNetwork("preprod")
      .mintAsset(tokenPolicyId, tokenName, mintData.amount)
      .spendingPlutusScript("V3")
      .txIn(
        utxo.input.txHash,
        utxo.input.outputIndex,
        utxo.output.amount,
        utxo.output.address
      )
      .txInScript(scriptCbor)
      .spendingReferenceTxInInlineDatumPresent()
      .spendingReferenceTxInRedeemerValue(
        mConStr0([mintData.farmerId, mintData.amount.toString()])
      )
      .txOut(contractAddress, utxo.output.amount)
      .txOutInlineDatumValue(updatedDatum)
      .txOut(farmerAddress, [minAda, tokenAsset])
      .changeAddress(walletAddress)
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address
      )
      .selectUtxosFrom(utxos)
      .complete();

    const signedTx = await wallet.signTx(txDraft);
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);

    return true;
  } catch (error) {
    console.error("Error minting tokens:", error);
    return false;
  }
}

/**
 * Spend COTREE tokens (transfer to another address)
 */
export async function spendTokens(
  wallet: BrowserWallet,
  spendData: {
    amount: number;
    receiverAddress: string;
  }
): Promise<boolean> {
  try {
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);
    const farmerHash = deserializeAddress(walletAddress).pubKeyHash;

    // Find token UTXOs in wallet
    const tokenUtxos = utxos.filter((utxo) => {
      const assetKey = `${tokenPolicyId}.${Buffer.from(tokenName).toString(
        "hex"
      )}`;
      return utxo.output.amount.some((asset) => asset.unit === assetKey);
    });

    if (tokenUtxos.length === 0) {
      console.error("No COTREE tokens found in wallet");
      return false;
    }

    let totalTokens = 0;
    tokenUtxos.forEach((utxo) => {
      const assetKey = `${tokenPolicyId}.${Buffer.from(tokenName).toString(
        "hex"
      )}`;
      const asset = utxo.output.amount.find((a) => a.unit === assetKey);
      if (asset) {
        totalTokens += parseInt(asset.quantity);
      }
    });

    if (totalTokens < spendData.amount) {
      console.error("Insufficient tokens");
      return false;
    }

    const minAda: Asset = { unit: "lovelace", quantity: "1500000" };

    const tokenAsset: Asset = {
      unit: `${tokenPolicyId}.${Buffer.from(tokenName).toString("hex")}`,
      quantity: spendData.amount.toString(),
    };

    const txBuild = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    let txBuilder = txBuild
      .setNetwork("preprod")
      .changeAddress(walletAddress)
      .txOut(spendData.receiverAddress, [minAda, tokenAsset])
      .txInCollateral(
        collateral.input.txHash,
        collateral.input.outputIndex,
        collateral.output.amount,
        collateral.output.address
      );

    // Add token UTXOs as inputs
    for (const utxo of tokenUtxos) {
      txBuilder = txBuilder.txIn(
        utxo.input.txHash,
        utxo.input.outputIndex,
        utxo.output.amount,
        utxo.output.address
      );
    }

    const txDraft = await txBuilder.selectUtxosFrom(utxos).complete();

    const signedTx = await wallet.signTx(txDraft);
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);

    return true;
  } catch (error) {
    console.error("Error spending tokens:", error);
    return false;
  }
}


