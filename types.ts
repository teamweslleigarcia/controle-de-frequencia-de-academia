
export enum UserRole {
  ADMIN = 'ADMIN',
  INSTRUCTOR = 'INSTRUCTOR',
}

export type BeltColor = 'Branca' | 'Cinza' | 'Amarela' | 'Laranja' | 'Verde' | 'Azul' | 'Roxa' | 'Marrom' | 'Preta';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  birthDate?: string;
  joinDate?: string;
  beltColor?: BeltColor;
  phone?: string;
  address?: string;
  neighborhood?: string;
}

export interface Student {
  id:string;
  name: string;
  birthDate: string;
  joinDate: string;
  beltColor: BeltColor;
  phone: string;
  address: string;
  neighborhood: string;
}

export interface ClassSchedule {
  id: string;
  name: string;
  dayOfWeek: 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
}

export interface Attendance {
  date: string; // YYYY-MM-DD
  classId: string;
  presentStudentIds: Set<string>;
}