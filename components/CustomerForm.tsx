import React, { useState } from 'react';
import { Customer } from '../types';

interface CustomerFormProps {
  onSave: (customer: Customer) => void;
  onClose: () => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onSave, onClose }) => {
  const [customer, setCustomer] = useState<Omit<Customer, 'id'>>({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customer.name && customer.contactPerson) {
        const newCustomer: Customer = {
            ...customer,
            id: `cust_${Date.now()}`
        };
      onSave(newCustomer);
    } else {
        alert("Prosím, vyplňte název firmy a kontaktní osobu.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6">Nový zákazník</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Název firmy</label>
                <input type="text" id="name" name="name" value={customer.name} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-300 mb-1">Kontaktní osoba</label>
                <input type="text" id="contactPerson" name="contactPerson" value={customer.contactPerson} onChange={handleChange} required className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">Telefon</label>
                <input type="tel" id="phone" name="phone" value={customer.phone} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input type="email" id="email" name="email" value={customer.email} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:ring-yellow-500 focus:border-yellow-500" />
              </div>
            </div>
          </div>
          <div className="bg-slate-900/50 px-6 py-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-4 rounded-md">Zrušit</button>
            <button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-2 px-4 rounded-md">Uložit zákazníka</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerForm;
