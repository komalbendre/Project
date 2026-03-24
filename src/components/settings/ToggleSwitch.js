// src/components/settings/ToggleSwitch.js
import React from 'react';

const ToggleSwitch = ({ checked, onChange, label, description }) => {
  return (
    <div style={styles.settingItem}>
      <div style={styles.settingInfo}>
        <div style={styles.settingLabel}>{label}</div>
        {description && <div style={styles.settingDesc}>{description}</div>}
      </div>
      <label style={styles.toggle}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          style={{ display: 'none' }}
        />
        <span 
          style={{
            ...styles.toggleSlider,
            backgroundColor: checked ? 'var(--primary-color)' : 'var(--border-color)'
          }}
        >
          <span style={{
            ...styles.toggleCircle,
            transform: checked ? 'translateX(24px)' : 'translateX(0)'
          }} />
        </span>
      </label>
    </div>
  );
};

const styles = {
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    backgroundColor: 'var(--bg-tertiary)',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    marginBottom: '0.5rem',
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
  toggle: {
    position: 'relative',
    display: 'inline-block',
    width: '52px',
    height: '28px',
    marginLeft: '1rem',
    flexShrink: 0,
  },
  toggleSlider: {
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    transition: '.3s',
    borderRadius: '34px',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
  },
  toggleCircle: {
    position: 'absolute',
    height: '24px',
    width: '24px',
    left: '2px',
    bottom: '2px',
    backgroundColor: 'white',
    transition: '.3s',
    borderRadius: '50%',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  },
};

export default ToggleSwitch;