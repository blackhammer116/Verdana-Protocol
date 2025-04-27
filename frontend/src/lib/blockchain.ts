import { Transaction, ForgeScript, AppWallet, largestFirst, resolvePaymentKeyHash, resolvePlutusScriptAddress } from "@meshsdk/core";
import type { Data } from "@meshsdk/core";
import type { Datum, Redeemer } from "./types";

// Smart contract address on testnet (this would be the actual address after deployment)
const SCRIPT_ADDRESS = "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8";

export async function plantTree(
  wallet: AppWallet,
  datum: Datum,
  treeData: {
    treeType: string;
    latitude: number;
    longitude: number;
  }
) {
  try {
    const tx = new Transaction({ initiator: wallet });
    
    // Convert tree data to CBOR format for datum
    const plutusDatum: Data = {
      alternative: 0,
      fields: [
        datum.farmerId,
        datum.treesPlanted,
        datum.carbonCaptured,
        Math.floor(treeData.latitude * 1000000), // Convert to integer
        Math.floor(treeData.longitude * 1000000),
        Buffer.from(treeData.treeType).toString("hex"),
      ],
    };

    // Add output to script address with datum
    tx.setScriptAddress(SCRIPT_ADDRESS);
    tx.setDatum(plutusDatum);
    
    // Add collateral
    const collateral = await wallet.getCollateral();
    tx.setCollateral(collateral);

    // Add change address
    const changeAddress = await wallet.getChangeAddress();
    tx.setChangeAddress(changeAddress);

    // Build and sign transaction
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    
    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    return txHash;
  } catch (error) {
    console.error("Error planting tree:", error);
    throw error;
  }
}

export async function claimCarbonTokens(
  wallet: AppWallet,
  datum: Datum,
  redeemer: Redeemer
) {
  try {
    const tx = new Transaction({ initiator: wallet });
    
    // Convert redeemer to CBOR format
    const plutusRedeemer: Data = {
      alternative: 1, // ClaimReward constructor
      fields: [],
    };

    // Add script input
    tx.setScriptAddress(SCRIPT_ADDRESS);
    tx.setRedeemer(plutusRedeemer);
    
    // Add collateral
    const collateral = await wallet.getCollateral();
    tx.setCollateral(collateral);

    // Add change address
    const changeAddress = await wallet.getChangeAddress();
    tx.setChangeAddress(changeAddress);

    // Build and sign transaction
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    
    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    return txHash;
  } catch (error) {
    console.error("Error claiming tokens:", error);
    throw error;
  }
}

export async function updateTreeGrowth(
  wallet: AppWallet,
  datum: Datum,
  treeData: {
    trees: number;
    carbon: number;
  }
) {
  try {
    const tx = new Transaction({ initiator: wallet });
    
    // Convert redeemer to CBOR format
    const plutusRedeemer: Data = {
      alternative: 0, // TreePlanted constructor
      fields: [
        treeData.trees,
        treeData.carbon,
      ],
    };

    // Add script input
    tx.setScriptAddress(SCRIPT_ADDRESS);
    tx.setRedeemer(plutusRedeemer);
    
    // Add collateral
    const collateral = await wallet.getCollateral();
    tx.setCollateral(collateral);

    // Add change address
    const changeAddress = await wallet.getChangeAddress();
    tx.setChangeAddress(changeAddress);

    // Build and sign transaction
    const unsignedTx = await tx.build();
    const signedTx = await wallet.signTx(unsignedTx);
    
    // Submit transaction
    const txHash = await wallet.submitTx(signedTx);
    return txHash;
  } catch (error) {
    console.error("Error updating tree growth:", error);
    throw error;
  }
}