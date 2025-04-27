import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Truncate wallet or transaction address
export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 8)}...${address.substring(address.length - 8)}`;
}

// Simulate a blockchain transaction
export async function simulateTransaction(type: 'plant' | 'mint' | 'transfer', data: any) {
  // In a real implementation, this would interact with MeshJS to create and submit transactions
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactionId: `tx${Math.random().toString(36).substring(2, 15)}`,
        status: 'confirmed'
      });
    }, 2000);
  });
}

// Calculate CO2 absorption based on tree type and age
export function calculateCO2Absorption(treeType: string, ageInMonths: number): number {
  // Rough estimation based on tree type and age
  const baseRates: Record<string, number> = {
    'Eucalyptus': 0.025,
    'Acacia': 0.020,
    'Baobab': 0.035,
    'Neem': 0.018,
    'Mango': 0.022,
  };
  
  const baseRate = baseRates[treeType] || 0.02;
  return baseRate * ageInMonths;
}

// Format monetary values
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}