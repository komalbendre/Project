// src/components/settings/PreferencesSettings.js
import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';

const Icons = {
  Sliders: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="12" x2="20" y2="3" />
      <line x1="2" y1="14" x2="6" y2="14" />
      <line x1="10" y1="8" x2="14" y2="8" />
      <line x1="18" y1="16" x2="22" y2="16" />
    </svg>
  ),
  MapPin: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Briefcase: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  DollarSign: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  TrendingUp: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
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
  Plus: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  X: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const PreferencesSettings = ({ settings, onUpdate }) => {
  const [preferences, setPreferences] = useState({
    defaultJobSearchRadius: 50,
    preferredJobTypes: [],
    preferredLocations: [],
    desiredSalary: {
      min: '',
      max: '',
      currency: 'USD'
    },
    skillLevel: 'intermediate'
  });

  const [newLocation, setNewLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const jobTypes = [
    { id: 'full-time', label: 'Full Time' },
    { id: 'part-time', label: 'Part Time' },
    { id: 'internship', label: 'Internship' },
    { id: 'remote', label: 'Remote' },
    { id: 'hybrid', label: 'Hybrid' },
  ];

  const skillLevels = [
    { id: 'beginner', label: 'Beginner', desc: 'Just starting out' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
    { id: 'advanced', label: 'Advanced', desc: 'Strong skills' },
    { id: 'expert', label: 'Expert', desc: 'Master level' },
  ];

  const currencies = ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD'];

  useEffect(() => {
    if (settings) {
      setPreferences(settings);
    }
  }, [settings]);

  const handleJobTypeToggle = (type) => {
    setPreferences(prev => ({
      ...prev,
      preferredJobTypes: prev.preferredJobTypes.includes(type)
        ? prev.preferredJobTypes.filter(t => t !== type)
        : [...prev.preferredJobTypes, type]
    }));
  };

  const handleAddLocation = () => {
    if (newLocation.trim() && !preferences.preferredLocations.includes(newLocation.trim())) {
      setPreferences(prev => ({
        ...prev,
        preferredLocations: [...prev.preferredLocations, newLocation.trim()]
      }));
      setNewLocation('');
    }
  };

  const handleRemoveLocation = (location) => {
    setPreferences(prev => ({
      ...prev,
      preferredLocations: prev.preferredLocations.filter(l => l !== location)
    }));
  };

  const handleSalaryChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      desiredSalary: {
        ...prev.desiredSalary,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await settingsService.updatePreferences(preferences);
      onUpdate({ preferences: response.data });
      setMessage({ text: 'Preferences updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: error.message || 'Failed to update preferences', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Job Preferences</h2>
        <p style={styles.subtitle}>Customize your job search preferences</p>
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
          <Icons.MapPin />
          <h3 style={styles.sectionTitle}>Location Preferences</h3>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Default Search Radius (miles/km)</label>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={preferences.defaultJobSearchRadius}
            onChange={(e) => setPreferences(prev => ({ ...prev, defaultJobSearchRadius: parseInt(e.target.value) }))}
            style={styles.rangeInput}
          />
          <div style={styles.rangeValue}>{preferences.defaultJobSearchRadius} miles/km</div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Preferred Locations</label>
          <div style={styles.locationInput}>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="Enter city, state, or country"
              style={styles.input}
              onKeyPress={(e) => e.key === 'Enter' && handleAddLocation()}
            />
            <button onClick={handleAddLocation} style={styles.addButton}>
              <Icons.Plus />
              Add
            </button>
          </div>

          <div style={styles.locationTags}>
            {preferences.preferredLocations.map((location, index) => (
              <div key={index} style={styles.locationTag}>
                <Icons.MapPin />
                {location}
                <button
                  onClick={() => handleRemoveLocation(location)}
                  style={styles.removeTag}
                >
                  <Icons.X />
                </button>
              </div>
            ))}
            {preferences.preferredLocations.length === 0 && (
              <div style={styles.emptyState}>No preferred locations added yet</div>
            )}
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.Briefcase />
          <h3 style={styles.sectionTitle}>Job Types</h3>
        </div>

        <div style={styles.jobTypesGrid}>
          {jobTypes.map(type => (
            <label key={type.id} style={styles.jobTypeLabel}>
              <input
                type="checkbox"
                checked={preferences.preferredJobTypes.includes(type.id)}
                onChange={() => handleJobTypeToggle(type.id)}
                style={styles.checkbox}
              />
              <span style={styles.jobTypeText}>{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.DollarSign />
          <h3 style={styles.sectionTitle}>Salary Expectations</h3>
        </div>

        <div style={styles.salaryGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Currency</label>
            <select
              value={preferences.desiredSalary.currency}
              onChange={(e) => handleSalaryChange('currency', e.target.value)}
              style={styles.select}
            >
              {currencies.map(curr => (
                <option key={curr} value={curr}>{curr}</option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Minimum</label>
            <input
              type="number"
              value={preferences.desiredSalary.min}
              onChange={(e) => handleSalaryChange('min', e.target.value)}
              placeholder="Min"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Maximum</label>
            <input
              type="number"
              value={preferences.desiredSalary.max}
              onChange={(e) => handleSalaryChange('max', e.target.value)}
              placeholder="Max"
              style={styles.input}
            />
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <Icons.TrendingUp />
          <h3 style={styles.sectionTitle}>Skill Level</h3>
        </div>

        <div style={styles.skillLevelGrid}>
          {skillLevels.map(level => (
            <label
              key={level.id}
              style={{
                ...styles.skillLevelCard,
                ...(preferences.skillLevel === level.id && styles.skillLevelCardActive)
              }}
            >
              <input
                type="radio"
                name="skillLevel"
                value={level.id}
                checked={preferences.skillLevel === level.id}
                onChange={(e) => setPreferences(prev => ({ ...prev, skillLevel: e.target.value }))}
                style={styles.skillLevelRadio}
              />
              <div style={styles.skillLevelContent}>
                <span style={styles.skillLevelTitle}>{level.label}</span>
                <span style={styles.skillLevelDesc}>{level.desc}</span>
              </div>
            </label>
          ))}
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
              Save Preferences
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
  rangeInput: {
    width: '100%',
    marginBottom: '0.5rem',
    accentColor: 'var(--primary-color)',
  },
  rangeValue: {
    textAlign: 'center',
    fontSize: '1rem',
    fontWeight: 500,
    color: 'var(--primary-color)',
  },
  locationInput: {
    display: 'flex',
    gap: '0.5rem',
    marginBottom: '1rem',
  },
  input: {
    flex: 1,
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-color)',
    border: '1px solid var(--primary-color)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  locationTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    minHeight: '3rem',
  },
  locationTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.375rem 0.75rem',
    backgroundColor: 'var(--primary-light)',
    color: 'var(--primary-color)',
    borderRadius: '20px',
    fontSize: '0.875rem',
    border: '1px solid var(--border-color)',
  },
  removeTag: {
    background: 'none',
    border: 'none',
    color: 'var(--primary-color)',
    cursor: 'pointer',
    padding: '0.125rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    color: 'var(--text-tertiary)',
    fontSize: '0.875rem',
    fontStyle: 'italic',
    padding: '0.5rem',
  },
  jobTypesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  jobTypeLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
  },
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--primary-color)',
  },
  jobTypeText: {
    fontSize: '0.95rem',
    color: 'var(--text-primary)',
  },
  salaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
  },
  skillLevelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
  },
  skillLevelCard: {
    display: 'flex',
    padding: '1rem',
    backgroundColor: 'var(--bg-tertiary)',
    border: '2px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  skillLevelCardActive: {
    borderColor: 'var(--primary-color)',
    backgroundColor: 'var(--primary-light)',
  },
  skillLevelRadio: {
    marginRight: '0.75rem',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: 'var(--primary-color)',
  },
  skillLevelContent: {
    flex: 1,
  },
  skillLevelTitle: {
    display: 'block',
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
    marginBottom: '0.25rem',
  },
  skillLevelDesc: {
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
export default PreferencesSettings;