
import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import type { Student, User, ClassSchedule, BeltColor } from '../types';
import { UserRole } from '../types';
import Modal from './common/Modal';
import { UsersIcon, UserCheckIcon, CalendarIcon, PlusCircleIcon, EditIcon, Trash2Icon, SearchIcon, ClipboardListIcon } from './icons';

type ActiveTab = 'students' | 'instructors' | 'classes';
type EditingItem = Student | User | ClassSchedule | null;
type EditingType = 'student' | 'instructor' | 'class' | null;

const BELT_COLORS: BeltColor[] = ['Branca', 'Cinza', 'Amarela', 'Laranja', 'Verde', 'Azul', 'Roxa', 'Marrom', 'Preta'];

const beltColorClasses: { [key in BeltColor]: string } = {
  'Branca': 'bg-white text-black border',
  'Cinza': 'bg-gray-400 text-black',
  'Amarela': 'bg-yellow-400 text-black',
  'Laranja': 'bg-orange-500 text-white',
  'Verde': 'bg-green-500 text-white',
  'Azul': 'bg-blue-600 text-white',
  'Roxa': 'bg-purple-600 text-white',
  'Marrom': 'bg-amber-800 text-white',
  'Preta': 'bg-black text-white border border-gray-400',
};


const AdminDashboard: React.FC = () => {
  const context = useContext(AppContext) as AppContextType;
  const {
    students, addStudent, updateStudent, deleteStudent,
    users, addInstructor, updateInstructor, deleteInstructor,
    classes, addClass, updateClass, deleteClass
  } = context;

  const [activeTab, setActiveTab] = useState<ActiveTab>('students');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem>(null);
  const [editingType, setEditingType] = useState<EditingType>(null);
  const [formData, setFormData] = useState<any>({});
  const [searchQueries, setSearchQueries] = useState<{ [key in ActiveTab]: string }>({
    students: '',
    instructors: '',
    classes: '',
  });

  const instructors = users.filter(u => u.role === UserRole.INSTRUCTOR);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const daysOfWeekPt = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

  const calculateAge = (birthDateString: string) => {
    if (!birthDateString) return 'N/A';
    const birthDate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const todayDayOfWeek = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as ClassSchedule['dayOfWeek'];
  const classesTodayCount = classes.filter(c => c.dayOfWeek === todayDayOfWeek).length;
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQueries(prev => ({ ...prev, [activeTab]: value }));
  };
  
  const filteredStudents = useMemo(() => {
    const query = searchQueries.students.toLowerCase();
    if (!query) return students;
    return students.filter(s => s.name.toLowerCase().includes(query));
  }, [students, searchQueries.students]);

  const filteredInstructors = useMemo(() => {
    const query = searchQueries.instructors.toLowerCase();
    if (!query) return instructors;
    return instructors.filter(i => 
      i.name.toLowerCase().includes(query) || 
      i.email.toLowerCase().includes(query)
    );
  }, [instructors, searchQueries.instructors]);
  
  const filteredClasses = useMemo(() => {
    const query = searchQueries.classes.toLowerCase();
    if (!query) return classes;
    return classes.filter(c =>
      c.name.toLowerCase().includes(query)
    );
  }, [classes, searchQueries.classes]);


  const openModal = (type: EditingType, item: EditingItem = null) => {
    setEditingType(type);
    setEditingItem(item);

    if (item) {
      setFormData(item);
    } else {
      let defaultData = {};
      switch(type) {
        case 'student':
          defaultData = { name: '', birthDate: '', joinDate: '', beltColor: 'Branca', phone: '', address: '', neighborhood: '' };
          break;
        case 'instructor':
          defaultData = { name: '', email: '', birthDate: '', joinDate: '', beltColor: 'Branca', phone: '', address: '', neighborhood: '' };
          break;
        case 'class':
          defaultData = { name: '', dayOfWeek: '', time: '' };
          break;
      }
      setFormData(defaultData);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setEditingType(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType) return;

    if (editingItem) { // Update
      if (editingType === 'student') updateStudent(formData as Student);
      if (editingType === 'instructor') updateInstructor(formData as User);
      if (editingType === 'class') updateClass(formData as ClassSchedule);
    } else { // Create
      if (editingType === 'student') addStudent(formData);
      if (editingType === 'instructor') addInstructor(formData);
      if (editingType === 'class') addClass(formData);
    }
    closeModal();
  };
  
  const formInputClass = "w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 text-on-surface focus:ring-primary focus:border-primary";

  const renderForm = () => {
    switch (editingType) {
      case 'student':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Nome</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
             <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Data de Nascimento</label>
                <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Faixa</label>
              <select name="beltColor" value={formData.beltColor || 'Branca'} onChange={handleInputChange} className={formInputClass} required>
                {BELT_COLORS.map(color => <option key={color} value={color}>{color}</option>)}
              </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Telefone</label>
                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Endereço</label>
                <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Bairro</label>
                <input type="text" name="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Data de Inscrição</label>
              <input type="date" name="joinDate" value={formData.joinDate || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
          </>
        );
      case 'instructor':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Nome</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Data de Nascimento</label>
                <input type="date" name="birthDate" value={formData.birthDate || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Faixa</label>
              <select name="beltColor" value={formData.beltColor || 'Branca'} onChange={handleInputChange} className={formInputClass} required>
                {BELT_COLORS.map(color => <option key={color} value={color}>{color}</option>)}
              </select>
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Telefone</label>
                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Endereço</label>
                <input type="text" name="address" value={formData.address || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium mb-1 text-gray-700">Bairro</label>
                <input type="text" name="neighborhood" value={formData.neighborhood || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Data de Inscrição</label>
              <input type="date" name="joinDate" value={formData.joinDate || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
          </>
        );
      case 'class':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Nome da Turma</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Dia da Semana</label>
              <select name="dayOfWeek" value={formData.dayOfWeek || ''} onChange={handleInputChange} className={formInputClass} required>
                <option value="">Selecione um dia</option>
                {daysOfWeek.map((day, i) => <option key={day} value={day}>{daysOfWeekPt[i]}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">Horário</label>
              <input type="time" name="time" value={formData.time || ''} onChange={handleInputChange} className={formInputClass} required />
            </div>
          </>
        );
      default: return null;
    }
  };

  const TabButton: React.FC<{ tabName: ActiveTab; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center space-x-2 py-3 px-4 font-semibold transition-colors duration-200 border-b-2 ${activeTab === tabName ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-primary hover:border-primary/30'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: number | string, color: string }> = ({ icon, label, value, color }) => (
    <div className="bg-surface p-6 rounded-lg flex items-center space-x-4 border border-gray-200">
      <div className={`${color} p-3 rounded-full`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<UsersIcon className="h-6 w-6 text-on-primary" />} label="Total de Alunos" value={students.length} color="bg-blue-500" />
        <StatCard icon={<UserCheckIcon className="h-6 w-6 text-on-primary" />} label="Total de Instrutores" value={instructors.length} color="bg-green-500" />
        <StatCard icon={<CalendarIcon className="h-6 w-6 text-on-primary" />} label="Total de Turmas" value={classes.length} color="bg-purple-500" />
        <StatCard icon={<ClipboardListIcon className="h-6 w-6 text-on-primary" />} label="Turmas Hoje" value={classesTodayCount} color="bg-yellow-500" />
      </div>

      <div className="bg-surface rounded-xl shadow-sm p-6 md:p-8">
        <div className="flex border-b border-gray-200 mb-6">
          <TabButton tabName="students" label="Alunos" icon={<UsersIcon className="h-5 w-5" />} />
          <TabButton tabName="instructors" label="Instrutores" icon={<UserCheckIcon className="h-5 w-5" />} />
          <TabButton tabName="classes" label="Turmas" icon={<CalendarIcon className="h-5 w-5" />} />
        </div>

        <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'students' ? 'aluno' : activeTab === 'instructors' ? 'instrutor' : 'turma'}...`}
              value={searchQueries[activeTab]}
              onChange={handleSearchChange}
              className="w-full bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 text-on-surface placeholder-gray-400 focus:ring-primary focus:border-primary transition-colors"
            />
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => {
              const type = activeTab === 'classes' ? 'class' : activeTab.slice(0, -1);
              openModal(type as EditingType);
            }}
            className="flex items-center space-x-2 bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 w-full md:w-auto"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Adicionar Novo</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200">
              <tr className="text-xs text-gray-500 uppercase tracking-wider">
                {activeTab === 'students' && <>
                  <th className="p-4">Nome</th><th className="p-4">Idade</th><th className="p-4">Faixa</th><th className="p-4">Telefone</th><th className="p-4">Data de Inscrição</th>
                </>}
                {activeTab === 'instructors' && <>
                  <th className="p-4">Nome</th><th className="p-4">Idade</th><th className="p-4">Faixa</th><th className="p-4">Telefone</th><th className="p-4">Data de Inscrição</th>
                </>}
                {activeTab === 'classes' && <>
                  <th className="p-4">Nome da Turma</th><th className="p-4">Dia</th><th className="p-4">Horário</th>
                </>}
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeTab === 'students' && filteredStudents.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4">{calculateAge(s.birthDate)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${beltColorClasses[s.beltColor]}`}>
                      {s.beltColor}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{s.phone}</td>
                  <td className="p-4 text-gray-600">{new Date(s.joinDate).toLocaleDateString()}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openModal('student', s)} className="text-blue-600 hover:text-blue-800 p-1"><EditIcon /></button>
                    <button onClick={() => deleteStudent(s.id)} className="text-red-600 hover:text-red-800 p-1"><Trash2Icon /></button>
                  </td>
                </tr>
              ))}
              {activeTab === 'instructors' && filteredInstructors.map(i => (
                <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{i.name}</td>
                  <td className="p-4">{calculateAge(i.birthDate || '')}</td>
                  <td className="p-4">
                    {i.beltColor &&
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${beltColorClasses[i.beltColor]}`}>
                        {i.beltColor}
                      </span>
                    }
                  </td>
                  <td className="p-4 text-gray-600">{i.phone}</td>
                  <td className="p-4 text-gray-600">{i.joinDate ? new Date(i.joinDate).toLocaleDateString() : ''}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openModal('instructor', i)} className="text-blue-600 hover:text-blue-800 p-1"><EditIcon /></button>
                    <button onClick={() => deleteInstructor(i.id)} className="text-red-600 hover:text-red-800 p-1"><Trash2Icon /></button>
                  </td>
                </tr>
              ))}
              {activeTab === 'classes' && filteredClasses.map(c => (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4 text-gray-600">{daysOfWeekPt[daysOfWeek.indexOf(c.dayOfWeek)]}</td>
                  <td className="p-4 text-gray-600">{c.time}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => openModal('class', c)} className="text-blue-600 hover:text-blue-800 p-1"><EditIcon /></button>
                    <button onClick={() => deleteClass(c.id)} className="text-red-600 hover:text-red-800 p-1"><Trash2Icon /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          { (activeTab === 'students' && filteredStudents.length === 0) ||
            (activeTab === 'instructors' && filteredInstructors.length === 0) ||
            (activeTab === 'classes' && filteredClasses.length === 0) ? (
            <p className="text-center text-gray-500 py-8">Nenhum resultado encontrado.</p>
          ) : null}
        </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={`${editingItem ? 'Editar' : 'Adicionar Novo'} ${editingType === 'student' ? 'Aluno' : editingType === 'instructor' ? 'Instrutor' : 'Turma'}`}>
          <form onSubmit={handleSubmit}>
            {renderForm()}
            <div className="flex justify-end mt-6 space-x-3">
              <button type="button" onClick={closeModal} className="bg-white hover:bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded-lg border border-gray-300">Cancelar</button>
              <button type="submit" className="bg-primary hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg">Salvar</button>
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default AdminDashboard;