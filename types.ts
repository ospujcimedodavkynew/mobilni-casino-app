export enum TableType {
  ROULETTE = 'Americká Ruleta',
  BLACKJACK = 'Black Jack',
  POKER = 'Poker',
  DICE = 'Kostky',
  PARTYZRCADLO = 'Partyzrcadlo',
}

export enum OrderStatus {
    PENDING = 'Čekající',
    CONFIRMED = 'Potvrzeno',
    COMPLETED = 'Dokončeno',
    CANCELLED = 'Zrušeno',
}

export interface GameTable {
  type: TableType;
  quantity: number;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
}

export interface StaffMember {
  id:string;
  name: string;
}

export interface Order {
  id: string;
  customerId: string;
  eventLocation: string;
  eventDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  tables: GameTable[];
  staff: StaffMember[];
  totalPrice: number;
  status: OrderStatus;
}
