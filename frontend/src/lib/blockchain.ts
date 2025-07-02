import {
  BlockfrostProvider,
  deserializeAddress,
  serializePlutusScript,
  mConStr0,
  mConStr1,
  MeshTxBuilder,
  Asset,
  BrowserWallet,
  stringToHex,
  deserializeDatum,
  ConStr0,
  PubKeyHash,
  Integer,
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

async function getWalletInfo(wallet: BrowserWallet) {
  const walletAddress = await wallet.getChangeAddress();
  const utxos = await wallet.getUtxos();
  const collateral = (await wallet.getCollateral())[0];
  return { walletAddress, utxos, collateral };
}

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
    let currentDatum: VardanoDatum | null = null;

    if (contractUtxos.length > 0 && contractUtxos[0].output.plutusData) {
      currentDatum = deserializeDatum<VardanoDatum>(
        contractUtxos[0].output.plutusData
      );
    } else {
      // Initialize with empty state if no UTXO exists
      currentDatum = mConStr0([
       [], // empty farmers listAdd commentMore actions
        [], // empty tree records
        [], // empty carbon data
        [], // empty token mintsAdd commentMore actions
      ]);
    }

    // Create transaction
    const txBuild = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

    let txDraft;

    if (contractUtxos.length > 0) {
      // Update existing contract UTXO
      const utxo = contractUtxos[0];

      // Create updated datum with new farmer added
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
      // Create initial contract UTXO
      const initialDatum = mConStr0([
        [farmerHash], // Add the first farmer
        [],
        [],
        [],
      ]);

      // Minimum ADA required for a UTXO
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
    let signedTx;
    try {
      signedTx = await wallet.signTx(txDraft);
    } catch (error) {
      console.error("Error signing transaction:", error);
      return false;
    }

    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);
    return true;
  } catch (error) {
    console.error("Error registering farmer:", error);
    return false;
  }
}

// Add helper function for creating Plutus integers with better error handlingAdd commentMore actions

// Helper function for creating Plutus integers with better validation
function plutusInt(value: number | string | undefined | null): string {
  // Handle undefined/null values
  if (value === undefined || value === null) {
    throw new Error("Cannot convert undefined/null to integer");
  }

  // Convert string to number if needed
  const num = typeof value === "string" ? parseFloat(value) : value;

  // Validate number
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error(`Invalid number value: ${value}`);
  }

  if (!isFinite(num)) {
    throw new Error(`Number is infinite: ${value}`);
  }

  // Floor and validate range
  const flooredValue = Math.floor(num);
  if (!Number.isSafeInteger(flooredValue)) {
    throw new Error(
      `Number ${value} is too large to safely convert to integer`
    );
  }

  return flooredValue.toString();
}

// Helper function to convert BigInt to string
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
    // Get wallet information
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);
    const farmerHash = deserializeAddress(walletAddress).pubKeyHash;

    // Get current contract state
    const contractUtxos = await nodeProvider.fetchAddressUTxOs(contractAddress);
    console.log("Contract UTXOs:", contractUtxos);
    if (contractUtxos.length === 0 || !contractUtxos[0].output.plutusData) {
      console.error("No contract UTXO found");
      return false;
    }

    const currentDatum = deserializeDatum<VardanoDatum>(
      contractUtxos[0].output.plutusData
    );

    // Check if farmer is registeredAdd commentMore actions

    // console.log("Farmers:", currentDatum);
    // if (!farmers.includes(farmerHash)) {
    //   console.error("Farmer not registered");
    //   return false;
    // }

    // Create tree planting record with proper BigInt conversions
    const currentTimestamp = Math.floor(Date.now() / 1000);
    // Create tree planting record with input validation
    const treeRecord = mConStr0([
      farmerHash,
      mConStr0([
        plutusInt(Number(treeData?.latitude || 0) * 1000000),
        plutusInt(Number(treeData?.longitude || 0) * 1000000),
      ]),
      stringToHex(treeData?.treeType || ""), // Handle potential undefined
      plutusInt(currentTimestamp),
      plutusInt(Math.max(1, Number(treeData?.treeCount || 1))),
    ]);

    // Update datum with new tree record
    const treeRecords = [...currentDatum.fields[2], treeRecord];

    const updatedDatum = mConStr0([
      currentDatum.fields[0],
      currentDatum.fields[1],
      treeRecords,
      currentDatum.fields[3],
      currentDatum.fields[4],
    ]);
