import React, { useState } from 'react';

interface PlantFormProps {
  onSubmit: (data: any) => void;
}

export const PlantForm: React.FC<PlantFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    treeType: 'eucalyptus',
    treeCount: '1',
    plotSize: '0.1',
    description: '',
  });

  const treeTypes = [
    { id: 'eucalyptus', name: 'Eucalyptus', co2Factor: 21.1 },
    { id: 'pine', name: 'Pine', co2Factor: 18.3 },
    { id: 'oak', name: 'Oak', co2Factor: 22.5 },
    { id: 'maple', name: 'Maple', co2Factor: 19.2 },
    { id: 'fruit', name: 'Fruit Trees', co2Factor: 12.8 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Calculate estimated CO2 absorption
  const selectedTree = treeTypes.find(tree => tree.id === formData.treeType);
  const estimatedCO2 = selectedTree ? 
    (parseFloat(formData.treeCount) * selectedTree.co2Factor).toFixed(2) : 
    '0.00';

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Plant New Trees</h2>
      <p className="mb-4 text-gray-600">
        Record your tree planting activity to start earning carbon credits.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tree Type</label>
            <select
              name="treeType"
              value={formData.treeType}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            >
              {treeTypes.map(tree => (
                <option key={tree.id} value={tree.id}>
                  {tree.name} (CO₂ Factor: {tree.co2Factor})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Trees</label>
            <input
              type="number"
              name="treeCount"
              value={formData.treeCount}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plot Size (hectares)</label>
            <input
              type="number"
              name="plotSize"
              value={formData.plotSize}
              onChange={handleChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estimated CO₂ Absorption (kg/year)</label>
            <input
              type="text"
              value={estimatedCO2}
              readOnly
              className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            placeholder="Any additional details about your planting"
          ></textarea>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="w-full bg-green-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Plant Trees
          </button>
        </div>
      </form>
    </div>
  );
};