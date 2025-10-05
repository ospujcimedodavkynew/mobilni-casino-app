import { Order, Customer, StaffMember, OrderStatus, TableType } from './types';

export const INITIAL_CUSTOMERS: Customer[] = [
  { id: 'cust_1', name: 'Casino Royale s.r.o.', contactPerson: 'Jan Novák', phone: '+420 123 456 789', email: 'jan.novak@casinoroyale.cz' },
  { id: 'cust_2', name: 'Event Agency Prague', contactPerson: 'Eva Dvořáková', phone: '+420 987 654 321', email: 'eva@eventprague.com' },
];

export const INITIAL_STAFF: StaffMember[] = [
  { id: 'staff_1', name: 'Petr Král' },
  { id: 'staff_2', name: 'Lucie Černá' },
  { id: 'staff_3', name: 'Martin Bílý' },
];

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_1',
    customerId: 'cust_1',
    eventLocation: 'Hotel Hilton, Praha',
    eventDate: tomorrow.toISOString().split('T')[0],
    startTime: '19:00',
    tables: [
      { type: TableType.BLACKJACK, quantity: 2 },
      { type: TableType.POKER, quantity: 1 },
    ],
    staff: [INITIAL_STAFF[0], INITIAL_STAFF[1]],
    totalPrice: 25000,
    status: OrderStatus.CONFIRMED,
  },
  {
    id: 'ord_2',
    customerId: 'cust_2',
    eventLocation: 'O2 Arena, Praha',
    eventDate: nextWeek.toISOString().split('T')[0],
    startTime: '20:00',
    tables: [
      { type: TableType.ROULETTE, quantity: 1 },
      { type: TableType.DICE, quantity: 1 },
    ],
    staff: [INITIAL_STAFF[2]],
    totalPrice: 18000,
    status: OrderStatus.PENDING,
  },
];

export const DEFAULT_TABLE_PRICES: Record<TableType, number> = {
  [TableType.ROULETTE]: 8000,
  [TableType.BLACKJACK]: 6000,
  [TableType.POKER]: 7000,
  [TableType.DICE]: 5000,
  [TableType.PARTYZRCADLO]: 4000,
};

export const DEFAULT_TABLE_INVENTORY: Record<TableType, number> = {
  [TableType.ROULETTE]: 2,
  [TableType.BLACKJACK]: 4,
  [TableType.POKER]: 3,
  [TableType.DICE]: 2,
  [TableType.PARTYZRCADLO]: 1,
};