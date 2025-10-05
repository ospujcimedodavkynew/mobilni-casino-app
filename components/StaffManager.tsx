import React, { useState } from 'react';
import { StaffMember } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';

interface StaffManagerProps {
  staff: StaffMember[];
  onAdd: (name: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const StaffManager: React.FC<StaffManagerProps> = ({ staff, onAdd, onDelete, onClose }) => {
  const [newStaffName, setNewStaffName] = useState('');

  const handleAdd = () => {
    if (newStaffName.trim()) {
      onAdd(newStaffName.trim());
      setNewStaffName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Správa personálu</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {staff.map(member => (
              <div key={member.id} className="flex justify-between items-center bg-slate-700 p-2 rounded-md">
                <span className="text-white">{member.name}</span>
                <button onClick={() => onDelete(member.id)} className="p-1 text-red-500 hover:text-red-400">
                  <TrashIcon />
                </button>
              </div>
            ))}
             {staff.length === 0 && <p className="text-gray-400 text-center">Žádný personál nebyl přidán.</p>}
          </div>
          <div className="mt-6">
             <label htmlFor="newStaffName" className="block text-sm font-medium text-gray-300 mb-1">Přidat člena personálu</label>
            <div className="flex gap-2">
                <input
                  id="newStaffName"
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Jméno a příjmení"
                  className="flex-grow bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500"
                />
                <button onClick={handleAdd} className="bg-yellow-500 text-slate-900 p-2 rounded-md hover:bg-yellow-600 flex items-center justify-center font-semibold shrink-0">
                  <UserPlusIcon className="w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
        <div className="bg-slate-900/50 px-6 py-4 flex justify-end">
             <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md">Zavřít</button>
        </div>
      </div>
    </div>
  );
};

export default StaffManager;
