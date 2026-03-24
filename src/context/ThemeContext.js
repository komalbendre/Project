// src/context/ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import settingsService from '../services/settingsService';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Load theme from settings on app start
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await settingsService.getSettings();
      const savedTheme = response.data?.appearance?.theme || 'light';
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setLoading(false);
    }
  };

  // In ThemeContext.js, update the applyTheme function:

  const applyTheme = (newTheme) => {
    const root = document.documentElement;

    // Add transition class temporarily
    document.body.classList.add('theme-transition');

    if (newTheme === 'dark') {
      root.style.setProperty('--bg-primary', '#1a1a1a');
      root.style.setProperty('--bg-secondary', '#2d2d2d');
      root.style.setProperty('--text-primary', '#ffffff');
      root.style.setProperty('--text-secondary', '#e0e0e0');
      root.style.setProperty('--border-color', '#404040');
      root.style.setProperty('--card-bg', '#2d2d2d');
      root.style.setProperty('--input-bg', '#3d3d3d');
      root.style.setProperty('--hover-bg', '#404040');
      root.style.setProperty('--navbar-bg', '#1a1a1a');
      root.style.setProperty('--sidebar-bg', '#1a1a1a');

      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else if (newTheme === 'light') {
      root.style.setProperty('--bg-primary', '#ffffff');
      root.style.setProperty('--bg-secondary', '#f8fafc');
      root.style.setProperty('--text-primary', '#191919');
      root.style.setProperty('--text-secondary', '#6b7280');
      root.style.setProperty('--border-color', '#e5e7eb');
      root.style.setProperty('--card-bg', '#ffffff');
      root.style.setProperty('--input-bg', '#ffffff');
      root.style.setProperty('--hover-bg', '#f3f4f6');
      root.style.setProperty('--navbar-bg', '#ffffff');
      root.style.setProperty('--sidebar-bg', '#ffffff');

      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }

    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('theme-transition');
    }, 300);
  };

  // Update theme
  const updateTheme = async (newTheme) => {
    setTheme(newTheme);
    applyTheme(newTheme);

    // Save to backend
    try {
      const settings = await settingsService.getSettings();
      const appearance = { ...settings.data?.appearance, theme: newTheme };
      await settingsService.updateAppearance(appearance);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  );
};