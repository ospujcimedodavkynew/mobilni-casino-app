import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { SettingsIcon } from './icons/SettingsIcon';
import { UserPlusIcon } from './icons/UserPlusIcon';
import { UsersIcon } from './icons/UsersIcon';

interface HeaderProps {
  onNewOrder: () => void;
  onNewCustomer: () => void;
  onShowSettings: () => void;
  onManageStaff: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNewOrder, onNewCustomer, onShowSettings, onManageStaff }) => {
  return (
    <header className="bg-slate-800/50 backdrop-blur-sm sticky top-0 z-30 shadow-md mb-8">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          Casino<span className="text-yellow-400">Manager</span>
        </h1>
        <div className="flex items-center gap-3">
           <button onClick={onNewCustomer} className="hidden sm:flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm">
            <UserPlusIcon className="w-5 h-5" />
            <span>Nový zákazník</span>
          </button>
          <button onClick={onManageStaff} className="p-2 text-gray-300 hover:text-white transition-colors" title="Spravovat personál">
            <UsersIcon className="w-6 h-6"/>
          </button>
          <button onClick={onShowSettings} className="p-2 text-gray-300 hover:text-white transition-colors" title="Nastavení">
            <SettingsIcon />
          </button>
          <button onClick={onNewOrder} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-4 rounded-md transition-colors">
            <PlusIcon />
            <span className="hidden sm:inline">Nová objednávka</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
