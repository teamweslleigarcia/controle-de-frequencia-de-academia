import { useState } from 'react';
import type { User, Student, ClassSchedule, Attendance, UserRole } from '../types';
import { AppContextType } from '../context/AppContext';
import { UserRole as UserRoleEnum } from '../types';

const MOCK_INSTRUCTORS: User[] = [
  { id: 'instr-1', name: 'Mestre Hélio', email: 'helio@jiujitsu.com', role: UserRoleEnum.INSTRUCTOR, birthDate: '1970-01-01', beltColor: 'Preta', phone: '(11) 98888-1111', address: 'Rua do Tatame, 100', neighborhood: 'Centro', joinDate: '2010-01-01' },
  { id: 'instr-2', name: 'Sensei Kano', email: 'kano@judo.com', role: UserRoleEnum.INSTRUCTOR, birthDate: '1968-05-12', beltColor: 'Preta', phone: '(21) 97777-2222', address: 'Avenida Ippon, 200', neighborhood: 'Copacabana', joinDate: '2008-03-15' },
];

const MOCK_ADMIN: User = {
  id: 'admin-1',
  name: 'Admin',
  email: 'admin@martialarts.com',
  role: UserRoleEnum.ADMIN,
};

const MOCK_STUDENTS: Student[] = [
  { id: 'stu-1', name: 'Carlos Gracie', birthDate: '1995-08-10', joinDate: '2023-01-15', beltColor: 'Preta', phone: '(11) 91111-1111', address: 'Rua A, 1', neighborhood: 'Bairro X' },
  { id: 'stu-2', name: 'Jigoro Kano', birthDate: '2005-03-22', joinDate: '2023-02-20', beltColor: 'Preta', phone: '(11) 92222-2222', address: 'Rua B, 2', neighborhood: 'Bairro Y' },
  { id: 'stu-3', name: 'Gichin Funakoshi', birthDate: '1988-11-01', joinDate: '2023-03-10', beltColor: 'Marrom', phone: '(11) 93333-3333', address: 'Rua C, 3', neighborhood: 'Bairro Z' },
  { id: 'stu-4', name: 'Masutatsu Oyama', birthDate: '2000-07-15', joinDate: '2023-04-05', beltColor: 'Roxa', phone: '(11) 94444-4444', address: 'Rua D, 4', neighborhood: 'Bairro A' },
  { id: 'stu-5', name: 'Morihei Ueshiba', birthDate: '2010-01-30', joinDate: '2023-05-12', beltColor: 'Azul', phone: '(11) 95555-5555', address: 'Rua E, 5', neighborhood: 'Bairro B' },
];

const MOCK_CLASSES: ClassSchedule[] = [
  { id: 'cls-1', name: 'Jiu-Jitsu (Adultos)', dayOfWeek: 'Monday', time: '19:00' },
  { id: 'cls-2', name: 'Judô (Kids)', dayOfWeek: 'Tuesday', time: '18:00' },
  { id: 'cls-3', name: 'Jiu-Jitsu (Avançado)', dayOfWeek: 'Wednesday', time: '20:00' },
  { id: 'cls-4', name: 'Judô (Adultos)', dayOfWeek: 'Thursday', time: '19:30' },
  { id: 'cls-5', name: 'Jiu-Jitsu (Iniciantes)', dayOfWeek: 'Friday', time: '19:00' },
];

export const useAppData = (): AppContextType => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([MOCK_ADMIN, ...MOCK_INSTRUCTORS]);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [classes, setClasses] = useState<ClassSchedule[]>(MOCK_CLASSES);
  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const login = (role: UserRole) => {
    if (role === UserRoleEnum.ADMIN) {
      setCurrentUser(MOCK_ADMIN);
    } else {
      // Simulate Social Login for instructors
      const socialUserEmail = 'social.login@example.com';
      let instructor = users.find(u => u.email === socialUserEmail && u.role === UserRoleEnum.INSTRUCTOR);

      if (!instructor) {
        // If instructor doesn't exist, create one
        const newInstructor: User = {
          id: `instr-${Date.now()}`,
          name: 'Instrutor Social',
          email: socialUserEmail,
          role: UserRoleEnum.INSTRUCTOR,
          birthDate: '1990-01-01', // Default data
          beltColor: 'Preta',
          phone: '(00) 00000-0000',
          address: 'Via Login Social',
          neighborhood: 'Internet',
          joinDate: new Date().toISOString().split('T')[0],
        };
        setUsers(prev => [...prev, newInstructor]);
        instructor = newInstructor;
      }
      setCurrentUser(instructor);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };
  
  const getInstructorName = (instructorId: string) => {
    return users.find(u => u.id === instructorId)?.name ?? 'Desconhecido';
  };

  // Student Actions
  const addStudent = (student: Omit<Student, 'id'>) => {
    const newStudent = { ...student, id: `stu-${Date.now()}` };
    setStudents(prev => [...prev, newStudent]);
  };
  const updateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };
  const deleteStudent = (studentId: string) => {
    setStudents(prev => prev.filter(s => s.id !== studentId));
  };

  // Instructor Actions
  const addInstructor = (instructor: Omit<User, 'id' | 'role'>) => {
    const newInstructor = { ...instructor, id: `instr-${Date.now()}`, role: UserRoleEnum.INSTRUCTOR };
    setUsers(prev => [...prev, newInstructor]);
  };
  const updateInstructor = (updatedInstructor: User) => {
    setUsers(prev => prev.map(u => u.id === updatedInstructor.id ? updatedInstructor : u));
  };
  const deleteInstructor = (instructorId: string) => {
    setUsers(prev => prev.filter(u => u.id !== instructorId));
  };

  // Class Actions
  const addClass = (classSchedule: Omit<ClassSchedule, 'id'>) => {
    const newClass = { ...classSchedule, id: `cls-${Date.now()}` };
    setClasses(prev => [...prev, newClass]);
  };
  const updateClass = (updatedClass: ClassSchedule) => {
    setClasses(prev => prev.map(c => c.id === updatedClass.id ? updatedClass : c));
  };
  const deleteClass = (classId: string) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
  };
  
  // Attendance Actions
  const getAttendance = (date: string, classId: string) => {
      const record = attendance.find(a => a.date === date && a.classId === classId);
      return record ? record.presentStudentIds : new Set<string>();
  };
  
  const saveAttendance = (date: string, classId: string, presentStudentIds: Set<string>) => {
      setAttendance(prev => {
          const existingRecordIndex = prev.findIndex(a => a.date === date && a.classId === classId);
          if(existingRecordIndex > -1) {
              const newAttendance = [...prev];
              newAttendance[existingRecordIndex] = { date, classId, presentStudentIds };
              return newAttendance;
          }
          return [...prev, { date, classId, presentStudentIds }];
      });
  };

  return {
    currentUser,
    login,
    logout,
    users,
    students,
    classes,
    attendance,
    addStudent,
    updateStudent,
    deleteStudent,
    addInstructor,
    updateInstructor,
    deleteInstructor,
    addClass,
    updateClass,
    deleteClass,
    getInstructorName,
    getAttendance,
    saveAttendance,
  };
};