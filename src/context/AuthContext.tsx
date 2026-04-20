import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, password?: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('desksetup_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('desksetup_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('desksetup_user');
    }
  }, [user]);

  const login = (email: string, password?: string) => {
    // Hardcoded admin
    if (email === 'admin@store.com' && password === 'admin123') {
      setUser({ id: 'admin-id', name: 'Admin', email, role: 'admin' });
      return true;
    }

    // Check registered users
    const usersStr = localStorage.getItem('desksetup_registered_users');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      if (foundUser) {
        setUser({ id: foundUser.id, name: foundUser.name, email: foundUser.email, role: 'user' });
        return true;
      }
    }
    
    return false;
  };

  const register = (name: string, email: string, password?: string) => {
    if (email === 'admin@store.com') return false; // Reserved

    const usersStr = localStorage.getItem('desksetup_registered_users');
    const users = usersStr ? JSON.parse(usersStr) : [];
    
    if (users.find((u: any) => u.email === email)) {
      return false; // Email already exists
    }

    const newUser = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      role: 'user'
    };

    users.push(newUser);
    localStorage.setItem('desksetup_registered_users', JSON.stringify(users));
    
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email, role: 'user' });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
