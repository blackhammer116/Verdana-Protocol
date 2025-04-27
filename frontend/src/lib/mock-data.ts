import { CarbonToken, Farmer, MonitoringData, Transaction, Tree } from './types';

// Sample farmer data
export const mockFarmers: Farmer[] = [
  {
    id: '1',
    name: 'John Doe',
    walletAddress: 'addr_test1qqavvvxt0vdj894p8v4shxhpzdnjzcmpvyrayke3sxr3em8xvn9vx3qt9z57u8k254vuenjxphjxxc8cyg3ka092xcaqdrdrnx',
    location: {
      latitude: 8.9806,
      longitude: 38.7578,
    },
    registeredAt: new Date('2023-01-15'),
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    walletAddress: 'addr1qy4tl2lh30yv929d9nyze8yeavej6w60qkv3dnw8ggz95xzqcpv4wmpxqce6xh0vvtpmns7hwr8254j7eymxp2tj7ljsajl85m',
    location: {
      latitude: 12.6392,
      longitude: -8.0029,
    },
    registeredAt: new Date('2023-02-10'),
  },
  {
    id: '3',
    name: 'Ibrahim Sow',
    walletAddress: 'addr1q8ekp2fsn07m9d9qm7956r7ylx67y6vuh955p7skyw9vm93ygvjeaqypy65j6wd5rqs0qvm0jmh06mntrk5varnu9rqslnrkey',
    location: {
      latitude: 9.0765,
      longitude: 7.3986,
    },
    registeredAt: new Date('2023-03-05'),
  },
];

// Sample tree data
export const mockTrees: Tree[] = [
  {
    id: '1',
    farmerId: '1',
    treeType: 'Eucalyptus',
    plantedAt: new Date('2023-04-10'),
    location: {
      latitude: 8.9826,
      longitude: 38.7568,
    },
    growthStage: 2,
    healthScore: 85,
  },
  {
    id: '2',
    farmerId: '1',
    treeType: 'Acacia',
    plantedAt: new Date('2023-04-15'),
    location: {
      latitude: 8.9816,
      longitude: 38.7588,
    },
    growthStage: 1,
    healthScore: 78,
  },
  {
    id: '3',
    farmerId: '2',
    treeType: 'Baobab',
    plantedAt: new Date('2023-05-01'),
    location: {
      latitude: 12.6412,
      longitude: -8.0049,
    },
    growthStage: 3,
    healthScore: 92,
  },
  {
    id: '4',
    farmerId: '3',
    treeType: 'Neem',
    plantedAt: new Date('2023-05-10'),
    location: {
      latitude: 9.0755,
      longitude: 7.3996,
    },
    growthStage: 2,
    healthScore: 88,
  },
];

// Sample monitoring data
export const mockMonitoringData: MonitoringData[] = [
  {
    farmerId: '1',
    timestamp: new Date('2023-06-15'),
    ndvi: 0.78,
    treeCount: 25,
    area: 1.2,
    estimatedCO2: 3.5,
    imageUrl: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
  },
  {
    farmerId: '1',
    timestamp: new Date('2023-07-15'),
    ndvi: 0.81,
    treeCount: 25,
    area: 1.2,
    estimatedCO2: 4.2,
    imageUrl: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg',
  },
  {
    farmerId: '2',
    timestamp: new Date('2023-06-20'),
    ndvi: 0.85,
    treeCount: 40,
    area: 2.5,
    estimatedCO2: 6.8,
    imageUrl: 'https://images.pexels.com/photos/167698/pexels-photo-167698.jpeg',
  },
  {
    farmerId: '3',
    timestamp: new Date('2023-07-01'),
    ndvi: 0.72,
    treeCount: 15,
    area: 0.8,
    estimatedCO2: 2.1,
    imageUrl: 'https://images.pexels.com/photos/338936/pexels-photo-338936.jpeg',
  },
];

// Sample carbon token data
export const mockCarbonTokens: CarbonToken[] = [
  {
    id: '1',
    farmerId: '1',
    amount: 35,
    co2Captured: 3.5,
    mintedAt: new Date('2023-06-20'),
    transactionId: 'tx1abc123def456',
  },
  {
    id: '2',
    farmerId: '1',
    amount: 7,
    co2Captured: 0.7,
    mintedAt: new Date('2023-07-20'),
    transactionId: 'tx2abc456def789',
  },
  {
    id: '3',
    farmerId: '2',
    amount: 68,
    co2Captured: 6.8,
    mintedAt: new Date('2023-06-25'),
    transactionId: 'tx3def789ghi012',
  },
  {
    id: '4',
    farmerId: '3',
    amount: 21,
    co2Captured: 2.1,
    mintedAt: new Date('2023-07-05'),
    transactionId: 'tx4ghi012jkl345',
  },
];

// Sample transaction data
export const mockTransactions: Transaction[] = [
  {
    id: 'tx1abc123def456',
    type: 'mint',
    farmerId: '1',
    amount: 35,
    tokenId: '1',
    timestamp: new Date('2023-06-20'),
    status: 'confirmed',
  },
  {
    id: 'tx2abc456def789',
    type: 'mint',
    farmerId: '1',
    amount: 7,
    tokenId: '2',
    timestamp: new Date('2023-07-20'),
    status: 'confirmed',
  },
  {
    id: 'tx3def789ghi012',
    type: 'mint',
    farmerId: '2',
    amount: 68,
    tokenId: '3',
    timestamp: new Date('2023-06-25'),
    status: 'confirmed',
  },
  {
    id: 'tx4ghi012jkl345',
    type: 'mint',
    farmerId: '3',
    amount: 21,
    tokenId: '4',
    timestamp: new Date('2023-07-05'),
    status: 'confirmed',
  },
  {
    id: 'tx5jkl345mno678',
    type: 'transfer',
    farmerId: '2',
    amount: 20,
    tokenId: '3',
    timestamp: new Date('2023-07-10'),
    status: 'confirmed',
    data: {
      recipient: 'Carbon Credit Exchange',
      price: 120,
    },
  },
];

// Function to get a farmer's trees
export function getFarmerTrees(farmerId: string): Tree[] {
  return mockTrees.filter(tree => tree.farmerId === farmerId);
}

// Function to get a farmer's monitoring data
export function getFarmerMonitoringData(farmerId: string): MonitoringData[] {
  return mockMonitoringData.filter(data => data.farmerId === farmerId);
}

// Function to get a farmer's carbon tokens
export function getFarmerCarbonTokens(farmerId: string): CarbonToken[] {
  return mockCarbonTokens.filter(token => token.farmerId === farmerId);
}

// Function to get a farmer's transactions
export function getFarmerTransactions(farmerId: string): Transaction[] {
  return mockTransactions.filter(tx => tx.farmerId === farmerId);
}

// Function to plant a new tree
export function plantTree(tree: Omit<Tree, 'id' | 'growthStage' | 'healthScore'>): Tree {
  const newTree: Tree = {
    id: `${mockTrees.length + 1}`,
    growthStage: 0,
    healthScore: 70 + Math.floor(Math.random() * 20),
    ...tree,
  };
  mockTrees.push(newTree);
  return newTree;
}

// Function to update tree growth (simulation)
export function growTrees() {
  mockTrees.forEach(tree => {
    if (tree.growthStage < 3) {
      tree.growthStage += 1;
      tree.healthScore = Math.min(tree.healthScore + 5, 100);
    }
  });
}