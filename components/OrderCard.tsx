import React from 'react';
import { Order, Customer, OrderStatus } from '../types';
import { CalendarIcon } from './icons/CalendarIcon';
import { ClockIcon } from './icons/ClockIcon';
import { LocationIcon } from './icons/LocationIcon';
import { UsersIcon } from './icons/UsersIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

interface OrderCardProps {
  order: Order;
  customer?: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

const statusStyles: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  [OrderStatus.CONFIRMED]: 'bg-green-500/20 text-green-300 border-green-500/30',
  [OrderStatus.COMPLETED]: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  [OrderStatus.CANCELLED]: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const OrderCard: React.FC<OrderCardProps> = ({ order, customer, onEdit, onDelete }) => {
  const formattedDate = new Date(order.eventDate).toLocaleDateString('cs-CZ', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const totalPriceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(order.totalPrice);

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-yellow-500/10 hover:ring-1 hover:ring-slate-700">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">{customer?.name || 'Neznámý zákazník'}</h3>
            <p className="text-sm text-gray-400">{customer?.contactPerson}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusStyles[order.status]}`}>
            {order.status}
          </span>
        </div>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-300">
            <LocationIcon className="w-4 h-4 text-yellow-400" />
            <span>{order.eventLocation}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <CalendarIcon className="w-4 h-4 text-yellow-400" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <ClockIcon className="w-4 h-4 text-yellow-400" />
            <span>{order.startTime}</span>
          </div>
           <div className="flex items-center gap-3 text-gray-300">
            <UsersIcon className="w-4 h-4 text-yellow-400" />
            <span>{order.staff.map(s => s.name).join(', ')}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700">
          <ul className="space-y-1 text-sm">
            {order.tables.map(table => (
              <li key={table.type} className="flex justify-between text-gray-400">
                <span>{table.quantity}x {table.type}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="bg-slate-800/50 p-3 flex justify-between items-center">
         <p className="text-lg font-bold text-yellow-400">{totalPriceFormatted}</p>
         <div className="flex gap-2">
            <button onClick={onEdit} className="p-2 text-gray-400 hover:text-white transition-colors"><EditIcon /></button>
            <button onClick={onDelete} className="p-2 text-red-500 hover:text-red-400 transition-colors"><TrashIcon /></button>
         </div>
      </div>
    </div>
  );
};

export default OrderCard;
