import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import OrderForm from './components/OrderForm';
import CustomerForm from './components/CustomerForm';
import SettingsModal from './components/SettingsModal';
import StaffManager from './components/StaffManager';
import OrderCalendar from './components/OrderCalendar';
import ViewSwitcher, { ViewMode } from './components/ViewSwitcher';
import OrderFilters from './components/OrderFilters';
import { Order, Customer, StaffMember, TableType, OrderStatus } from './types';
import { INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_STAFF, DEFAULT_TABLE_PRICES } from './constants';
import { getFromStorage, saveToStorage } from './utils/storage';
import OrderCard from './components/OrderCard';

const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(() => getFromStorage('orders', INITIAL_ORDERS));
  const [customers, setCustomers] = useState<Customer[]>(() => getFromStorage('customers', INITIAL_CUSTOMERS));
  const [staff, setStaff] = useState<StaffMember[]>(() => getFromStorage('staff', INITIAL_STAFF));
  const [tablePrices, setTablePrices] = useState<Record<TableType, number>>(() => getFromStorage('tablePrices', DEFAULT_TABLE_PRICES));

  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isStaffManagerOpen, setIsStaffManagerOpen] = useState(false);
  
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  useEffect(() => { saveToStorage('orders', orders); }, [orders]);
  useEffect(() => { saveToStorage('customers', customers); }, [customers]);
  useEffect(() => { saveToStorage('staff', staff); }, [staff]);
  useEffect(() => { saveToStorage('tablePrices', tablePrices); }, [tablePrices]);

  const handleNewOrder = () => {
    setEditingOrder(null);
    setIsOrderFormOpen(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order);
    setIsOrderFormOpen(true);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleSaveOrder = (order: Order) => {
    setOrders(prev => {
      const exists = prev.some(o => o.id === order.id);
      if (exists) {
        return prev.map(o => o.id === order.id ? order : o);
      }
      return [...prev, order];
    });
    setIsOrderFormOpen(false);
    setEditingOrder(null);
  };
  
  const handleSaveCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
    setIsCustomerFormOpen(false);
  }
  
  const handleAddStaff = (name: string) => {
    const newStaffMember: StaffMember = { id: `staff_${Date.now()}`, name };
    setStaff(prev => [...prev, newStaffMember]);
  };
  
  const handleDeleteStaff = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };
  
  const handleSavePrices = (newPrices: Record<TableType, number>) => {
    setTablePrices(newPrices);
    setIsSettingsModalOpen(false);
  }

  const filteredOrders = useMemo(() => {
    return orders
      .filter(order => {
        if (statusFilter === 'ALL') return true;
        return order.status === statusFilter;
      })
      .filter(order => {
        const customer = customers.find(c => c.id === order.customerId);
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          customer?.name.toLowerCase().includes(lowerCaseQuery) ||
          order.eventLocation.toLowerCase().includes(lowerCaseQuery)
        );
      })
      .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime());
  }, [orders, customers, searchQuery, statusFilter]);

  return (
    <div className="bg-slate-900 min-h-screen text-gray-200 font-sans">
      <Header
        onNewOrder={handleNewOrder}
        onNewCustomer={() => setIsCustomerFormOpen(true)}
        onShowSettings={() => setIsSettingsModalOpen(true)}
        onManageStaff={() => setIsStaffManagerOpen(true)}
      />
      <main className="container mx-auto px-4 pb-8">
        <Dashboard orders={orders} />
        
        <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-6">
            <div className="w-full lg:flex-grow">
                 {viewMode === 'list' && <OrderFilters onSearch={setSearchQuery} onStatusChange={setStatusFilter} currentStatus={statusFilter} />}
            </div>
            <div className="w-full lg:w-auto flex justify-center lg:justify-end">
                <ViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
            </div>
        </div>
        
        {viewMode === 'list' ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map(order => (
                    <OrderCard
                        key={order.id}
                        order={order}
                        customer={customers.find(c => c.id === order.customerId)}
                        onEdit={() => handleEditOrder(order)}
                        onDelete={() => {
                            if(window.confirm('Opravdu si přejete smazat tuto objednávku?')) {
                                handleDeleteOrder(order.id)
                            }
                        }}
                    />
                ))}
             </div>
        ) : (
            <OrderCalendar 
              orders={orders} 
              customers={customers}
              onSelectOrder={handleEditOrder}
            />
        )}
        
        {filteredOrders.length === 0 && viewMode === 'list' && (
            <div className="text-center py-10">
                <p className="text-gray-500 text-lg">Nebyly nalezeny žádné objednávky odpovídající filtrům.</p>
            </div>
        )}

      </main>

      {isOrderFormOpen && (
        <OrderForm
          order={editingOrder}
          customers={customers}
          staff={staff}
          tablePrices={tablePrices}
          onSave={handleSaveOrder}
          onClose={() => setIsOrderFormOpen(false)}
        />
      )}

      {isCustomerFormOpen && (
          <CustomerForm
            onSave={handleSaveCustomer}
            onClose={() => setIsCustomerFormOpen(false)}
          />
      )}

      {isSettingsModalOpen && (
          <SettingsModal
            currentPrices={tablePrices}
            onSave={handleSavePrices}
            onClose={() => setIsSettingsModalOpen(false)}
          />
      )}

      {isStaffManagerOpen && (
        <StaffManager
          staff={staff}
          onAdd={handleAddStaff}
          onDelete={handleDeleteStaff}
          onClose={() => setIsStaffManagerOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
