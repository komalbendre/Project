// src/components/settings/NotificationSettings.js
import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import ToggleSwitch from './ToggleSwitch';

const Icons = {
  Bell: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  ),
  Mail: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Smartphone: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
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

const NotificationSettings = ({ settings, onUpdate }) => {
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      newInternshipMatches: true,
      applicationUpdates: true,
      interviewReminders: true,
      careerPathRecommendations: true,
      newsletter: false,
      marketingEmails: false
    },
    push: {
      enabled: true,
      applicationUpdates: true,
      messages: true
    }
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (settings) {
      setNotificationSettings(settings);
    }
  }, [settings]);

  const handleEmailChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      email: {
        ...prev.email,
        [key]: !prev.email[key]
      }
    }));
  };

  const handlePushChange = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      push: {
        ...prev.push,
        [key]: !prev.push[key]
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await settingsService.updateNotifications(notificationSettings);
      onUpdate({ notifications: response.data });
      setMessage({ text: 'Notification settings updated successfully!', type: 'success' });
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
        <h2 style={styles.title}>Notification Preferences</h2>
        <p style={styles.subtitle}>Choose how you want to be notified</p>
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
          <Icons.Mail />
          <h3 style={styles.sectionTitle}>Email Notifications</h3>
        </div>

        <div style={styles.settingsList}>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>New Internship Matches</div>
              <div style={styles.settingDesc}>Get notified when new internships match your profile</div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.email.newInternshipMatches}
              onChange={() => handleEmailChange('newInternshipMatches')}
            />
          </div>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Application Updates</div>
              <div style={styles.settingDesc}>Receive updates about your internship applications</div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.email.applicationUpdates}
              onChange={() => handleEmailChange('applicationUpdates')}
            />
          </div>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Interview Reminders</div>
              <div style={styles.settingDesc}>Get reminders before your scheduled interviews</div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.email.interviewReminders}
              onChange={() => handleEmailChange('interviewReminders')}
            />
          </div>


          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Career Path Recommendations</div>
              <div style={styles.settingDesc}>Receive AI-powered career path suggestions</div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.email.careerPathRecommendations}
              onChange={() => handleEmailChange('careerPathRecommendations')}
            />
          </div>


          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Newsletter</div>
              <div style={styles.settingDesc}>Receive our monthly newsletter with career tips</div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.email.newsletter}
              onChange={() => handleEmailChange('newsletter')}
            />
          </div>

          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Marketing Emails</div>
              <div style={styles.settingDesc}>Receive promotional offers and updates</div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.email.marketingEmails}
              onChange={() => handleEmailChange('marketingEmails')}
            />
          </div>

        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.Smartphone />
          <h3 style={styles.sectionTitle}>Push Notifications</h3>
        </div>

        <div style={styles.settingsList}>
          <div style={styles.settingItem}>
            <div style={styles.settingInfo}>
              <div style={styles.settingLabel}>Enable Push Notifications</div>
              <div style={styles.settingDesc}>Receive notifications in your browser</div>
            </div>
            <ToggleSwitch
              checked={notificationSettings.push.enabled}
              onChange={() => handlePushChange('enabled')}
            />
          </div>

          {notificationSettings.push.enabled && (
            <>
              <div style={styles.settingItem}>
                <div style={styles.settingInfo}>
                  <div style={styles.settingLabel}>Application Updates</div>
                  <div style={styles.settingDesc}>Get push notifications for application status changes</div>
                </div>
                <ToggleSwitch
                  checked={notificationSettings.push.applicationUpdates}
                  onChange={() => handlePushChange('applicationUpdates')}
                />
              </div>

              <div style={styles.settingItem}>
                <div style={styles.settingInfo}>
                  <div style={styles.settingLabel}>Messages</div>
                  <div style={styles.settingDesc}>Get notified when you receive new messages</div>
                </div>
                <ToggleSwitch
                  checked={notificationSettings.push.messages}
                  onChange={() => handlePushChange('messages')}
                />
              </div>
            </>
          )}
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
              Save Notification Settings
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

export default NotificationSettings;