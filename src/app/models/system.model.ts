export interface ICars {
  name: string;
  year: string;
  type: string;
  engine: string;
  size: string;
  isReserved: boolean;
  id: string;
}

export interface IUsers {
  id: string;
  user: string;
  password: string;
  bookIt: boolean;
  historyReservations: ICars[];
  carReserved: ICars | null;
  photo: string | null;
}

export type TNavigations = 'home' | 'order' | 'suport' | 'profile';