// Convert the datum to serializable format
    const serializedDatum = serializeBigInt(updatedDatum);
    
    // Create transaction
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
      .spendingReferenceTxInRedeemerValue(
        mConStr1([serializeBigInt(treeRecord)])
      )
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

    // Sign transactionAdd commentMore actions
    let signedTx;
    try {
      signedTx = await wallet.signTx(txDraft);
    } catch (error) {
      console.error("Error signing transaction:", error);
      return false;
    }

    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);
    return true;
  } catch (error) {
    console.error("Error planting trees:", error);
    return false;
  }
}

/**Add commentMore actions
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
    // Get wallet information
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);
 

  // Verify signer is adminAdd commentMore actions
    // Get current contract state  
    const contractUtxos = await nodeProvider.fetchAddressUTxOs(contractAddress);
    if (contractUtxos.length === 0 || !contractUtxos[0].output.plutusData) {
      console.error("No contract UTXO found");
      return false;
    }

    const currentDatum = deserializeDatum<VardanoDatum>(
      contractUtxos[0].output.plutusData
    );

    // Create carbon data record
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const farmerPubKeyHash = carbonData.farmerId;
    const carbonRecord = mConStr0([
      farmerPubKeyHash,
      mInt(Math.floor(carbonData.ndvi * 1000)), // Scale NDVI by 1000
      mInt(Math.floor(carbonData.co2Absorbed * 100)), // Scale CO2 by 100
      mInt(currentTimestamp),
    ]);

    // Update datum with new carbon data
    const carbonRecords = [...currentDatum.fields[3], carbonRecord];
    const updatedDatum = mConStr0([
      currentDatum.fields[0],
      currentDatum.fields[1],
      currentDatum.fields[2],
      carbonRecords,
      currentDatum.fields[4],
    ]);

    // Create transaction
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

    // Sign transactionAdd commentMore actions
    let signedTx;
    try {
      signedTx = await wallet.signTx(txDraft);
    } catch (error) {
      console.error("Error signing transaction:", error);
      return false;
    }

    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);
    return true;
  } catch (error) {
    console.error("Error updating carbon data:", error);
    return false;
  }
}

/**Add commentMore actions
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
    // Get wallet information
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);
    
   // Verify signer is adminAdd commentMore actions

    // Get current contract state 
    const contractUtxos = await nodeProvider.fetchAddressUTxOs(contractAddress);
    if (contractUtxos.length === 0 || !contractUtxos[0].output.plutusData) {
      console.error("No contract UTXO found");
      return false;
    }

    const currentDatum = deserializeDatum<VardanoDatum>(
      contractUtxos[0].output.plutusData
    );

    // Create mint recordAdd commentMore actions
    const farmerPubKeyHash = mintData.farmerId;
    const mintRecord = mConStr0([farmerPubKeyHash, mInt(mintData.amount)]);
    
    const mintRecords = [...currentDatum.fields[4], mintRecord];
// Update datum with new mint record
    const updatedDatum = mConStr0([
      currentDatum.fields[0],
      currentDatum.fields[1],
      currentDatum.fields[2],
      currentDatum.fields[3],
      mintRecords,
    ]);

    // Calculate tokens to mint
    const tokenAsset: Asset = {
      unit: `${tokenPolicyId}.${Buffer.from(tokenName).toString("hex")}`,
      quantity: mintData.amount.toString(),
    };

    // Minimum ADA to send with tokens
    const minAda: Asset = { unit: "lovelace", quantity: "1500000" };

    // Create transaction
    const utxo = contractUtxos[0];
    const txBuild = new MeshTxBuilder({
      fetcher: nodeProvider,
      evaluator: nodeProvider,
      verbose: true,
    });

   // Get farmer's address from pubkeyhashAdd commentMore actions
    const farmerAddress = await nodeProvider.resolveAddress(farmerPubKeyHash);

    const txDraft = await txBuild
      .setNetwork("preprod")
      // Mint COTREE tokens
      .mintAsset(tokenPolicyId, tokenName, mintData.amount)
      // Spend contract UTXO to update datum
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
        mConStr0([farmerPubKeyHash, mintData.amount.toString()])
      )
      // Return UTXO to contract with updated datum
      .txOut(contractAddress, utxo.output.amount)
      .txOutInlineDatumValue(updatedDatum)
      // Send minted tokens to farmer
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

    // Sign transactionAdd commentMore actions
    let signedTx;
    try {
      signedTx = await wallet.signTx(txDraft);
    } catch (error) {
      console.error("Error signing transaction:", error);
      return false;
    }

    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);
    return true;
  } catch (error) {
    console.error("Error minting tokens:", error);
    return false;
  }
}

/**Add commentMore actions
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
     // Get wallet information
    const { walletAddress, utxos, collateral } = await getWalletInfo(wallet);

    
    // Find farmer's token UTXOs
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

    // Calculate total tokens owned
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

    // Minimum ADA to send with tokens
    const minAda: Asset = { unit: "lovelace", quantity: "1500000" };

    // Token asset to send
    const tokenAsset: Asset = {
      unit: `${tokenPolicyId}.${Buffer.from(tokenName).toString("hex")}`,
      quantity: spendData.amount.toString(),
    };

    // Create transaction
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

    // Sign transactionAdd commentMore actions
    let signedTx;
    try {
      signedTx = await wallet.signTx(txDraft);
    } catch (error) {
      console.error("Error signing transaction:", error);
      return false;
    }

    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    console.log("Transaction submitted:", txHash);
    return true;
  } catch (error) {
    console.error("Error spending tokens:", error);
    return false;
  }
}

/**Add commentMore actions
 * Get all contract UTXOs for a specific farmer
 */
