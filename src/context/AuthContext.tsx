import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load user from localStorage on mount
    const savedUser = localStorage.getItem('blossomUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('blossomUser');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // });
      // const data = await response.json();

      // Mock login - check against stored users or use demo accounts
      const storedUsers = JSON.parse(localStorage.getItem('blossomUsers') || '[]');
      const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
      
      // Demo accounts
      if (email === 'admin@blossom.com' && password === 'admin123') {
        const adminUser: User = {
          id: 'admin-1',
          email: 'admin@blossom.com',
          name: 'Admin User',
          role: 'admin',
        };
        setUser(adminUser);
        localStorage.setItem('blossomUser', JSON.stringify(adminUser));
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in as Admin.',
        });
        navigate('/admin');
        return true;
      } else if (foundUser) {
        const loggedInUser: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role || 'user',
          phone: foundUser.phone,
          address: foundUser.address,
          city: foundUser.city,
          country: foundUser.country,
          postalCode: foundUser.postalCode,
        };
        setUser(loggedInUser);
        localStorage.setItem('blossomUser', JSON.stringify(loggedInUser));
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${loggedInUser.name}`,
        });
        navigate(loggedInUser.role === 'admin' ? '/admin' : '/dashboard');
        return true;
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
      return false;
    }
  };

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email!,
        name: userData.name!,
        role: 'user',
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        country: userData.country,
        postalCode: userData.postalCode,
      };

      // Store user
      const storedUsers = JSON.parse(localStorage.getItem('blossomUsers') || '[]');
      storedUsers.push({ ...newUser, password: userData.password });
      localStorage.setItem('blossomUsers', JSON.stringify(storedUsers));

      setUser(newUser);
      localStorage.setItem('blossomUser', JSON.stringify(newUser));

      toast({
        title: 'Account Created!',
        description: 'Welcome to Blossom\'s Fitness Hub!',
      });

      navigate('/dashboard');
      return true;
    } catch (error) {
      toast({
        title: 'Signup Failed',
        description: 'An error occurred during signup',
        variant: 'destructive',
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('blossomUser');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      // TODO: Replace with actual API call
      // await fetch('/api/auth/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(userData),
      // });

      const updatedUser = { ...user, ...userData } as User;
      setUser(updatedUser);
      localStorage.setItem('blossomUser', JSON.stringify(updatedUser));

      // Update in users array
      const storedUsers = JSON.parse(localStorage.getItem('blossomUsers') || '[]');
      const userIndex = storedUsers.findIndex((u: any) => u.id === user?.id);
      if (userIndex !== -1) {
        storedUsers[userIndex] = { ...storedUsers[userIndex], ...userData };
        localStorage.setItem('blossomUsers', JSON.stringify(storedUsers));
      }

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Update Failed',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    }
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
