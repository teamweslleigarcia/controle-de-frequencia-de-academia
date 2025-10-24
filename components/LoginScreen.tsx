import React, { useContext } from 'react';
import { AppContext, AppContextType } from '../context/AppContext';
import { UserRole } from '../types';
import { GoogleIcon } from './icons';

const LoginScreen: React.FC = () => {
  const { login } = useContext(AppContext) as AppContextType;

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-surface rounded-2xl shadow-lg">
        <div>
          <h2 className="text-center text-4xl font-extrabold text-on-surface">
            Bem-vindo!
          </h2>
          <p className="mt-2 text-center text-md text-gray-600">
            Selecione seu perfil para continuar
          </p>
        </div>
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => login(UserRole.ADMIN)}
            className="w-full py-3 px-4 bg-primary hover:bg-indigo-700 text-on-primary font-semibold rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-transform transform hover:scale-105"
          >
            Entrar como Administrador
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-500">ou</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          <button
            onClick={() => login(UserRole.INSTRUCTOR)}
            className="w-full flex items-center justify-center py-3 px-4 bg-white hover:bg-gray-100 text-gray-800 font-semibold rounded-lg shadow-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background transition-transform transform hover:scale-105"
          >
            <GoogleIcon className="h-5 w-5 mr-3" />
            Login com Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;