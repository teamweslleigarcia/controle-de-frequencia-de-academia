
import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import type { ClassSchedule, BeltColor } from '../types';
import { ChevronLeftIcon, SearchIcon } from './icons';

const beltColorBgClasses: { [key in BeltColor]: string } = {
  'Branca': 'bg-white',
  'Cinza': 'bg-gray-400',
  'Amarela': 'bg-yellow-400',
  'Laranja': 'bg-orange-500',
  'Verde': 'bg-green-500',
  'Azul': 'bg-blue-600',
  'Roxa': 'bg-purple-600',
  'Marrom': 'bg-amber-800',
  'Preta': 'bg-black',
};

const InstructorDashboard: React.FC = () => {
  const context = useContext(AppContext) as AppContextType;
  const { classes, students, getAttendance, saveAttendance } = context;

  const [selectedClass, setSelectedClass] = useState<ClassSchedule | null>(null);
  const [presentStudentIds, setPresentStudentIds] = useState<Set<string>>(new Set());
  const [classSearch, setClassSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');
  
  const today = new Date();
  const todayDateString = today.toISOString().split('T')[0];
  const todayDayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' }) as ClassSchedule['dayOfWeek'];

  const todaysClasses = useMemo(() => {
    return classes.filter(c => c.dayOfWeek === todayDayOfWeek);
  }, [classes, todayDayOfWeek]);
  
  const filteredClasses = useMemo(() => {
    if (!classSearch) return todaysClasses;
    return todaysClasses.filter(c =>
      c.name.toLowerCase().includes(classSearch.toLowerCase())
    );
  }, [todaysClasses, classSearch]);

  const filteredStudents = useMemo(() => {
    if (!studentSearch) return students;
    return students.filter(s =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase())
    );
  }, [students, studentSearch]);

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return '';
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const handleSelectClass = (classSchedule: ClassSchedule) => {
    const initialAttendance = getAttendance(todayDateString, classSchedule.id);
    setPresentStudentIds(new Set(initialAttendance));
    setStudentSearch(''); // Reset student search on class selection
    setSelectedClass(classSchedule);
  };
  
  const handleToggleAttendance = (studentId: string) => {
      setPresentStudentIds(prev => {
          const newSet = new Set(prev);
          if (newSet.has(studentId)) {
              newSet.delete(studentId);
          } else {
              newSet.add(studentId);
          }
          return newSet;
      });
  };

  const handleSaveAttendance = () => {
      if (selectedClass) {
          saveAttendance(todayDateString, selectedClass.id, presentStudentIds);
          alert('Frequência salva com sucesso!');
          setSelectedClass(null);
      }
  };

  const handleBack = () => {
    setSelectedClass(null);
    setPresentStudentIds(new Set());
    setStudentSearch('');
  };
  
  if (selectedClass) {
    return (
      <div className="bg-surface rounded-xl shadow-sm p-6 animate-fade-in">
        <div className="flex items-center mb-6">
           <button onClick={handleBack} className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors">
             <ChevronLeftIcon className="h-6 w-6"/>
           </button>
           <div>
            <h2 className="text-2xl font-bold text-on-surface">{selectedClass.name}</h2>
            <p className="text-gray-500">Registrando frequência para: {today.toLocaleDateString('pt-BR')}</p>
          </div>
        </div>

        <div className="mb-6 relative w-full max-w-md">
            <input
                type="text"
                placeholder="Buscar aluno..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-on-surface placeholder-gray-400 focus:ring-primary focus:border-primary transition-colors"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {filteredStudents.map(student => (
                <div key={student.id} 
                     className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${presentStudentIds.has(student.id) ? 'bg-primary text-on-primary ring-2 ring-indigo-300 shadow-lg' : 'bg-surface border border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                     onClick={() => handleToggleAttendance(student.id)}>
                    <label className="flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-3">
                          <input 
                              type="checkbox" 
                              checked={presentStudentIds.has(student.id)} 
                              readOnly
                              className={`form-checkbox h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-surface ${presentStudentIds.has(student.id) ? 'bg-indigo-200' : 'bg-gray-100'}`}
                          />
                          <span className="font-medium">{student.name} <span className={`text-sm font-normal ${presentStudentIds.has(student.id) ? 'text-indigo-100' : 'text-gray-500'}`}>({calculateAge(student.birthDate)} anos)</span></span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${presentStudentIds.has(student.id) ? 'text-indigo-100' : 'text-gray-500'}`}>{student.beltColor}</span>
                          <div className={`h-3 w-3 rounded-full ${beltColorBgClasses[student.beltColor]} border-2 ${presentStudentIds.has(student.id) ? 'border-indigo-100' : 'border-gray-400'}`}></div>
                        </div>
                    </label>
                </div>
            ))}
        </div>
        
        {filteredStudents.length === 0 && (
          <p className="text-center text-gray-500 py-8">Nenhum aluno encontrado.</p>
        )}

        <div className="flex justify-end mt-4">
            <button onClick={handleSaveAttendance} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105">
                Salvar Frequência
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-xl shadow-sm p-6">
      <h2 className="text-3xl font-bold text-on-surface mb-6">Turmas de Hoje</h2>

      <div className="mb-6 relative w-full max-w-md">
        <input
            type="text"
            placeholder="Buscar turma..."
            value={classSearch}
            onChange={(e) => setClassSearch(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-on-surface placeholder-gray-400 focus:ring-primary focus:border-primary transition-colors"
        />
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      </div>

      {filteredClasses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map(cls => (
            <div key={cls.id} className="bg-surface border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md hover:border-primary hover:-translate-y-1 transition-all duration-300 cursor-pointer" onClick={() => handleSelectClass(cls)}>
              <h3 className="text-xl font-bold text-primary mb-2">{cls.name}</h3>
              <p className="text-on-surface text-lg">{cls.time}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-10">
          {todaysClasses.length > 0 ? 'Nenhuma turma encontrada com este nome.' : 'Nenhuma turma agendada para hoje.'}
        </p>
      )}
    </div>
  );
};

export default InstructorDashboard;
