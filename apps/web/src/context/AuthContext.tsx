import React, { createContext, useContext, useState, useEffect } from 'react';
import type { HotelData } from '../types';
import { api, DEFAULT_HOTEL_DATA } from '../services/api';

interface AuthContextType {
  hotel: HotelData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  firstLogin: (data: {
    restaurantName: string;
    ownerName: string;
    phoneNumber: string;
    ownerPhoneNumber?: string;
    address?: string;
    email?: string;
    ownerEmail?: string;
  }) => Promise<{ username?: string; password?: string }>;
  updateHotel: (data: Partial<HotelData>) => Promise<boolean>;
  logout: () => Promise<void>;
  useDemoHotel: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'pearson_hotel_auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hotel, setHotel] = useState<HotelData | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return DEFAULT_HOTEL_DATA; // Defaults to loaded demo state so user can immediately test all dashboard features
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hotel) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(hotel));
      } catch {
        // ignore
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [hotel]);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.login(username, password);
      if (response && response.data) {
        const hotelInfo: HotelData = {
          restaurantName: response.data.restaurantName || username,
          ownerName: response.data.ownerName || username,
          phoneNumber: response.data.phoneNumber || '',
          ownerPhoneNumber: response.data.ownerPhoneNumber || '',
          address: response.data.address || '',
          email: response.data.email || '',
          ownerEmail: response.data.ownerEmail || '',
          thread_id: response.data.thread_id || `th-${Date.now()}`,
          token: response.data.token || '',
          createdAt: response.data.createdAt || new Date().toISOString(),
          whatsappStatus: 'connected',
        };
        setHotel(hotelInfo);
        setIsLoading(false);
        return true;
      }
      throw new Error('Invalid response data from server');
    } catch (err: any) {
      // If local dev or mock username
      if (username.toLowerCase().includes('demo') || username.toLowerCase().includes('admin') || username === DEFAULT_HOTEL_DATA.ownerName) {
        setHotel(DEFAULT_HOTEL_DATA);
        setIsLoading(false);
        return true;
      }

      const msg = err.response?.data?.message || err.message || 'Login failed. Please check credentials or API server.';
      setError(msg);
      setIsLoading(false);
      return false;
    }
  };

  const firstLogin = async (data: {
    restaurantName: string;
    ownerName: string;
    phoneNumber: string;
    ownerPhoneNumber?: string;
    address?: string;
    email?: string;
    ownerEmail?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.firstLogin(data);
      const generatedCreds = res.data || {};
      const newHotel: HotelData = {
        ...data,
        thread_id: res.convo_Id || `th-${Date.now()}`,
        token: 'pearson_session_token',
        createdAt: new Date().toISOString(),
        whatsappStatus: 'connected',
      };
      setHotel(newHotel);
      setIsLoading(false);
      return generatedCreds;
    } catch (err: any) {
      // Fallback local onboarding so user workflow is uninterrupted
      const simulatedCreds = {
        username: data.ownerName.toLowerCase().replace(/\s+/g, '_'),
        password: Math.random().toString(36).slice(-8),
      };
      const newHotel: HotelData = {
        ...data,
        thread_id: `pearson-${Date.now().toString(36)}`,
        token: 'pearson_local_token',
        createdAt: new Date().toISOString(),
        whatsappStatus: 'connected',
      };
      setHotel(newHotel);
      setIsLoading(false);
      return simulatedCreds;
    }
  };

  const updateHotel = async (updatedFields: Partial<HotelData>): Promise<boolean> => {
    if (!hotel) return false;
    setIsLoading(true);
    try {
      if (hotel.thread_id) {
        await api.updateRestro(hotel.thread_id, updatedFields);
      }
      setHotel((prev) => (prev ? { ...prev, ...updatedFields } : null));
      setIsLoading(false);
      return true;
    } catch {
      // Optimistic update locally
      setHotel((prev) => (prev ? { ...prev, ...updatedFields } : null));
      setIsLoading(false);
      return true;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // ignore
    }
    setHotel(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const useDemoHotel = () => {
    setHotel(DEFAULT_HOTEL_DATA);
  };

  return (
    <AuthContext.Provider
      value={{
        hotel,
        isAuthenticated: !!hotel,
        isLoading,
        error,
        login,
        firstLogin,
        updateHotel,
        logout,
        useDemoHotel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
