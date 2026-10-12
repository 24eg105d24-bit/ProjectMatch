import React, { createContext, useContext, useCallback, useState, useEffect } from 'react';
import api from '../api/client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('projectmatch_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('projectmatch_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('projectmatch_user');
    }
  }, [currentUser]);

  const saveSession = (response) => {
    const user = {
      id: response.userId,
      name: response.fullName,
      email: response.email,
      role: response.role?.replace('ROLE_', '').toLowerCase(),
      token: response.token,
      avatar: '',
      department: '',
      skills: [],
      interests: [],
      stats: {
        activeTeams: 0,
        completedProjects: 0,
        compatibilityMatches: 0,
        pendingApplications: 0
      }
    };

    localStorage.setItem('projectmatch_session', JSON.stringify({
      token: response.token,
      user
    }));

    setCurrentUser(user);

    return user;
  };

  const login = async ({ email, password }) => {
    setLoading(true);

    try {
      const response = await api.post('/api/auth/login', {
        email,
        password
      });

      const user = saveSession(response.data);

      return { success: true, user };
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);

    try {
      const response = await api.post('/api/auth/register', {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'STUDENT',
        department: formData.department || 'CSE',
        academicYear: formData.academicYear || formData.year || '3rd Year',
        hoursPerWeek: Number(formData.hoursPerWeek) || 15,
        preferredRoles: Array.isArray(formData.preferredRoles)
          ? formData.preferredRoles
          : formData.preferredRoles
            ? [formData.preferredRoles]
            : [],
        skills: Array.isArray(formData.skills)
          ? formData.skills
          : formData.skills
            ? formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
            : [],
        interests: Array.isArray(formData.interests)
          ? formData.interests
          : formData.interests
            ? formData.interests.split(',').map(interest => interest.trim()).filter(Boolean)
            : []
      });

      const user = saveSession(response.data);

      return { success: true, user };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('projectmatch_session');
    setCurrentUser(null);
  };

  const switchRole = (_newRole) => {
    console.warn('Role switching is disabled for real accounts.');
  };

  const updateProfile = useCallback((updatedFields) => {
    setCurrentUser(prev => prev ? { ...prev, ...updatedFields } : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      login,
      register,
      logout,
      switchRole,
      updateProfile,
      isAuthenticated: Boolean(currentUser),
      isAdmin: currentUser?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
