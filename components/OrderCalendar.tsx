import React, { useState } from 'react';
import { Order, Customer, OrderStatus } from '../types';

interface OrderCalendarProps {
  orders: Order[];
  customers: Customer[];
  onSelectOrder: (order: Order) => void;
}

const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'bg-blue-600 hover:bg-blue-500',
    [OrderStatus.CONFIRMED]: 'bg-green-600 hover:bg-green-500',
    [OrderStatus.COMPLETED]: 'bg-gray-600 hover:bg-gray-500',
    [OrderStatus.CANCELLED]: 'bg-red-600 hover:bg-red-500',
};


const OrderCalendar: React.FC<OrderCalendarProps> = ({ orders, customers, onSelectOrder }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay() === 0 ? 6 : startOfMonth.getDay() - 1; // Monday is 0
  const daysInMonth = endOfMonth.getDate();

  const days = Array.from({ length: startDay }, (_, i) => <div key={`empty-start-${i}`} className="border-r border-b border-slate-700"></div>);
  
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    const todaysOrders = orders.filter(o => o.eventDate === dateString);

    days.push(
      <div key={day} className="border-r border-b border-slate-700 p-2 min-h-[120px] flex flex-col">
        <span className="font-bold text-white">{day}</span>
        <div className="mt-1 space-y-1 overflow-y-auto">
            {todaysOrders.map(order => {
                const customer = customers.find(c => c.id === order.customerId);
                return (
                    <div 
                        key={order.id} 
                        className={`p-1.5 rounded-md text-white text-xs cursor-pointer ${statusColors[order.status]}`}
                        onClick={() => onSelectOrder(order)}
                        title={`${customer?.name || 'Neznámý'} - ${order.eventLocation}`}
                    >
                        <p className="font-semibold truncate">{customer?.name || 'Neznámý'}</p>
                        <p className="truncate">{order.eventLocation}</p>
                    </div>
                )
            })}
        </div>
      </div>
    );
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const weekDays = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg p-4">
        <div className="flex justify-between items-center mb-4">
            <button onClick={handlePrevMonth} className="px-3 py-1 bg-slate-700 rounded-md hover:bg-slate-600 text-white">&lt;</button>
            <h2 className="text-xl font-bold text-white capitalize">
                {currentDate.toLocaleString('cs-CZ', { month: 'long', year: 'numeric' })}
            </h2>
            <button onClick={handleNextMonth} className="px-3 py-1 bg-slate-700 rounded-md hover:bg-slate-600 text-white">&gt;</button>
        </div>
        <div className="grid grid-cols-7 border-t border-l border-slate-700">
            {weekDays.map(day => (
                 <div key={day} className="text-center font-semibold text-yellow-400 py-2 border-r border-b border-slate-700 bg-slate-900/50">{day}</div>
            ))}
            {days}
        </div>
    </div>
  );
};

export default OrderCalendar;
