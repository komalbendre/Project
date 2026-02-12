import React, { useState, useEffect } from "react";
import axios from "axios";

// SVG Icons Component
const Icons = {
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Calendar: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  Clock: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  Video: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 7l-7 5 7 5V7z" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  ),
  Phone: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  Location: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  User: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  Email: () => (  // Added missing Email icon
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  Link: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  Info: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  Building: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5m-4 0h4" />
    </svg>
  ),
  Send: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  ),
};

const InterviewScheduleModal = ({ isOpen, onClose, application, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    type: 'video',
    duration: '60',
    meetingLink: '',
    location: '',
    interviewer: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Reset form when modal opens with new application
  useEffect(() => {
    if (isOpen && application) {
      // Set default date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultDate = tomorrow.toISOString().split('T')[0];
      const defaultTime = '10:00';
      
      setFormData({
        date: defaultDate,
        time: defaultTime,
        type: 'video',
        duration: '60',
        meetingLink: '',
        location: '',
        interviewer: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen, application]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.type) {
      newErrors.type = 'Interview type is required';
    }

    if (!formData.duration) {
      newErrors.duration = 'Duration is required';
    }

    if (formData.type === 'video' && !formData.meetingLink) {
      newErrors.meetingLink = 'Meeting link is required for video interviews';
    } else if (formData.meetingLink && !formData.meetingLink.match(/^https?:\/\/.+/)) {
      newErrors.meetingLink = 'Please enter a valid URL (include http:// or https://)';
    }

    if (formData.type === 'phone' && !formData.location) {
      newErrors.location = 'Phone number or dial-in details are required';
    }

    if (formData.type === 'onsite' && !formData.location) {
      newErrors.location = 'Location is required for onsite interviews';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      const interviewData = {
        date: dateTime.toISOString(),
        type: formData.type,
        duration: parseInt(formData.duration),
        meetingLink: formData.meetingLink || undefined,
        location: formData.location || undefined,
        interviewer: formData.interviewer || undefined
      };

      const response = await axios.post(
        `http://localhost:5000/api/applications/${application._id}/interview`,
        interviewData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        onSuccess?.(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error("Error scheduling interview:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to schedule interview. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !application) return null;

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  // Generate time options (9 AM to 6 PM, 30 min intervals)
  const timeOptions = [];
  for (let hour = 9; hour <= 18; hour++) {
    for (let minute of ['00', '30']) {
      if (hour === 18 && minute === '30') continue;
      const timeString = `${hour.toString().padStart(2, '0')}:${minute}`;
      timeOptions.push(timeString);
    }
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h2 style={styles.title}>Schedule Interview</h2>
            <p style={styles.subtitle}>
              Schedule an interview with {application.fullName} for {application.internship?.title}
            </p>
          </div>
          <button onClick={onClose} style={styles.closeButton}>
            <Icons.Close />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Candidate Info Summary */}
          <div style={styles.candidateSummary}>
            <div style={styles.candidateAvatar}>
              {application.fullName?.charAt(0) || 'C'}
            </div>
            <div style={styles.candidateInfo}>
              <h4 style={styles.candidateName}>{application.fullName}</h4>
              <p style={styles.candidatePosition}>{application.internship?.title}</p>
              <div style={styles.candidateMeta}>
                <span style={styles.candidateMetaItem}>
                  <Icons.Building />
                  {application.company?.companyName || application.internship?.companyName}
                </span>
                {application.email && (
                  <span style={styles.candidateMetaItem}>
                    <Icons.Email />
                    {application.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Error Summary */}
          {errors.submit && (
            <div style={styles.errorSummary}>
              <Icons.Info />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Form Grid */}
          <div style={styles.formGrid}>
            {/* Date */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Icons.Calendar />
                Date <span style={styles.required}>*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={today}
                style={{
                  ...styles.input,
                  ...(errors.date && styles.inputError)
                }}
              />
              {errors.date && <span style={styles.errorText}>{errors.date}</span>}
            </div>

            {/* Time */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Icons.Clock />
                Time <span style={styles.required}>*</span>
              </label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                style={{
                  ...styles.select,
                  ...(errors.time && styles.inputError)
                }}
              >
                {timeOptions.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
              {errors.time && <span style={styles.errorText}>{errors.time}</span>}
            </div>

            {/* Interview Type */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>
                Interview Type <span style={styles.required}>*</span>
              </label>
              <div style={styles.typeOptions}>
                {[
                  { value: 'video', label: 'Video Call', icon: <Icons.Video /> },
                  { value: 'phone', label: 'Phone Call', icon: <Icons.Phone /> },
                  { value: 'onsite', label: 'Onsite', icon: <Icons.Location /> },
                  { value: 'technical', label: 'Technical', icon: <Icons.Link /> },
                  { value: 'hr', label: 'HR', icon: <Icons.User /> }
                ].map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'type', value: option.value } })}
                    style={{
                      ...styles.typeButton,
                      ...(formData.type === option.value && styles.typeButtonActive)
                    }}
                  >
                    <span style={styles.typeIcon}>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
              {errors.type && <span style={styles.errorText}>{errors.type}</span>}
            </div>

            {/* Duration */}
            <div style={styles.formGroup}>
              <label style={styles.label}>
                <Icons.Clock />
                Duration (minutes) <span style={styles.required}>*</span>
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                style={{
                  ...styles.select,
                  ...(errors.duration && styles.inputError)
                }}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
              {errors.duration && <span style={styles.errorText}>{errors.duration}</span>}
            </div>

            {/* Meeting Link (for video/technical) */}
            {(formData.type === 'video' || formData.type === 'technical') && (
              <div style={styles.formGroupFull}>
                <label style={styles.label}>
                  <Icons.Link />
                  Meeting Link <span style={styles.required}>*</span>
                </label>
                <input
                  type="url"
                  name="meetingLink"
                  value={formData.meetingLink}
                  onChange={handleChange}
                  placeholder="https://meet.google.com/xxx or https://zoom.us/j/xxx"
                  style={{
                    ...styles.input,
                    ...(errors.meetingLink && styles.inputError)
                  }}
                />
                {errors.meetingLink && <span style={styles.errorText}>{errors.meetingLink}</span>}
                <span style={styles.helperText}>
                  <Icons.Info />
                  Provide Google Meet, Zoom, or Microsoft Teams link
                </span>
              </div>
            )}

            {/* Location (for phone/onsite) */}
            {(formData.type === 'phone' || formData.type === 'onsite') && (
              <div style={styles.formGroupFull}>
                <label style={styles.label}>
                  {formData.type === 'phone' ? <Icons.Phone /> : <Icons.Location />}
                  {formData.type === 'phone' ? 'Phone Number / Dial-in' : 'Location'} <span style={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder={formData.type === 'phone' 
                    ? '+1 (555) 123-4567 or conference bridge' 
                    : '123 Main St, City, State'}
                  style={{
                    ...styles.input,
                    ...(errors.location && styles.inputError)
                  }}
                />
                {errors.location && <span style={styles.errorText}>{errors.location}</span>}
              </div>
            )}

            {/* Interviewer */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>
                <Icons.User />
                Interviewer Name
              </label>
              <input
                type="text"
                name="interviewer"
                value={formData.interviewer}
                onChange={handleChange}
                placeholder="e.g., John Doe, Hiring Manager"
                style={styles.input}
              />
            </div>

            {/* Notes */}
            <div style={styles.formGroupFull}>
              <label style={styles.label}>
                <Icons.Info />
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional instructions or notes for the candidate..."
                style={styles.textarea}
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div style={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                ...styles.submitButton,
                ...(loading && styles.submitButtonDisabled)
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div style={styles.submitSpinner} />
                  Scheduling Interview...
                </>
              ) : (
                <>
                  <Icons.Send />
                  Schedule Interview
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
    animation: 'fadeIn 0.2s ease-out',
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '800px',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    animation: 'slideUp 0.3s ease-out',
  },
  header: {
    padding: '24px 28px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px 16px 0 0',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '4px',
    fontFamily: "'Inter', sans-serif",
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: 0,
  },
  closeButton: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    border: 'none',
    background: 'white',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    transition: 'all 0.2s',
    ':hover': {
      background: '#f1f5f9',
      color: '#0f172a',
    }
  },
  form: {
    padding: '28px',
    overflowY: 'auto',
  },
  candidateSummary: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    background: '#f8fafc',
    borderRadius: '12px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0',
  },
  candidateAvatar: {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 600,
  },
  candidateInfo: {
    flex: 1,
  },
  candidateName: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#0f172a',
    marginBottom: '4px',
  },
  candidatePosition: {
    fontSize: '14px',
    color: '#3b82f6',
    fontWeight: 500,
    marginBottom: '8px',
  },
  candidateMeta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  candidateMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#64748b',
  },
  errorSummary: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '12px 16px',
    borderRadius: '8px',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  formGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#374151',
  },
  required: {
    color: '#ef4444',
    marginLeft: '2px',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    transition: 'all 0.2s',
    ':focus': {
      outline: 'none',
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
    }
  },
  select: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    background: 'white',
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px',
  },
  textarea: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '2px',
  },
  helperText: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    color: '#6b7280',
    marginTop: '4px',
  },
  typeOptions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '8px',
  },
  typeButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    padding: '12px 8px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: 'white',
    color: '#64748b',
    fontSize: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  typeButtonActive: {
    borderColor: '#3b82f6',
    background: '#eff6ff',
    color: '#3b82f6',
  },
  typeIcon: {
    fontSize: '18px',
  },
  formActions: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '12px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  cancelButton: {
    padding: '10px 20px',
    background: 'white',
    color: '#4b5563',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 24px',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  submitSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
};

// Add global animations
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}

export default InterviewScheduleModal;