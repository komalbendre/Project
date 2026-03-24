// src/components/settings/AppearanceSettings.js
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import settingsService from '../../services/settingsService';
import ToggleSwitch from './ToggleSwitch';

const Icons = {
  Palette: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="13.5" cy="6.5" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r="1.5" fill="currentColor" />
      <circle cx="17" cy="17" r="1.5" fill="currentColor" />
      <circle cx="7" cy="17" r="1.5" fill="currentColor" />
      <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" />
      <path d="M12 6v6l4 2" />
    </svg>
  ),
  Sun: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ),
  Moon: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  Globe: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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
  Monitor: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
};

const AppearanceSettings = ({ settings, onUpdate }) => {
  const { theme: currentTheme, updateTheme } = useTheme();
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: currentTheme || 'light',
    language: 'en',
    defaultResumeTemplate: 'resumeOne',
    compactView: false
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'hi', name: 'Hindi' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
  ];

  const resumeTemplates = [
    { id: 'resumeOne', name: 'Modern', description: 'Clean and professional design' },
    { id: 'resumeTwo', name: 'Creative', description: 'Stand out with unique layout' },
    { id: 'resumeThree', name: 'Minimal', description: 'Simple and elegant' },
  ];

  useEffect(() => {
    if (settings) {
      setAppearanceSettings(settings);
    }
  }, [settings]);

  const handleChange = (key, value) => {
    setAppearanceSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleThemeChange = async (newTheme) => {
    setAppearanceSettings(prev => ({ ...prev, theme: newTheme }));
    // Immediately apply theme change
    await updateTheme(newTheme);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await settingsService.updateAppearance(appearanceSettings);
      onUpdate({ appearance: response.data });
      setMessage({ text: 'Appearance settings updated successfully!', type: 'success' });

      // Ensure theme is applied
      await updateTheme(appearanceSettings.theme);

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
        <h2 style={styles.title}>Appearance</h2>
        <p style={styles.subtitle}>Customize how the platform looks</p>
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
          <Icons.Palette />
          <h3 style={styles.sectionTitle}>Theme</h3>
        </div>

        <div style={styles.themeGrid}>
          <label style={{
            ...styles.themeCard,
            ...(appearanceSettings.theme === 'light' && styles.themeCardActive)
          }}>
            <input
              type="radio"
              name="theme"
              value="light"
              checked={appearanceSettings.theme === 'light'}
              onChange={(e) => handleChange('theme', e.target.value)}
              style={styles.themeRadio}
            />
            <div style={styles.themePreview}>
              <Icons.Sun />
              <div style={styles.themeName}>Light</div>
              <div style={styles.themeDesc}>Bright and clean</div>
            </div>
          </label>

          <label style={{
            ...styles.themeCard,
            ...(appearanceSettings.theme === 'dark' && styles.themeCardActive)
          }}>
            <input
              type="radio"
              name="theme"
              value="dark"
              checked={appearanceSettings.theme === 'dark'}
              onChange={(e) => handleThemeChange(e.target.value)}
              style={styles.themeRadio}
            />
            <div style={styles.themePreview}>
              <Icons.Moon />
              <div style={styles.themeName}>Dark</div>
              <div style={styles.themeDesc}>Easy on the eyes</div>
            </div>
          </label>


          <label style={{
            ...styles.themeCard,
            ...(appearanceSettings.theme === 'system' && styles.themeCardActive)
          }}>
            <input
              type="radio"
              name="theme"
              value="system"
              checked={appearanceSettings.theme === 'system'}
              onChange={(e) => handleThemeChange(e.target.value)}
              style={styles.themeRadio}
            />
            <div style={styles.themePreview}>
              <Icons.Monitor />
              <div style={styles.themeName}>System</div>
              <div style={styles.themeDesc}>Follow device settings</div>
            </div>
          </label>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.Globe />
          <h3 style={styles.sectionTitle}>Language</h3>
        </div>

        <select
          value={appearanceSettings.language}
          onChange={(e) => handleChange('language', e.target.value)}
          style={styles.select}
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
        <p style={styles.note}>More languages coming soon</p>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.FileText />
          <h3 style={styles.sectionTitle}>Default Resume Template</h3>
        </div>

        <div style={styles.templateGrid}>
          {resumeTemplates.map(template => (
            <label
              key={template.id}
              style={{
                ...styles.templateCard,
                ...(appearanceSettings.defaultResumeTemplate === template.id && styles.templateCardActive)
              }}
            >
              <input
                type="radio"
                name="defaultResumeTemplate"
                value={template.id}
                checked={appearanceSettings.defaultResumeTemplate === template.id}
                onChange={(e) => handleChange('defaultResumeTemplate', e.target.value)}
                style={styles.templateRadio}
              />
              <div style={styles.templatePreview}>
                <div style={styles.templateName}>{template.name}</div>
                <div style={styles.templateDesc}>{template.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.Monitor />
          <h3 style={styles.sectionTitle}>Layout</h3>
        </div>

        <div style={styles.settingItem}>
          <div style={styles.settingInfo}>
            <div style={styles.settingLabel}>Compact View</div>
            <div style={styles.settingDesc}>Show more content with reduced spacing</div>
          </div>
          <ToggleSwitch
            checked={appearanceSettings.compactView}
            onChange={(e) => handleChange('compactView', e.target.checked)}
          />
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
              Save Appearance Settings
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
  themeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  themeCard: {
    padding: '1.5rem 1rem',
    backgroundColor: 'var(--bg-tertiary)',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textAlign: 'center',
    color: 'var(--text-primary)',
  },
  themeCardActive: {
    borderColor: 'var(--primary-color)',
    backgroundColor: 'var(--primary-light)',
  },
  themePreview: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  themeName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  themeDesc: {
    fontSize: '0.875rem',
    color: 'var(--text-tertiary)',
  },
  select: {
    width: '100%',
    maxWidth: '300px',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  note: {
    fontSize: '0.875rem',
    color: 'var(--text-tertiary)',
    marginTop: '0.5rem',
    fontStyle: 'italic',
  },
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  templateCard: {
    padding: '1rem',
    backgroundColor: 'var(--bg-tertiary)',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  templateCardActive: {
    borderColor: 'var(--primary-color)',
    backgroundColor: 'var(--primary-light)',
  },
  templatePreview: {
    textAlign: 'center',
  },
  templateName: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  templateDesc: {
    fontSize: '0.875rem',
    color: 'var(--text-tertiary)',
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

export default AppearanceSettings;