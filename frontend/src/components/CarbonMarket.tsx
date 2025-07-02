import React, { useState } from 'react';

interface CarbonMarketProps {
  tokenBalance: number;
  wallet: any;
  connected: boolean;
}

export const CarbonMarket: React.FC<CarbonMarketProps> = ({ 
  tokenBalance, 
  connected
}) => {
  const [sellAmount, setSellAmount] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Mock carbon credit market data
  const marketData = [
    { 
      id: 1, 
      buyer: 'CleanEnergy Corp', 
      pricePerToken: 0.06, 
      amountWanted: 500, 
      description: 'Offsetting energy production emissions'
    },
    { 
      id: 2, 
      buyer: 'GreenTransport Ltd', 
      pricePerToken: 0.058, 
      amountWanted: 1200, 
      description: 'Carbon neutral shipping initiative'
    },
    { 
      id: 3, 
      buyer: 'EcoTech Solutions', 
      pricePerToken: 0.062, 
      amountWanted: 800, 
      description: 'Annual carbon offset program'
    },
  ];
  
  const handleSellAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSellAmount(e.target.value);
  };
  
  const handleSell = async () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }
    
    const amount = parseInt(sellAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (amount > tokenBalance) {
      alert('You don\'t have enough tokens');
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be a blockchain transaction
      // For the demo, we'll simulate it
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful transaction
      alert(`Successfully sold ${amount} COTREE tokens!`);
      setSellAmount('');
    } catch (error) {
      console.error('Sale error:', error);
      alert('Transaction failed. Please try again.');
    }
    
    setLoading(false);
  };
  
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Carbon Credit Market</h2>
        <p className="text-gray-600">
          Sell your COTREE tokens to organizations looking to offset their carbon emissions.
        </p>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
        <div className="flex items-center mb-2">
          <span className="text-2xl mr-2">🪙</span>
          <h4 className="font-medium">Your COTREE Balance</h4>
        </div>
        <p className="text-3xl font-bold text-blue-800">{tokenBalance}</p>
        <p className="text-sm text-gray-600 mt-1">
          Estimated value: ${(tokenBalance * 0.06).toFixed(2)} USD
        </p>
      </div>
      
      <div className="space-y-4">
        <h3 className="font-medium">Available Buyers</h3>
        
        {marketData.map(buyer => (
          <div key={buyer.id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex justify-between mb-2">
              <h4 className="font-semibold">{buyer.buyer}</h4>
              <span className="text-green-600 font-medium">
                ${buyer.pricePerToken.toFixed(3)} / token
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-2">{buyer.description}</p>
            
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>Wants: {buyer.amountWanted} tokens</span>
              <span>Total value: ${(buyer.amountWanted * buyer.pricePerToken).toFixed(2)}</span>
            </div>
            
            <div className="flex space-x-2">
              <input
                type="number"
                value={sellAmount}
                onChange={handleSellAmountChange}
                placeholder="Amount to sell"
                min="1"
                max={tokenBalance}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
              <button
                onClick={() => handleSell(buyer.id)}
                disabled={loading || !connected || parseInt(sellAmount) > tokenBalance}
                className={`px-4 py-2 rounded-md text-white ${
                  loading || !connected || parseInt(sellAmount) > tokenBalance
                    ? 'bg-gray-400'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {loading ? 'Processing...' : 'Sell'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};