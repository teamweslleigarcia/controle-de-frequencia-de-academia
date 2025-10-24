
import { createContext } from 'react';
import type { User, Student, ClassSchedule, Attendance, UserRole } from '../types';

export interface AppContextType {
  currentUser: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  users: User[];
  students: Student[];
  classes: ClassSchedule[];
  attendance: Attendance[];
  addStudent: (student: Omit<Student, 'id'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (studentId: string) => void;
  addInstructor: (instructor: Omit<User, 'id' | 'role'>) => void;
  updateInstructor: (instructor: User) => void;
  deleteInstructor: (instructorId: string) => void;
  addClass: (classSchedule: Omit<ClassSchedule, 'id'>) => void;
  updateClass: (classSchedule: ClassSchedule) => void;
  deleteClass: (classId: string) => void;
  getInstructorName: (instructorId: string) => string;
  getAttendance: (date: string, classId: string) => Set<string>;
  saveAttendance: (date: string, classId: string, presentStudentIds: Set<string>) => void;
}

export const AppContext = createContext<AppContextType | null>(null);
