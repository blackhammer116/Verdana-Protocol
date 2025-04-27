import React from 'react';

interface DashboardProps {
  address: string;
  treeCount: number;
  carbonAbsorbed: number;
  tokenBalance: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  address, 
  treeCount, 
  carbonAbsorbed, 
  tokenBalance 
}) => {
  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Your Wallet</h3>
        <p className="text-sm text-gray-500 break-all">{address}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🌳</span>
            <h4 className="font-medium">Trees Planted</h4>
          </div>
          <p className="text-3xl font-bold text-green-800">{treeCount}</p>
          <p className="text-sm text-gray-600 mt-1">
            {treeCount === 1 ? 'tree' : 'trees'} contributing to a greener planet
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">💨</span>
            <h4 className="font-medium">CO₂ Absorbed</h4>
          </div>
          <p className="text-3xl font-bold text-blue-800">{carbonAbsorbed.toFixed(2)} kg</p>
          <p className="text-sm text-gray-600 mt-1">
            Equivalent to {(carbonAbsorbed * 0.004).toFixed(2)} car trips
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">🪙</span>
            <h4 className="font-medium">COTREE Tokens</h4>
          </div>
          <p className="text-3xl font-bold text-purple-800">{tokenBalance}</p>
          <p className="text-sm text-gray-600 mt-1">
            Estimated value: ${(tokenBalance * 0.06).toFixed(2)} USD
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="font-medium mb-2">Recent Activity</h3>
        {treeCount > 0 ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
              <div>
                <p className="font-medium">Tree Planting</p>
                <p className="text-sm text-gray-600">
                  {treeCount} trees planted
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            
            {carbonAbsorbed > 0 && (
              <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                <div>
                  <p className="font-medium">Carbon Absorption</p>
                  <p className="text-sm text-gray-600">
                    {carbonAbsorbed.toFixed(2)} kg CO₂ absorbed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            
            {tokenBalance > 0 && (
              <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-100">
                <div>
                  <p className="font-medium">Tokens Minted</p>
                  <p className="text-sm text-gray-600">
                    {tokenBalance} COTREE tokens received
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No activity yet. Start by planting trees!
          </p>
        )}
      </div>
    </div>
  );
};