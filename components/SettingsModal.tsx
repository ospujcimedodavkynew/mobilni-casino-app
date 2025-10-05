import React, { useState } from 'react';
import { TableType } from '../types';

interface SettingsModalProps {
  currentPrices: Record<TableType, number>;
  onSave: (newPrices: Record<TableType, number>) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ currentPrices, onSave, onClose }) => {
  const [prices, setPrices] = useState(currentPrices);

  const handleChange = (type: TableType, value: string) => {
    const newPrice = parseInt(value, 10);
    if (!isNaN(newPrice)) {
      setPrices(prev => ({ ...prev, [type]: newPrice }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(prices);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Nastavení cen stolů</h2>
            <div className="space-y-4">
              {Object.entries(prices).map(([type, price]) => (
                <div key={type}>
                  <label htmlFor={type} className="block text-sm font-medium text-gray-300 mb-1">{type}</label>
                  <div className="relative">
                     <input
                        type="number"
                        id={type}
                        name={type}
                        value={price}
                        onChange={(e) => handleChange(type as TableType, e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 pl-10 text-white focus:ring-yellow-500 focus:border-yellow-500"
                        />
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">Kč</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-900/50 px-6 py-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md">Zrušit</button>
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-4 rounded-md">Uložit ceny</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;
