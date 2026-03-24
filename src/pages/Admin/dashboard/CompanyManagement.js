import React, { useState } from 'react';
import { Icons } from '../utils/icons';
import { styles } from '../styles/adminDashboardStyles';

const CompanyManagement = ({ 
    companies, 
    filters, 
    setFilters, 
    fetchDashboardData, 
    navigate,
    getStatusBadge,
    getInitials,
    formatDate 
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Get pending companies for the right column
    const pendingCompanies = companies.filter(company => company.status === 'pending');
    
    // Filter companies for the left column (exclude pending companies)
    const nonPendingCompanies = companies.filter(company => company.status !== 'pending');
    
    // Apply additional filter to non-pending companies
    const filteredCompanies = nonPendingCompanies.filter(company => {
        if (filters.companyStatus === 'all') {
            return true; // Show all non-pending companies
        } else if (filters.companyStatus === 'approved') {
            return company.status === 'approved'; // Show only approved
        } else if (filters.companyStatus === 'rejected') {
            return company.status === 'rejected'; // Show only rejected
        }
        return true;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top of the companies list
        const companiesContainer = document.querySelector('.companies-list-container');
        if (companiesContainer) {
            companiesContainer.scrollTop = 0;
        }
    };

    // Custom styles for two-column layout
    const twoColumnStyles = {
        container: {
            display: 'grid',
            gridTemplateColumns: '60% 40%',
            gap: '24px',
            marginTop: '24px',
        },
        column: {
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
        },
        columnHeader: {
            padding: '20px',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        columnTitle: {
            fontSize: '18px',
            fontWeight: 600,
            color: '#191919',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
        },
        columnCount: {
            fontSize: '12px',
            color: '#666',
            fontWeight: 600,
            background: '#f8fafc',
            padding: '4px 12px',
            borderRadius: '12px',
        },
        columnContent: {
            maxHeight: '600px',
            overflowY: 'auto',
            flex: 1,
        },
        companyItem: {
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            transition: 'background-color 0.2s ease',
        },
        companyInfo: {
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            flex: 1,
        },
        companyAvatar: {
            width: '40px',
            height: '40px',
            borderRadius: '8px',
            background: '#0073b1',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 600,
            fontSize: '14px',
            flexShrink: 0,
        },
        companyDetails: {
            flex: 1,
        },
        companyName: {
            fontWeight: 600,
            fontSize: '14px',
            color: '#191919',
            marginBottom: '2px',
        },
        companyMeta: {
            fontSize: '12px',
            color: '#666',
            marginBottom: '4px',
        },
        companyContact: {
            fontSize: '12px',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            marginBottom: '4px',
        },
        viewButton: {
            padding: '6px 12px',
            fontSize: '11px',
            borderRadius: '4px',
            background: 'white',
            color: '#0073b1',
            border: '1px solid #0073b1',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
            alignSelf: 'flex-start',
            marginTop: '4px',
        },
        emptyColumn: {
            padding: '40px 20px',
            textAlign: 'center',
            color: '#94a3b8',
        },
        pagination: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 20px',
            borderTop: '1px solid #e0e0e0',
            background: 'white',
        },
        pageButton: {
            padding: '8px 12px',
            border: '1px solid #e0e0e0',
            background: 'white',
            color: '#666',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            minWidth: '36px',
            textAlign: 'center',
        },
        pageButtonActive: {
            background: '#0073b1',
            color: 'white',
            borderColor: '#0073b1',
        },
        pageButtonDisabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
        },
        pageInfo: {
            fontSize: '14px',
            color: '#666',
            margin: '0 12px',
        },
    };

    return (
        <div>
            {/* Header Container with Background */}
            <div style={{
                background: 'white',
                borderRadius: '8px',
                border: '1px solid #e0e0e0',
                marginBottom: '24px',
                overflow: 'hidden',
            }}>
                {/* Header Section - Matching UserManagement style */}
                <div style={styles.cardHeader}>
                    <h2 style={styles.cardTitle}>
                        <Icons.Building />
                        Company Management ({companies.length} total)
                    </h2>
                    <div style={styles.filterBar}>
                        <select
                            style={styles.filterSelect}
                            value={filters.companyStatus}
                            onChange={(e) => {
                                setFilters({ ...filters, companyStatus: e.target.value });
                                setCurrentPage(1); // Reset to first page when filter changes
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.borderColor = "#0073b1";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.borderColor = "#e0e0e0";
                            }}
                        >
                            <option value="all">All Companies</option>
                            <option value="approved">Approved Only</option>
                            <option value="rejected">Rejected Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Two Column Layout - Direct columns without extra container */}
            <div style={twoColumnStyles.container}>
                {/* Left Column - All Companies except pending with Filter */}
                <div style={twoColumnStyles.column}>
                    <div style={twoColumnStyles.columnHeader}>
                        <h3 style={twoColumnStyles.columnTitle}>
                            <Icons.Building />
                            {filters.companyStatus === 'all' ? 'All Companies' : 
                             filters.companyStatus === 'approved' ? 'Approved Companies' : 
                             'Rejected Companies'}
                        </h3>
                        <span style={twoColumnStyles.columnCount}>
                            {filteredCompanies.length} companies
                        </span>
                    </div>
                    
                    <div style={twoColumnStyles.columnContent} className="companies-list-container">
                        {currentCompanies.length === 0 ? (
                            <div style={twoColumnStyles.emptyColumn}>
                                <Icons.Building />
                                <p>No companies found with the selected filter</p>
                            </div>
                        ) : (
                            currentCompanies.map((company) => {
                                const user = company.userId;
                                const statusBadge = getStatusBadge(company.status);

                                return (
                                    <div
                                        key={company._id}
                                        style={twoColumnStyles.companyItem}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <div style={twoColumnStyles.companyInfo}>
                                            <div style={{
                                                ...twoColumnStyles.companyAvatar,
                                                background: company.status === 'approved' ? '#10b981' :
                                                           company.status === 'rejected' ? '#ef4444' : '#0073b1',
                                            }}>
                                                {getInitials(company.companyName)}
                                            </div>
                                            <div style={twoColumnStyles.companyDetails}>
                                                <div style={twoColumnStyles.companyName}>
                                                    {company.companyName}
                                                </div>
                                                <div style={twoColumnStyles.companyMeta}>
                                                    {company.industry} • {formatDate(company.createdAt)}
                                                </div>
                                                <div style={twoColumnStyles.companyContact}>
                                                    <Icons.Email />
                                                    {user?.email || "N/A"}
                                                </div>
                                                <div style={twoColumnStyles.companyContact}>
                                                    <Icons.Phone />
                                                    {company.phoneNo}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                                    <span style={{
                                                        ...styles.customBadge,
                                                        background: statusBadge.bg,
                                                        color: statusBadge.color,
                                                        fontSize: '11px',
                                                        padding: '2px 8px',
                                                    }}>
                                                        {statusBadge.text}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            style={twoColumnStyles.viewButton}
                                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "#0073b1";
                                                e.target.style.color = "white";
                                                e.target.style.transform = "translateY(-1px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "white";
                                                e.target.style.color = "#0073b1";
                                                e.target.style.transform = "translateY(0)";
                                            }}
                                        >
                                            <Icons.Eye />
                                            View
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Pagination */}
                    {filteredCompanies.length > itemsPerPage && (
                        <div style={twoColumnStyles.pagination}>
                            <button
                                style={{
                                    ...twoColumnStyles.pageButton,
                                    ...(currentPage === 1 && twoColumnStyles.pageButtonDisabled)
                                }}
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                onMouseEnter={(e) => {
                                    if (currentPage !== 1) {
                                        e.target.style.background = "#f0f7ff";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "white";
                                }}
                            >
                                <Icons.ArrowLeft />
                            </button>
                            
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                // Show first page, last page, current page, and pages around current
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            style={{
                                                ...twoColumnStyles.pageButton,
                                                ...(currentPage === pageNumber && twoColumnStyles.pageButtonActive)
                                            }}
                                            onClick={() => handlePageChange(pageNumber)}
                                            onMouseEnter={(e) => {
                                                if (currentPage !== pageNumber) {
                                                    e.target.style.background = "#f0f7ff";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (currentPage !== pageNumber) {
                                                    e.target.style.background = "white";
                                                }
                                            }}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                } else if (
                                    (pageNumber === 2 && currentPage > 3) ||
                                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                                ) {
                                    return <span key={pageNumber} style={twoColumnStyles.pageInfo}>...</span>;
                                }
                                return null;
                            })}
                            
                            <button
                                style={{
                                    ...twoColumnStyles.pageButton,
                                    ...(currentPage === totalPages && twoColumnStyles.pageButtonDisabled)
                                }}
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                onMouseEnter={(e) => {
                                    if (currentPage !== totalPages) {
                                        e.target.style.background = "#f0f7ff";
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.background = "white";
                                }}
                            >
                                <Icons.ArrowRight />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Column - Pending Approvals */}
                <div style={twoColumnStyles.column}>
                    <div style={twoColumnStyles.columnHeader}>
                        <h3 style={twoColumnStyles.columnTitle}>
                            <Icons.Clock />
                            Pending Approvals
                        </h3>
                        <span style={{
                            ...twoColumnStyles.columnCount,
                            background: '#fef3c7',
                            color: '#f59e0b',
                        }}>
                            {pendingCompanies.length} pending
                        </span>
                    </div>
                    
                    <div style={twoColumnStyles.columnContent}>
                        {pendingCompanies.length === 0 ? (
                            <div style={twoColumnStyles.emptyColumn}>
                                <Icons.CheckCircle />
                                <p>No pending approvals</p>
                            </div>
                        ) : (
                            pendingCompanies.map((company) => {
                                const user = company.userId;
                                const statusBadge = getStatusBadge(company.status);

                                return (
                                    <div
                                        key={company._id}
                                        style={twoColumnStyles.companyItem}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8fafc"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                                    >
                                        <div style={twoColumnStyles.companyInfo}>
                                            <div style={{
                                                ...twoColumnStyles.companyAvatar,
                                                background: '#f59e0b',
                                            }}>
                                                {getInitials(company.companyName)}
                                            </div>
                                            <div style={twoColumnStyles.companyDetails}>
                                                <div style={twoColumnStyles.companyName}>
                                                    {company.companyName}
                                                </div>
                                                <div style={twoColumnStyles.companyMeta}>
                                                    {company.industry} • {formatDate(company.createdAt)}
                                                </div>
                                                <div style={twoColumnStyles.companyContact}>
                                                    <Icons.Email />
                                                    {user?.email || "N/A"}
                                                </div>
                                                <div style={twoColumnStyles.companyContact}>
                                                    <Icons.Phone />
                                                    {company.phoneNo}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                                                    <span style={{
                                                        ...styles.customBadge,
                                                        background: statusBadge.bg,
                                                        color: statusBadge.color,
                                                        fontSize: '11px',
                                                        padding: '2px 8px',
                                                    }}>
                                                        {statusBadge.text}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            style={twoColumnStyles.viewButton}
                                            onClick={() => navigate(`/admin/companies/${company._id}`)}
                                            onMouseEnter={(e) => {
                                                e.target.style.background = "#0073b1";
                                                e.target.style.color = "white";
                                                e.target.style.transform = "translateY(-1px)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.background = "white";
                                                e.target.style.color = "#0073b1";
                                                e.target.style.transform = "translateY(0)";
                                            }}
                                        >
                                            <Icons.Eye />
                                            View
                                        </button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanyManagement;