import React, { useState, useEffect } from 'react';
import { Order, Customer, StaffMember, TableType, GameTable, OrderStatus } from '../types';

interface OrderFormProps {
  order?: Order | null;
  customers: Customer[];
  staff: StaffMember[];
  tablePrices: Record<TableType, number>;
  onSave: (order: Order) => void;
  onClose: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ order, customers, staff, tablePrices, onSave, onClose }) => {
  const [formData, setFormData] = useState<Omit<Order, 'id' | 'totalPrice'>>({
    customerId: order?.customerId || '',
    eventLocation: order?.eventLocation || '',
    eventDate: order?.eventDate || '',
    startTime: order?.startTime || '19:00',
    tables: order?.tables || [],
    staff: order?.staff || [],
    status: order?.status || OrderStatus.PENDING,
  });
  const [totalPrice, setTotalPrice] = useState(order?.totalPrice || 0);

  useEffect(() => {
    const calculatePrice = () => {
      const tablesPrice = formData.tables.reduce((acc, table) => {
        return acc + table.quantity * (tablePrices[table.type] || 0);
      }, 0);
      setTotalPrice(tablesPrice);
    };
    calculatePrice();
  }, [formData.tables, tablePrices]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTableChange = (type: TableType, quantity: number) => {
    setFormData(prev => {
      const existingTable = prev.tables.find(t => t.type === type);
      let newTables: GameTable[];
      if (existingTable) {
        if (quantity > 0) {
          newTables = prev.tables.map(t => t.type === type ? { ...t, quantity } : t);
        } else {
          newTables = prev.tables.filter(t => t.type !== type);
        }
      } else if (quantity > 0) {
        newTables = [...prev.tables, { type, quantity }];
      } else {
        newTables = prev.tables;
      }
      return { ...prev, tables: newTables };
    });
  };

  const handleStaffChange = (staffMember: StaffMember) => {
    setFormData(prev => {
      const isSelected = prev.staff.some(s => s.id === staffMember.id);
      const newStaff = isSelected
        ? prev.staff.filter(s => s.id !== staffMember.id)
        : [...prev.staff, staffMember];
      return { ...prev, staff: newStaff };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerId || !formData.eventDate || !formData.eventLocation) {
        alert("Prosím vyplňte zákazníka, datum a místo konání.");
        return;
    }
    const finalOrder: Order = {
      ...formData,
      id: order?.id || `ord_${Date.now()}`,
      totalPrice,
    };
    onSave(finalOrder);
  };
  
  const totalPriceFormatted = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', minimumFractionDigits: 0 }).format(totalPrice);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">{order ? 'Upravit objednávku' : 'Nová objednávka'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="customerId" className="block text-sm font-medium text-gray-300 mb-1">Zákazník</label>
                  <select id="customerId" name="customerId" value={formData.customerId} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500">
                    <option value="" disabled>Vyberte zákazníka</option>
                    {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="eventLocation" className="block text-sm font-medium text-gray-300 mb-1">Místo konání</label>
                  <input type="text" id="eventLocation" name="eventLocation" value={formData.eventLocation} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-300 mb-1">Datum</label>
                        <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" />
                    </div>
                    <div>
                        <label htmlFor="startTime" className="block text-sm font-medium text-gray-300 mb-1">Čas</label>
                        <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" />
                    </div>
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-1">Stav</label>
                  <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500">
                    {Object.values(OrderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                 <div>
                    <h4 className="text-md font-medium text-gray-300 mb-2">Herní stoly</h4>
                    <div className="space-y-2">
                        {Object.values(TableType).map(type => (
                            <div key={type} className="flex items-center justify-between">
                                <label htmlFor={`table_${type}`} className="text-white">{type}</label>
                                <input
                                    type="number"
                                    id={`table_${type}`}
                                    min="0"
                                    value={formData.tables.find(t => t.type === type)?.quantity || 0}
                                    onChange={e => handleTableChange(type, parseInt(e.target.value, 10))}
                                    className="w-20 bg-slate-700 border border-slate-600 rounded-md py-1 px-2 text-white text-center"
                                />
                            </div>
                        ))}
                    </div>
                 </div>
                 <div>
                    <h4 className="text-md font-medium text-gray-300 mb-2">Personál</h4>
                    <div className="space-y-1">
                        {staff.map(member => (
                            <div key={member.id} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id={`staff_${member.id}`}
                                    checked={formData.staff.some(s => s.id === member.id)}
                                    onChange={() => handleStaffChange(member)}
                                    className="h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-600 bg-slate-700"
                                />
                                <label htmlFor={`staff_${member.id}`} className="text-white">{member.name}</label>
                            </div>
                        ))}
                    </div>
                 </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 px-6 py-4 flex justify-between items-center sticky bottom-0">
            <div>
                <span className="text-gray-400 text-sm">Celková cena: </span>
                <span className="text-xl font-bold text-yellow-400">{totalPriceFormatted}</span>
            </div>
            <div className="flex gap-3">
                <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md">Zrušit</button>
                <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-4 rounded-md">Uložit objednávku</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;