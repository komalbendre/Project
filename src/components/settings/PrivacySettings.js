// src/components/settings/PrivacySettings.js
import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import ToggleSwitch from './ToggleSwitch';

const Icons = {
  Eye: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Phone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  FileText: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
  MessageCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  Check: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
};

const PrivacySettings = ({ settings, onUpdate }) => {
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    showResume: true,
    allowMessagesFrom: 'anyone'
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (settings) {
      setPrivacySettings(settings);
    }
  }, [settings]);

  const handleChange = (key, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await settingsService.updatePrivacy(privacySettings);
      onUpdate({ privacy: response.data });
      setMessage({ text: 'Privacy settings updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Privacy Settings</h2>
        <p style={styles.subtitle}>Control who can see your information</p>
      </div>

      {message.text && (
        <div style={{
          ...styles.message,
          ...(message.type === 'success' ? styles.successMessage : styles.errorMessage)
        }}>
          {message.type === 'success' ? <Icons.Check /> : <Icons.AlertCircle />}
          {message.text}
        </div>
      )}

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.Eye />
          <h3 style={styles.sectionTitle}>Profile Visibility</h3>
        </div>

        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="profileVisibility"
              value="public"
              checked={privacySettings.profileVisibility === 'public'}
              onChange={(e) => handleChange('profileVisibility', e.target.value)}
              style={styles.radio}
            />
            <div style={styles.radioContent}>
              <span style={styles.radioTitle}>Public</span>
              <span style={styles.radioDesc}>Anyone can see your profile</span>
            </div>
          </label>

          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="profileVisibility"
              value="connections"
              checked={privacySettings.profileVisibility === 'connections'}
              onChange={(e) => handleChange('profileVisibility', e.target.value)}
              style={styles.radio}
            />
            <div style={styles.radioContent}>
              <span style={styles.radioTitle}>Connections Only</span>
              <span style={styles.radioDesc}>Only your connections can see your profile</span>
            </div>
          </label>

          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="profileVisibility"
              value="private"
              checked={privacySettings.profileVisibility === 'private'}
              onChange={(e) => handleChange('profileVisibility', e.target.value)}
              style={styles.radio}
            />
            <div style={styles.radioContent}>
              <span style={styles.radioTitle}>Private</span>
              <span style={styles.radioDesc}>Only you can see your profile</span>
            </div>
          </label>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.Mail />
          <h3 style={styles.sectionTitle}>Contact Information</h3>
        </div>

        <div style={styles.settingsList}>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Show Email Address</div>
              <div style={styles.settingDesc}>Display your email on your public profile</div>
            </div>
            <ToggleSwitch
              checked={privacySettings.showEmail}
              onChange={(e) => handleChange('showEmail', e.target.checked)}
            />
          </div>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Show Phone Number</div>
              <div style={styles.settingDesc}>Display your phone number on your public profile</div>
            </div>
            <ToggleSwitch
              checked={privacySettings.showPhone}
              onChange={(e) => handleChange('showPhone', e.target.checked)}
            />
          </div>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Show Resume</div>
              <div style={styles.settingDesc}>Make your resume visible to companies</div>
            </div>
            <ToggleSwitch
              checked={privacySettings.showResume}
              onChange={(e) => handleChange('showResume', e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.MessageCircle />
          <h3 style={styles.sectionTitle}>Messaging</h3>
        </div>

        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="allowMessagesFrom"
              value="anyone"
              checked={privacySettings.allowMessagesFrom === 'anyone'}
              onChange={(e) => handleChange('allowMessagesFrom', e.target.value)}
              style={styles.radio}
            />
            <div style={styles.radioContent}>
              <span style={styles.radioTitle}>Anyone</span>
              <span style={styles.radioDesc}>Anyone can send you messages</span>
            </div>
          </label>

          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="allowMessagesFrom"
              value="connections"
              checked={privacySettings.allowMessagesFrom === 'connections'}
              onChange={(e) => handleChange('allowMessagesFrom', e.target.value)}
              style={styles.radio}
            />
            <div style={styles.radioContent}>
              <span style={styles.radioTitle}>Connections Only</span>
              <span style={styles.radioDesc}>Only people you're connected with can message you</span>
            </div>
          </label>

          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="allowMessagesFrom"
              value="nobody"
              checked={privacySettings.allowMessagesFrom === 'nobody'}
              onChange={(e) => handleChange('allowMessagesFrom', e.target.value)}
              style={styles.radio}
            />
            <div style={styles.radioContent}>
              <span style={styles.radioTitle}>Nobody</span>
              <span style={styles.radioDesc}>Disable messages from everyone</span>
            </div>
          </label>
        </div>
      </div>

      <div style={styles.actionButtons}>
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            ...styles.saveButton,
            ...(loading && styles.buttonLoading)
          }}
        >
          {loading ? (
            <>
              <span style={styles.spinner} />
              Saving...
            </>
          ) : (
            <>
              <Icons.Save />
              Save Privacy Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid var(--border-color)',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  subtitle: {
    fontSize: '0.95rem',
    color: 'var(--text-tertiary)',
  },
  section: {
    marginBottom: '2.5rem',
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    paddingBottom: '0.75rem',
    borderBottom: '1px solid var(--border-color)',
  },
  sectionTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
  },
  radio: {
    marginTop: '0.25rem',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--primary-color)',
  },
  radioContent: {
    flex: 1,
  },
  radioTitle: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  radioDesc: {
    fontSize: '0.875rem',
    color: 'var(--text-tertiary)',
  },
  settingsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  settingDesc: {
    fontSize: '0.875rem',
    color: 'var(--text-tertiary)',
  },

  actionButtons: {
    marginTop: '2rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  saveButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 2rem',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  buttonLoading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1.5rem',
  },
  successMessage: {
    backgroundColor: 'var(--success-bg)',
    color: 'var(--success-text)',
    border: '1px solid var(--success-border)',
  },
  errorMessage: {
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error-text)',
    border: '1px solid var(--error-border)',
  },
};
export default PrivacySettings;