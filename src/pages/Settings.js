// src/pages/Settings.js - Update with all tabs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayout from '../components/settings/SettingsLayout';
import AccountSettings from '../components/settings/AccountSettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import PrivacySettings from '../components/settings/PrivacySettings';
import AppearanceSettings from '../components/settings/AppearanceSettings';
import PreferencesSettings from '../components/settings/PreferencesSettings';
import DangerZone from '../components/settings/DangerZone';

import settingsService from '../services/settingsService';
import api from '../services/api';

// Icons
const Icons = {
  ArrowLeft: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  ),
  Loader: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v2" />
      <path d="M12 12v2" />
      <path d="M12 18v2" />
    </svg>
  )
};

const Settings = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
    fetchUser();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      console.log('Fetching settings...');
      const response = await settingsService.getSettings();
      console.log('Settings loaded:', response);
      setSettings(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching settings:', error);
      if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to server. Please check if backend is running.');
      } else if (error.response?.status === 404) {
        setError('Settings API not found. Please check backend routes.');
      } else {
        setError(error.message || 'Failed to load settings');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/me');
      setUser(response.data.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleSettingsUpdate = (updatedSettings) => {
    setSettings(prev => ({
      ...prev,
      ...updatedSettings
    }));
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Loading settings...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>{error}</p>
          <button onClick={fetchSettings} style={styles.retryButton}>
            Try Again
          </button>
        </div>
      );
    }

    switch (activeTab) {
      case 'account':
        return (
          <AccountSettings 
            user={user} 
            settings={settings} 
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'notifications':
        return (
          <NotificationSettings 
            settings={settings?.notifications} 
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'privacy':
        return (
          <PrivacySettings 
            settings={settings?.privacy} 
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'appearance':
        return (
          <AppearanceSettings 
            settings={settings?.appearance} 
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'preferences':
        return (
          <PreferencesSettings 
            settings={settings?.preferences} 
            onUpdate={handleSettingsUpdate}
          />
        );
      case 'danger':
        return (
          <DangerZone 
            user={user}
            onAccountDeleted={() => navigate('/login')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <button
          onClick={() => navigate(-1)}
          style={styles.backButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f0f7ff';
            e.currentTarget.style.transform = 'translateX(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <Icons.ArrowLeft />
          Back
        </button>
      </div>

      {/* Settings Layout with Tabs and Content */}
      <SettingsLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {renderTabContent()}
      </SettingsLayout>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  pageContainer: {
    minHeight: 'calc(100vh - 70px)',
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: '1rem 2rem',
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    color: '#0073b1',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: '6px',
    transition: 'all 0.2s ease',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#0073b1',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '1rem',
  },
  errorContainer: {
    padding: '2rem',
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #fee2e2',
  },
  errorText: {
    color: '#991b1b',
    marginBottom: '1rem',
  },
  retryButton: {
    padding: '0.5rem 1.5rem',
    backgroundColor: '#0073b1',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
};

export default Settings;