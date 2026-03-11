import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authorizedUsers } from '../data/initialData';

interface User {
  username: string;
  isAdmin?: boolean;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    // Carica l'utente dal localStorage all'avvio
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    // Salva l'utente nel localStorage quando cambia
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (username: string) => {
    // Trova l'utente nella lista autorizzata per ottenere i dettagli completi
    const foundUser = authorizedUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    
    const newUser: User = {
      username,
      isAdmin: foundUser?.isAdmin || false,
      displayName: foundUser?.displayName || username
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};