export async function getFarmerCarbonData(
  wallet: BrowserWallet
): Promise<CarbonData[]> {
  try {
    const { walletAddress } = await getWalletInfo(wallet);
    const farmerHash = deserializeAddress(walletAddress).pubKeyHash;

    // Get contract UTXOs
    const contractUtxos = await nodeProvider.fetchAddressUTxOs(contractAddress);
    if (contractUtxos.length === 0 || !contractUtxos[0].output.plutusData) {
      return [];
    }

    const currentDatum = deserializeDatum<VardanoDatum>(
      contractUtxos[0].output.plutusData
    );
    const carbonDataList = currentDatum.fields[3];

    // Filter carbon data for this farmer
    return carbonDataList.filter((data) => data.fields[0] === farmerHash);
  } catch (error) {
    console.error("Error getting farmer carbon data:", error);
    return [];
  }
}

/**
 * Get total carbon captured by a farmer
 */
export async function getTotalCarbonCaptured(
  wallet: BrowserWallet
): Promise<number> {
  try {
    const carbonData = await getFarmerCarbonData(wallet);

    // Sum up all CO2 absorbed values
    let totalCO2 = 0;
    carbonData.forEach((data) => {
      totalCO2 += Number(data.fields[2]) / 100; // Divide by 100 to get original value
    });

    return totalCO2;
  } catch (error) {
    console.error("Error getting total carbon captured:", error);
    return 0;
  }
}

/**
 * Get COTREE token balance for a wallet
 */
export async function getCOTREEBalance(wallet: BrowserWallet): Promise<number> {
  try {
    const utxos = await wallet.getUtxos();

    // Find COTREE tokens
    let totalTokens = 0;
    utxos.forEach((utxo) => {
      const assetKey = `${tokenPolicyId}.${Buffer.from(tokenName).toString(
        "hex"
      )}`;
      const asset = utxo.output.amount.find((a) => a.unit === assetKey);
      if (asset) {
        totalTokens += parseInt(asset.quantity);
      }
    });

    return totalTokens;
  } catch (error) {
    console.error("Error getting COTREE balance:", error);
    return 0;
  }
}

// Add this after your nodeProvider initialization
