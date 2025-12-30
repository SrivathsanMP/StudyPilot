import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock teacher data
const MOCK_TEACHERS: Record<string, { password: string; user: User }> = {
  'teacher@studypilot.com': {
    password: 'password123',
    user: {
      id: '1',
      name: 'Priya Sharma',
      email: 'teacher@studypilot.com',
    },
  },
  'demo@studypilot.com': {
    password: 'demo',
    user: {
      id: '2',
      name: 'Demo Teacher',
      email: 'demo@studypilot.com',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('studypilot_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const teacherData = MOCK_TEACHERS[email.toLowerCase()];

    if (!teacherData) {
      setIsLoading(false);
      setError('No account found with this email. Try teacher@studypilot.com');
      throw new Error('User not found');
    }

    if (teacherData.password !== password) {
      setIsLoading(false);
      setError('Incorrect password. Try "password123" or "demo"');
      throw new Error('Invalid password');
    }

    localStorage.setItem('studypilot_user', JSON.stringify(teacherData.user));
    setUser(teacherData.user);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('studypilot_user');
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
