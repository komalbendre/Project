// src/components/settings/AccountSettings.js
import React, { useState } from 'react';
import settingsService from '../../services/settingsService';
import ToggleSwitch from './ToggleSwitch';

const Icons = {
  User: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
  Key: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
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
  Info: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Shield: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
};

const AccountSettings = ({ user, settings, onUpdate }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  // Account settings state
  const [accountSettings, setAccountSettings] = useState({
    twoFactorAuth: settings?.account?.twoFactorAuth || false,
    sessionTimeout: settings?.account?.sessionTimeout || 30
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
    }
    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      await settingsService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: error.message || 'Failed to change password', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAccountSettingChange = (field, value) => {
    setAccountSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleAccountSettingsSubmit = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await settingsService.updateAccountSettings(accountSettings);
      onUpdate({ account: response.data });
      setMessage({ text: 'Account settings updated!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update settings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Section Tabs */}
      <div style={styles.sectionTabs}>
        <button
          onClick={() => setActiveSection('profile')}
          style={{
            ...styles.sectionTab,
            ...(activeSection === 'profile' ? styles.sectionTabActive : {})
          }}
        >
          <Icons.User />
          Profile Information
        </button>
        <button
          onClick={() => setActiveSection('password')}
          style={{
            ...styles.sectionTab,
            ...(activeSection === 'password' ? styles.sectionTabActive : {})
          }}
        >
          <Icons.Key />
          Change Password
        </button>
        <button
          onClick={() => setActiveSection('security')}
          style={{
            ...styles.sectionTab,
            ...(activeSection === 'security' ? styles.sectionTabActive : {})
          }}
        >
          <Icons.Shield />
          Security Settings
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div style={{
          ...styles.message,
          ...(message.type === 'success' ? styles.successMessage : styles.errorMessage)
        }}>
          {message.type === 'success' ? <Icons.Check /> : <Icons.AlertCircle />}
          {message.text}
        </div>
      )}

      {/* Content */}
      <div style={styles.content}>
        {activeSection === 'profile' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Profile Information</h3>
            <p style={styles.sectionDesc}>
              Your basic profile information. To edit these details, go to the Profile page.
            </p>

            <div style={styles.infoGrid}>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <Icons.User />
                  Full Name
                </div>
                <div style={styles.infoValue}>{user?.fullName || user?.fname + ' ' + user?.lname || 'Not set'}</div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <Icons.Mail />
                  Email
                </div>
                <div style={styles.infoValue}>{user?.email || 'Not set'}</div>
              </div>

              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>
                  <Icons.Phone />
                  Phone
                </div>
                <div style={styles.infoValue}>{user?.profile?.phone || 'Not set'}</div>
              </div>
            </div>

            <div style={styles.actionButtons}>
              <a href="/profile-form" style={styles.primaryButton}>
                Edit Profile
              </a>
            </div>
          </div>
        )}

        {activeSection === 'password' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Change Password</h3>
            <p style={styles.sectionDesc}>
              Update your password to keep your account secure.
            </p>

            <form onSubmit={handlePasswordSubmit} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  style={{
                    ...styles.input,
                    ...(passwordErrors.currentPassword && styles.errorInput)
                  }}
                  placeholder="Enter current password"
                />
                {passwordErrors.currentPassword && (
                  <div style={styles.errorText}>
                    <Icons.AlertCircle />
                    {passwordErrors.currentPassword}
                  </div>
                )}
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  style={{
                    ...styles.input,
                    ...(passwordErrors.newPassword && styles.errorInput)
                  }}
                  placeholder="Enter new password"
                />
                {passwordErrors.newPassword && (
                  <div style={styles.errorText}>
                    <Icons.AlertCircle />
                    {passwordErrors.newPassword}
                  </div>
                )}
                <div style={styles.helperText}>
                  <Icons.Info />
                  Password must be at least 6 characters
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  style={{
                    ...styles.input,
                    ...(passwordErrors.confirmPassword && styles.errorInput)
                  }}
                  placeholder="Confirm new password"
                />
                {passwordErrors.confirmPassword && (
                  <div style={styles.errorText}>
                    <Icons.AlertCircle />
                    {passwordErrors.confirmPassword}
                  </div>
                )}
              </div>

              <div style={styles.actionButtons}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    ...styles.primaryButton,
                    ...(loading && styles.buttonLoading)
                  }}
                >
                  {loading ? (
                    <>
                      <span style={styles.spinner} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Icons.Save />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeSection === 'security' && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Security Settings</h3>
            <p style={styles.sectionDesc}>
              Manage additional security options for your account.
            </p>

            <div style={styles.settingsList}>

              <div style={styles.settingItem}>
                <div style={styles.settingInfo}>
                  <div style={styles.settingLabel}>Two-Factor Authentication</div>
                  <div style={styles.settingDesc}>
                    Add an extra layer of security to your account
                  </div>
                </div>
                <ToggleSwitch
                  checked={accountSettings.twoFactorAuth}
                  onChange={(e) => handleAccountSettingChange('twoFactorAuth', e.target.checked)}
                />
              </div>

              <div style={styles.settingItem}>
                <div style={styles.settingInfo}>
                  <div style={styles.settingLabel}>Session Timeout</div>
                  <div style={styles.settingDesc}>
                    Automatically log out after inactivity (minutes)
                  </div>
                </div>
                <select
                  value={accountSettings.sessionTimeout}
                  onChange={(e) => handleAccountSettingChange('sessionTimeout', parseInt(e.target.value))}
                  style={styles.select}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
            </div>

            <div style={styles.actionButtons}>
              <button
                onClick={handleAccountSettingsSubmit}
                disabled={loading}
                style={{
                  ...styles.primaryButton,
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
                    Save Security Settings
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Styles */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// Add this styles object inside AccountSettings.js, before the return statement

const styles = {
  container: {
    backgroundColor: 'var(--bg-card)',
    borderRadius: '12px',
    padding: '2rem',
    border: '1px solid var(--border-color)',
  },
  sectionTabs: {
    display: 'flex',
    borderBottom: '1px solid var(--border-color)',
    backgroundColor: 'var(--bg-tertiary)',
    padding: '0 1rem',
    borderRadius: '8px 8px 0 0',
  },
  sectionTab: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    fontSize: '0.95rem',
    fontWeight: 500,
    color: 'var(--text-tertiary)',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease',
  },
  sectionTabActive: {
    color: 'var(--primary-color)',
    borderBottomColor: 'var(--primary-color)',
    backgroundColor: 'var(--primary-light)',
  },
  content: {
    padding: '2rem',
  },
  section: {
    marginBottom: '2rem',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  sectionDesc: {
    fontSize: '0.95rem',
    color: 'var(--text-tertiary)',
    marginBottom: '1.5rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  infoItem: {
    padding: '1rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  infoLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: 'var(--text-tertiary)',
    marginBottom: '0.5rem',
  },
  infoValue: {
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
  },
  form: {
    maxWidth: '500px',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
  },
  errorInput: {
    borderColor: 'var(--error-border)',
  },
  errorText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.8125rem',
    color: 'var(--error-text)',
    marginTop: '0.25rem',
  },
  helperText: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.8125rem',
    color: 'var(--text-tertiary)',
    marginTop: '0.25rem',
  },
  actionButtons: {
    marginTop: '2rem',
  },
  primaryButton: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--primary-color)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    textDecoration: 'none',
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
    margin: '1rem 2rem',
    fontSize: '0.95rem',
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


  select: {
    padding: '0.5rem 2rem 0.5rem 1rem',
    borderRadius: '6px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%236b7280\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 0.75rem center',
    backgroundSize: '16px',
  },
};

export default AccountSettings;