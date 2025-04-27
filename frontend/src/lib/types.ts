// Farmer type for registration and profile data
export interface Farmer {
  id: string;
  name: string;
  walletAddress: string;
  location: {
    latitude: number;
    longitude: number;
  };
  registeredAt: Date;
}

// Tree data type for monitoring and visualization
export interface Tree {
  id: string;
  farmerId: string;
  treeType: string;
  plantedAt: Date;
  location: {
    latitude: number;
    longitude: number;
  };
  growthStage: number; // 0-3, where 0 is newly planted, 3 is mature
  healthScore: number; // 0-100
}

// Carbon token type
export interface CarbonToken {
  id: string;
  farmerId: string;
  amount: number;
  co2Captured: number;
  mintedAt: Date;
  transactionId?: string;
}

// Monitoring data from "satellite" imagery
export interface MonitoringData {
  farmerId: string;
  timestamp: Date;
  ndvi: number; // Normalized Difference Vegetation Index
  treeCount: number;
  area: number; // in hectares
  estimatedCO2: number;
  imageUrl: string;
}

// Transaction type for blockchain
export interface Transaction {
  id: string;
  type: 'plant' | 'mint' | 'transfer';
  farmerId: string;
  amount?: number;
  tokenId?: string;
  timestamp: Date;
  status: 'pending' | 'confirmed' | 'failed';
  data?: any;
}

// Smart contract datum type
export interface Datum {
  farmerId: string;
  treesPlanted: number;
  carbonCaptured: number;
  latitude: number;
  longitude: number;
  treeType: string;
}

// Smart contract redeemer type
export interface Redeemer {
  type: 'TreePlanted' | 'ClaimReward';
  trees?: number;
  carbon?: number;
}