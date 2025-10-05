import React from 'react';
import { Order, OrderStatus } from '../types';
import StatCard from './StatCard';
import { CalendarIcon } from './icons/CalendarIcon';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { StarIcon } from './icons/StarIcon';
import { ClockIcon } from './icons/ClockIcon';

interface DashboardProps {
  orders: Order[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders }) => {
  const totalRevenue = orders
    .filter(o => o.status === OrderStatus.COMPLETED)
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const upcomingEvents = orders.filter(o => {
    const eventDate = new Date(o.eventDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today && o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.COMPLETED;
  }).length;

  const pendingOrders = orders.filter(o => o.status === OrderStatus.PENDING).length;
  
  const mostPopularTable = orders
    .flatMap(o => o.tables)
    .reduce((acc, table) => {
        acc[table.type] = (acc[table.type] || 0) + table.quantity;
        return acc;
    }, {} as Record<string, number>);

  const popularTable = Object.entries(mostPopularTable).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  
  const totalRevenueFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(totalRevenue);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        icon={<DollarSignIcon className="w-6 h-6" />}
        title="Celkové tržby (dokončené)"
        value={totalRevenueFormatted}
        description="Ze všech dokončených objednávek"
      />
      <StatCard
        icon={<CalendarIcon className="w-6 h-6" />}
        title="Nadcházející akce"
        value={upcomingEvents.toString()}
        description="Potvrzené a čekající akce"
      />
      <StatCard
        icon={<ClockIcon className="w-6 h-6" />}
        title="Čekající objednávky"
        value={pendingOrders.toString()}
        description="Vyžaduje potvrzení"
      />
      <StatCard
        icon={<StarIcon className="w-6 h-6" />}
        title="Nejoblíbenější stůl"
        value={popularTable}
        description="Nejčastěji objednávaný stůl"
      />
    </div>
  );
};

export default Dashboard;
