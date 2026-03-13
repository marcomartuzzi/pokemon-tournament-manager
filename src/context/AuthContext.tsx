import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { initialUsers } from '../data/initialData';

interface User {
  username: string;
  isAdmin?: boolean;
  displayName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, isAdmin: boolean, displayName: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Seed della collection users su Firestore al primo avvio
  useEffect(() => {
    const seedUsers = async () => {
      const snapshot = await getDocs(collection(db, 'users'));
      if (snapshot.empty) {
        const batch = writeBatch(db);
        initialUsers.forEach(u => {
          batch.set(doc(db, 'users', u.username), u);
        });
        await batch.commit();
      }
    };
    seedUsers().catch(console.error);
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const login = (username: string, isAdmin: boolean, displayName: string) => {
    setUser({ username, isAdmin, displayName });
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