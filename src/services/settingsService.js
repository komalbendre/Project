// src/services/settingsService.js
import api from './api';

const settingsService = {
  // Get all settings
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update notification settings
  updateNotifications: async (notifications) => {
    try {
      const response = await api.put('/settings/notifications', notifications);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update privacy settings
  updatePrivacy: async (privacy) => {
    try {
      const response = await api.put('/settings/privacy', privacy);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update appearance settings
  updateAppearance: async (appearance) => {
    try {
      const response = await api.put('/settings/appearance', appearance);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    try {
      const response = await api.put('/settings/preferences', preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update account settings
  updateAccountSettings: async (account) => {
    try {
      const response = await api.put('/settings/account', account);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/settings/change-password', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete account
  deleteAccount: async (password) => {
    try {
      const response = await api.delete('/settings/account', { data: { password } });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default settingsService;