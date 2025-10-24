import React, { useContext } from 'react';
import { AppContext, AppContextType } from './context/AppContext';
import { useAppData } from './hooks/useAppData';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import InstructorDashboard from './components/InstructorDashboard';
import { LogOutIcon } from './components/icons';

const AppWrapper: React.FC = () => {
  const appData = useAppData();

  return (
    <AppContext.Provider value={appData}>
      <App />
    </AppContext.Provider>
  );
};

const App: React.FC = () => {
  const context = useContext(AppContext);
  const { currentUser, logout } = context as AppContextType;

  const renderContent = () => {
    if (!currentUser) {
      return <LoginScreen />;
    }

    switch (currentUser.role) {
      case 'ADMIN':
        return <AdminDashboard />;
      case 'INSTRUCTOR':
        return <InstructorDashboard />;
      default:
        return <LoginScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {currentUser && (
        <header className="bg-surface shadow-md p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-primary">
            Controle de Frequência
          </h1>
          <div className="flex items-center space-x-4">
            <span className="text-on-surface">Olá, {currentUser.name}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
            >
              <LogOutIcon className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </header>
      )}
      <main className="flex-grow p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AppWrapper;