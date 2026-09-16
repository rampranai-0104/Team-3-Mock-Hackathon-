import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const mapBackendRoleToFrontend = (role) => {
  if (!role) return 'patron';
  const lower = role.toLowerCase();
  if (lower === 'public' || lower === 'patron') return 'patron';
  if (lower === 'artist' || lower === 'artisan') return 'artisan';
  if (lower === 'institution') return 'institution';
  if (lower === 'admin') return 'admin';
  return 'patron';
};

export const mapFrontendRoleToBackend = (role) => {
  if (!role) return 'public';
  const lower = role.toLowerCase();
  if (lower === 'patron' || lower === 'public') return 'public';
  if (lower === 'artisan' || lower === 'artist') return 'artist';
  if (lower === 'institution') return 'institution';
  if (lower === 'admin') return 'admin';
  return 'public';
};

export const getRoleDashboardRoute = (role) => {
  const norm = mapBackendRoleToFrontend(role);
  switch (norm) {
    case 'admin':
      return '/dashboard/admin';
    case 'artisan':
      return '/dashboard/artisan';
    case 'institution':
      return '/dashboard/institution';
    case 'patron':
    default:
      return '/dashboard/patron';
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCachedUser());
  const [token, setToken] = useState(() => localStorage.getItem('tvarita_token'));
  const [loading, setLoading] = useState(true);

  // Restore & validate session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const savedToken = localStorage.getItem('tvarita_token');
      if (savedToken) {
        try {
          const profile = await authService.getMe();
          if (isMounted && profile) {
            setUser(profile);
            setToken(savedToken);
          }
        } catch (err) {
          console.warn('Initial session validation skipped or expired:', err.message);
          // Retain cached user for offline/demo resilience if token format exists
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const result = await authService.login(email, password);
      setUser(result.user);
      setToken(result.token);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    try {
      const backendRole = mapFrontendRoleToBackend(formData.accountType || formData.role);
      const payload = {
        name: formData.fullName || formData.name,
        email: formData.email,
        password: formData.password,
        role: backendRole,
        phone: formData.phone || '',
      };
      const result = await authService.register(payload);
      setUser(result.user);
      setToken(result.token);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const refreshUser = async () => {
    try {
      const updated = await authService.getMe();
      if (updated) setUser(updated);
      return updated;
    } catch {
      return null;
    }
  };

  const sendOtp = async (email, purpose = 'registration', name = '') => {
    return await authService.sendOtp(email, purpose, name);
  };

  const verifyOtp = async (email, otp, purpose = 'registration') => {
    const res = await authService.verifyOtp(email, otp, purpose);
    await refreshUser();
    return res;
  };

  const currentRole = mapBackendRoleToFrontend(user?.role);

  const value = {
    user,
    token,
    role: currentRole,
    isAuthenticated: !!token && !!user,
    loading,
    login,
    register,
    sendOtp,
    verifyOtp,
    logout,
    refreshUser,
    getRoleDashboardRoute,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
