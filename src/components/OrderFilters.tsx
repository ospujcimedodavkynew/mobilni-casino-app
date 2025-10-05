import React from 'react';
import { OrderStatus } from '../types';

interface OrderFiltersProps {
  onSearch: (query: string) => void;
  onStatusChange: (status: OrderStatus | 'ALL') => void;
  currentStatus: OrderStatus | 'ALL';
}

const OrderFilters: React.FC<OrderFiltersProps> = ({ onSearch, onStatusChange, currentStatus }) => {
  const statuses: (OrderStatus | 'ALL')[] = ['ALL', ...Object.values(OrderStatus)];

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-grow">
        <input
          type="text"
          placeholder="Hledat podle zákazníka nebo místa..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500"
        />
      </div>
      <div className="flex items-center gap-2 bg-slate-800 p-1 rounded-md">
        {statuses.map(status => {
          const statusText = status === 'ALL' ? 'Vše' : status;
          return (
            <button
              key={status}
              onClick={() => onStatusChange(status)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                currentStatus === status
                  ? 'bg-yellow-500 text-slate-900'
                  : 'bg-transparent text-gray-300 hover:bg-slate-700'
              }`}
            >
              {statusText}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OrderFilters;