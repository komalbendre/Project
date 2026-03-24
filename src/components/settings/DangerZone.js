// src/components/settings/DangerZone.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import settingsService from '../../services/settingsService';

const Icons = {
  AlertTriangle: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    </svg>
  ),
  AlertCircle: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const DangerZone = ({ user, onAccountDeleted }) => {
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm');
      return;
    }

    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await settingsService.deleteAccount(password);
      
      // Clear local storage
      localStorage.clear();
      
      // Callback
      onAccountDeleted();
      
      // Redirect to home
      navigate('/');
    } catch (error) {
      setError(error.message || 'Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Danger Zone</h2>
        <p style={styles.subtitle}>Irreversible and destructive actions</p>
      </div>

      <div style={styles.warningCard}>
        <div style={styles.warningIcon}>
          <Icons.AlertTriangle />
        </div>
        <div style={styles.warningContent}>
          <h3 style={styles.warningTitle}>Delete Account</h3>
          <p style={styles.warningText}>
            Once you delete your account, there is no going back. Please be certain.
            This action will:
          </p>
          <ul style={styles.warningList}>
            <li>Permanently delete your profile and all associated data</li>
            <li>Remove all your applications and saved internships</li>
            <li>Delete your resume and career paths</li>
            <li>Cancel any active sessions</li>
          </ul>
          <button
            onClick={() => setShowDeleteModal(true)}
            style={styles.deleteButton}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Delete Account</h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword('');
                  setConfirmText('');
                  setError('');
                }}
                style={styles.closeButton}
              >
                <Icons.X />
              </button>
            </div>

            <div style={styles.modalContent}>
              <div style={styles.modalWarning}>
                <Icons.AlertCircle />
                <span>This action cannot be undone. All your data will be permanently deleted.</span>
              </div>

              {error && (
                <div style={styles.modalError}>
                  <Icons.AlertCircle />
                  {error}
                </div>
              )}

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Type <strong>DELETE</strong> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Enter your password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.modalFooter}>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword('');
                  setConfirmText('');
                  setError('');
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={loading || confirmText !== 'DELETE' || !password}
                style={{
                  ...styles.confirmDeleteButton,
                  ...((loading || confirmText !== 'DELETE' || !password) && styles.confirmDeleteButtonDisabled)
                }}
              >
                {loading ? 'Deleting...' : 'Permanently Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
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
  warningCard: {
    display: 'flex',
    gap: '1.5rem',
    padding: '1.5rem',
    backgroundColor: 'var(--error-bg)',
    border: '1px solid var(--error-border)',
    borderRadius: '12px',
  },
  warningIcon: {
    color: 'var(--error-text)',
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: 'var(--error-text)',
    marginBottom: '0.5rem',
  },
  warningText: {
    fontSize: '0.95rem',
    color: 'var(--error-text)',
    marginBottom: '1rem',
  },
  warningList: {
    marginLeft: '1.5rem',
    marginBottom: '1.5rem',
    color: 'var(--error-text)',
    fontSize: '0.95rem',
  },
  deleteButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'var(--error-text)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: 'var(--modal-bg)',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '90vh',
    overflow: 'auto',
    border: '1px solid var(--border-color)',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderBottom: '1px solid var(--border-color)',
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    color: 'var(--text-tertiary)',
  },
  modalContent: {
    padding: '1.5rem',
  },
  modalWarning: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error-text)',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    fontSize: '0.95rem',
  },
  modalError: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem',
    backgroundColor: 'var(--error-bg)',
    color: 'var(--error-text)',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.875rem',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'var(--text-primary)',
    marginBottom: '0.5rem',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    fontSize: '0.95rem',
    backgroundColor: 'var(--input-bg)',
    color: 'var(--text-primary)',
  },
  modalFooter: {
    display: 'flex',
    gap: '1rem',
    padding: '1.5rem',
    borderTop: '1px solid var(--border-color)',
  },
  cancelButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 500,
    cursor: 'pointer',
  },
  confirmDeleteButton: {
    flex: 1,
    padding: '0.75rem',
    backgroundColor: 'var(--error-text)',
    color: 'var(--text-inverse)',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
  confirmDeleteButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export default DangerZone;