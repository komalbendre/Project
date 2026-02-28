import React from 'react';
import { Icons } from '../utils/icons';
import { styles } from '../styles/adminDashboardStyles';

const UserManagement = ({ 
    filteredUsers, 
    filters, 
    setFilters, 
    fetchDashboardData, 
    handleViewUser,
    getUserStatusBadge, 
    getInitials, 
    formatDate 
}) => {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                    <Icons.Users />
                    User Management ({filteredUsers.length})
                </h2>
                <div style={styles.filterBar}>
                    <select
                        style={styles.filterSelect}
                        value={filters.userStatus}
                        onChange={(e) => setFilters({ ...filters, userStatus: e.target.value })}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = "#0073b1";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = "#e0e0e0";
                        }}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="suspended">Suspended</option>
                        <option value="pending">Pending</option>
                    </select>
                    <select
                        style={styles.filterSelect}
                        value={filters.userRole}
                        onChange={(e) => setFilters({ ...filters, userRole: e.target.value })}
                        onMouseEnter={(e) => {
                            e.target.style.borderColor = "#0073b1";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.borderColor = "#e0e0e0";
                        }}
                    >
                        <option value="all">All Roles</option>
                        <option value="user">User</option>
                        <option value="company_admin">Company Admin</option>
                        {/* Removed admin option */}
                    </select>
                    <button
                        style={styles.refreshButton}
                        onClick={fetchDashboardData}
                        onMouseEnter={(e) => {
                            e.target.style.background = "#006097";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = "#0073b1";
                        }}
                    >
                        <Icons.Refresh />
                        Refresh
                    </button>
                </div>
            </div>

            {filteredUsers.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                        <Icons.Users />
                    </div>
                    <p style={styles.emptyText}>No users found with the selected filters</p>
                </div>
            ) : (
                <div style={{ overflowX: "auto" }}>
                    <table style={styles.table}>
                        <thead style={styles.tableHeader}>
                            <tr>
                                <th style={styles.th}>User</th>
                                <th style={styles.th}>Role</th>
                                <th style={styles.th}>Status</th>
                                <th style={styles.th}>Joined</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const statusBadge = getUserStatusBadge(user);
                                
                                // Format role display text
                                let displayRole = "User";
                                if (user.role === 'company_admin') {
                                    displayRole = "Company Admin";
                                } else if (user.role === 'user') {
                                    displayRole = "User";
                                }

                                return (
                                    <tr
                                        key={user._id}
                                        className="table-row"
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <td style={styles.td}>
                                            <div style={styles.userInfo}>
                                                <div style={styles.userAvatarSmall}>
                                                    {getInitials(`${user.fname} ${user.lname}`)}
                                                </div>
                                                <div>
                                                    <div style={styles.userName}>
                                                        {user.fname} {user.lname}
                                                    </div>
                                                    <div style={styles.userEmail}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                            <Icons.Email />
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.customBadge,
                                                background: "#f0f7ff",
                                                color: "#0073b1",
                                                border: "1px solid #0073b1",
                                            }}>
                                                {displayRole}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.customBadge,
                                                background: statusBadge.bg,
                                                color: statusBadge.color,
                                            }}>
                                                {statusBadge.text}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                                <Icons.Calendar />
                                                {formatDate(user.createdAt)}
                                            </div>
                                        </td>
                                        <td style={styles.td}>
                                            <div style={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                gap: "8px",
                                                flexWrap: "nowrap"
                                            }}>
                                                <button
                                                    style={styles.viewButton}
                                                    onClick={() => handleViewUser(user._id)}
                                                    className="action-hover"
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = "translateY(-2px)";
                                                        e.target.style.boxShadow = "0 4px 12px rgba(0, 115, 177, 0.2)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = "translateY(0)";
                                                        e.target.style.boxShadow = "none";
                                                    }}
                                                    title="View User Details"
                                                >
                                                    <Icons.Eye />
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserManagement;