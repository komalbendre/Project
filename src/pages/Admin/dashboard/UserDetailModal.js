import React from 'react';
import { Icons } from '../utils/icons';

const UserDetailModal = ({
    showModal,
    onClose,
    selectedUser,
    profileData,
    profileLoading,
    getUserStatusBadge,
    formatDate,
    formatDateTime,
    onSuspendUser,
    onActivateUser
}) => {
    if (!showModal) return null;

    return (
        <div style={{
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
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.3s ease',
        }}>
            <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '30px',
                width: '90%',
                maxWidth: '700px',
                maxHeight: '85vh',
                overflowY: 'auto',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                animation: 'slideUp 0.3s ease',
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '24px',
                }}>
                    <div>
                        <h3 style={{
                            margin: 0,
                            fontSize: '24px',
                            fontWeight: 600,
                            color: '#191919'
                        }}>
                            User Profile Details
                        </h3>
                        <p style={{
                            margin: '4px 0 0 0',
                            color: '#666',
                            fontSize: '14px'
                        }}>
                            {selectedUser && `${selectedUser.fname} ${selectedUser.lname}`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#666',
                            padding: '8px',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#f3f4f6';
                            e.target.style.color = '#191919';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'transparent';
                            e.target.style.color = '#666';
                        }}
                    >
                        ×
                    </button>
                </div>

                {profileLoading ? (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '60px 0',
                    }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            border: '4px solid #f3f4f6',
                            borderTopColor: '#0073b1',
                            borderRadius: '50%',
                            animation: 'spin 1s linear infinite',
                            marginBottom: '16px',
                        }}></div>
                        <p style={{ color: '#666', margin: 0 }}>Loading profile data...</p>
                    </div>
                ) : (
                    <div>
                        {/* Basic Info Section */}
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '8px',
                            padding: '20px',
                            marginBottom: '24px',
                        }}>
                            <h4 style={{
                                margin: '0 0 16px 0',
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#374151',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                            }}>
                                <span style={{ width: '20px', height: '20px' }}>
                                    {Icons.User ? <Icons.User /> : '👤'}
                                </span>
                                Basic Information
                            </h4>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                <div>
                                    <p style={{
                                        margin: '0 0 4px 0',
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        fontWeight: 500,
                                    }}>
                                        Full Name
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '14px',
                                        color: '#191919',
                                        fontWeight: 600,
                                    }}>
                                        {selectedUser ? `${selectedUser.fname} ${selectedUser.lname}` : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p style={{
                                        margin: '0 0 4px 0',
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        fontWeight: 500,
                                    }}>
                                        Email
                                    </p>
                                    <p style={{
                                        margin: 0,
                                        fontSize: '14px',
                                        color: '#191919',
                                    }}>
                                        {selectedUser ? selectedUser.email : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p style={{
                                        margin: '0 0 4px 0',
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        fontWeight: 500,
                                    }}>
                                        Role
                                    </p>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        background: '#f0f7ff',
                                        color: '#0073b1',
                                        border: '1px solid #0073b1',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                    }}>
                                        {selectedUser ? selectedUser.role?.charAt(0).toUpperCase() + selectedUser.role?.slice(1) : 'N/A'}
                                    </span>
                                </div>
                                <div>
                                    <p style={{
                                        margin: '0 0 4px 0',
                                        fontSize: '12px',
                                        color: '#6b7280',
                                        fontWeight: 500,
                                    }}>
                                        Status
                                    </p>
                                    {selectedUser && (
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            background: getUserStatusBadge(selectedUser).bg,
                                            color: getUserStatusBadge(selectedUser).color,
                                            borderRadius: '12px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                        }}>
                                            {getUserStatusBadge(selectedUser).text}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Profile Data Section */}
                        {profileData ? (
                            <>
                                {/* Contact Information */}
                                <div style={{
                                    marginBottom: '24px',
                                }}>
                                    <h4 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#374151',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                    }}>
                                        <span style={{ width: '20px', height: '20px' }}>
                                            {Icons.Email ? <Icons.Email /> : '✉️'}
                                        </span>
                                        Contact Information
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                        {profileData.phone && (
                                            <div>
                                                <p style={{
                                                    margin: '0 0 4px 0',
                                                    fontSize: '12px',
                                                    color: '#6b7280',
                                                    fontWeight: 500,
                                                }}>
                                                    Phone
                                                </p>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#191919' }}>
                                                    {profileData.phone}
                                                </p>
                                            </div>
                                        )}
                                        {profileData.location && (
                                            <div>
                                                <p style={{
                                                    margin: '0 0 4px 0',
                                                    fontSize: '12px',
                                                    color: '#6b7280',
                                                    fontWeight: 500,
                                                }}>
                                                    Location
                                                </p>
                                                <p style={{ margin: 0, fontSize: '14px', color: '#191919' }}>
                                                    {profileData.location}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bio */}
                                {profileData.bio && (
                                    <div style={{
                                        marginBottom: '24px',
                                    }}>
                                        <h4 style={{
                                            margin: '0 0 12px 0',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#374151',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}>
                                            <span style={{ width: '20px', height: '20px' }}>
                                                {Icons.FileText ? <Icons.FileText /> : '📝'}
                                            </span>
                                            Bio
                                        </h4>
                                        <div style={{
                                            background: '#f8fafc',
                                            borderRadius: '8px',
                                            padding: '16px',
                                            fontSize: '14px',
                                            color: '#4b5563',
                                            lineHeight: '1.6',
                                        }}>
                                            {profileData.bio}
                                        </div>
                                    </div>
                                )}

                                {/* Skills */}
                                {profileData.skills && profileData.skills.length > 0 && (
                                    <div style={{
                                        marginBottom: '24px',
                                    }}>
                                        <h4 style={{
                                            margin: '0 0 12px 0',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#374151',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}>
                                            <span style={{ width: '20px', height: '20px' }}>
                                                {Icons.Tag ? <Icons.Tag /> : '🏷️'}
                                            </span>
                                            Skills
                                        </h4>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px',
                                        }}>
                                            {profileData.skills.map((skill, index) => (
                                                <span key={index} style={{
                                                    padding: '6px 12px',
                                                    background: '#f0f7ff',
                                                    color: '#0073b1',
                                                    border: '1px solid #0073b1',
                                                    borderRadius: '16px',
                                                    fontSize: '12px',
                                                    fontWeight: 500,
                                                }}>
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Social Links */}
                                {(profileData.linkedin || profileData.github || profileData.portfolio) && (
                                    <div style={{
                                        marginBottom: '24px',
                                    }}>
                                        <h4 style={{
                                            margin: '0 0 12px 0',
                                            fontSize: '16px',
                                            fontWeight: 600,
                                            color: '#374151',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                        }}>
                                            <span style={{ width: '20px', height: '20px' }}>
                                                {Icons.Link ? <Icons.Link /> : '🔗'}
                                            </span>
                                            Social Links
                                        </h4>
                                        <div style={{ display: 'grid', gap: '12px' }}>
                                            {profileData.linkedin && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '24px', color: '#0077b5' }}>
                                                        {Icons.Linkedin ? <Icons.Linkedin /> : '💼'}
                                                    </div>
                                                    <a
                                                        href={profileData.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: '#0073b1',
                                                            textDecoration: 'none',
                                                            fontSize: '14px',
                                                        }}
                                                    >
                                                        {profileData.linkedin}
                                                    </a>
                                                </div>
                                            )}
                                            {profileData.github && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '24px', color: '#333' }}>
                                                        {Icons.GitHub ? <Icons.GitHub /> : '🐙'}
                                                    </div>
                                                    <a
                                                        href={profileData.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: '#0073b1',
                                                            textDecoration: 'none',
                                                            fontSize: '14px',
                                                        }}
                                                    >
                                                        {profileData.github}
                                                    </a>
                                                </div>
                                            )}
                                            {profileData.portfolio && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '24px', color: '#0073b1' }}>
                                                        {Icons.Globe ? <Icons.Globe /> : '🌐'}
                                                    </div>
                                                    <a
                                                        href={profileData.portfolio}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{
                                                            color: '#0073b1',
                                                            textDecoration: 'none',
                                                            fontSize: '14px',
                                                        }}
                                                    >
                                                        {profileData.portfolio}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Additional Information */}
                                <div style={{
                                    background: '#f8fafc',
                                    borderRadius: '8px',
                                    padding: '20px',
                                }}>
                                    <h4 style={{
                                        margin: '0 0 16px 0',
                                        fontSize: '16px',
                                        fontWeight: 600,
                                        color: '#374151',
                                    }}>
                                        Additional Information
                                    </h4>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                        <div>
                                            <p style={{
                                                margin: '0 0 4px 0',
                                                fontSize: '12px',
                                                color: '#6b7280',
                                                fontWeight: 500,
                                            }}>
                                                Account Created
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                color: '#191919',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}>
                                                <span style={{ width: '16px', height: '16px' }}>
                                                    {Icons.Calendar ? <Icons.Calendar /> : '📅'}
                                                </span>
                                                {selectedUser ? formatDate(selectedUser.createdAt) : 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p style={{
                                                margin: '0 0 4px 0',
                                                fontSize: '12px',
                                                color: '#6b7280',
                                                fontWeight: 500,
                                            }}>
                                                Last Login
                                            </p>
                                            <p style={{
                                                margin: 0,
                                                fontSize: '14px',
                                                color: '#191919',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                            }}>
                                                <span style={{ width: '16px', height: '16px' }}>
                                                    {Icons.Clock ? <Icons.Clock /> : '⏰'}
                                                </span>
                                                {selectedUser?.lastLogin ? formatDateTime(selectedUser.lastLogin) : 'Never'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : !profileLoading && (
                            <div style={{
                                padding: '40px 0',
                                textAlign: 'center',
                                color: '#9ca3af',
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    background: '#f3f4f6',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                }}>
                                    <span style={{ fontSize: '24px' }}>👤</span>
                                </div>
                                <p style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 500 }}>
                                    No Profile Found
                                </p>
                                <p style={{ margin: 0, fontSize: '14px' }}>
                                    This user hasn't created a profile yet.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                <div style={{
                    marginTop: '32px',
                    display: 'flex',
                    gap: '12px',
                    borderTop: '1px solid #f3f4f6',
                    paddingTop: '20px',
                }}>
                    <button
                        onClick={onClose}
                        style={{
                            padding: '12px 24px',
                            background: '#f3f4f6',
                            color: '#374151',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 500,
                            flex: 1,
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#e5e7eb';
                            e.target.style.borderColor = '#9ca3af';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = '#f3f4f6';
                            e.target.style.borderColor = '#d1d5db';
                        }}
                    >
                        Close
                    </button>
                    {selectedUser && (
                        <>
                            {selectedUser.isActive ? (
                                <button
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => onSuspendUser(selectedUser._id), 300);
                                    }}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#fee2e2',
                                        color: '#991b1b',
                                        border: '1px solid #fecaca',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        flex: 1,
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#fecaca';
                                        e.target.style.borderColor = '#fca5a5';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#fee2e2';
                                        e.target.style.borderColor = '#fecaca';
                                    }}
                                >
                                    <span style={{ marginRight: '8px' }}>⏸️</span>
                                    Suspend User
                                </button>
                            ) : (
                                <button
                                    onClick={() => {
                                        onClose();
                                        setTimeout(() => onActivateUser(selectedUser._id), 300);
                                    }}
                                    style={{
                                        padding: '12px 24px',
                                        background: '#d1fae5',
                                        color: '#065f46',
                                        border: '1px solid #a7f3d0',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        flex: 1,
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = '#a7f3d0';
                                        e.target.style.borderColor = '#6ee7b7';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = '#d1fae5';
                                        e.target.style.borderColor = '#a7f3d0';
                                    }}
                                >
                                    <span style={{ marginRight: '8px' }}>▶️</span>
                                    Activate User
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            {/* Add animation styles */}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default UserDetailModal;