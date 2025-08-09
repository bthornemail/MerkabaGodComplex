import React from 'react';

const FranchiseInfo = ({ franchiseData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'buildout': return '#fca11a';
      case 'operational': return '#35a745';
      case 'planning': return '#6f42c1';
      case 'leased': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  // Default franchise data structure for CUE integration
  const defaultData = {
    id: 'cue-franchise-001',
    franchiseName: 'CUE Smart Franchise Dashboard',
    status: 'Operational',
    franchisee: {
      name: 'CUE Network User',
      email: 'user@cue-network.com',
      phone: '555-CUE-DASH',
      liquidCapital: 200000,
      netWorth: 750000
    },
    location: {
      address: {
        street: 'CUE Network Hub',
        city: 'Distributed',
        state: 'Network',
        zip: '00000'
      },
      squareFootage: 4500,
      siteType: 'Digital',
      status: 'Active'
    },
    financials: {
      franchiseFee: 50000,
      estimatedBuildOutCost: 350000,
      workingCapital: 75000,
      equipmentCost: 100000,
      initialSupplyCost: 10860,
      totalEstimatedCost: 585860
    },
    timeline: {
      applicationDate: new Date().toISOString(),
      siteApprovalDate: new Date().toISOString(),
      leaseSignedDate: new Date().toISOString(),
      constructionStartDate: new Date().toISOString()
    }
  };

  const data = franchiseData || defaultData;

  return (
    <div className="franchise-info">
      <div className="franchise-header">
        <h2>{data.franchiseName}</h2>
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(data.status) }}
        >
          {data.status}
        </span>
      </div>

      <div className="info-grid">
        {/* Franchisee Information */}
        <div className="card">
          <h3>Franchisee</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Name:</span>
              <span className="value">{data.franchisee?.name}</span>
            </div>
            <div className="info-item">
              <span className="label">Email:</span>
              <span className="value">{data.franchisee?.email}</span>
            </div>
            <div className="info-item">
              <span className="label">Phone:</span>
              <span className="value">{data.franchisee?.phone}</span>
            </div>
            <div className="info-item">
              <span className="label">Liquid Capital:</span>
              <span className="value">{formatCurrency(data.franchisee?.liquidCapital || 0)}</span>
            </div>
            <div className="info-item">
              <span className="label">Net Worth:</span>
              <span className="value">{formatCurrency(data.franchisee?.netWorth || 0)}</span>
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="card">
          <h3>Location</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Address:</span>
              <span className="value">
                {data.location?.address?.street}<br />
                {data.location?.address?.city}, {data.location?.address?.state} {data.location?.address?.zip}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Square Footage:</span>
              <span className="value">{data.location?.squareFootage?.toLocaleString()} sq ft</span>
            </div>
            <div className="info-item">
              <span className="label">Site Type:</span>
              <span className="value">{data.location?.siteType}</span>
            </div>
            <div className="info-item">
              <span className="label">Status:</span>
              <span 
                className="value status-indicator"
                style={{ color: getStatusColor(data.location?.status) }}
              >
                {data.location?.status}
              </span>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="card">
          <h3>Financials</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Franchise Fee:</span>
              <span className="value">{formatCurrency(data.financials?.franchiseFee || 0)}</span>
            </div>
            <div className="info-item">
              <span className="label">Build-Out Cost:</span>
              <span className="value">{formatCurrency(data.financials?.estimatedBuildOutCost || 0)}</span>
            </div>
            <div className="info-item">
              <span className="label">Equipment Cost:</span>
              <span className="value">{formatCurrency(data.financials?.equipmentCost || 0)}</span>
            </div>
            <div className="info-item">
              <span className="label">Working Capital:</span>
              <span className="value">{formatCurrency(data.financials?.workingCapital || 0)}</span>
            </div>
            <div className="info-item total-cost">
              <span className="label">Total Estimated Cost:</span>
              <span className="value">{formatCurrency(data.financials?.totalEstimatedCost || 0)}</span>
            </div>
          </div>
        </div>

        {/* Timeline Information */}
        <div className="card">
          <h3>Timeline</h3>
          <div className="info-list">
            <div className="info-item">
              <span className="label">Application Date:</span>
              <span className="value">{formatDate(data.timeline?.applicationDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Site Approval:</span>
              <span className="value">{formatDate(data.timeline?.siteApprovalDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Lease Signed:</span>
              <span className="value">{formatDate(data.timeline?.leaseSignedDate)}</span>
            </div>
            <div className="info-item">
              <span className="label">Construction Start:</span>
              <span className="value">{formatDate(data.timeline?.constructionStartDate)}</span>
            </div>
          </div>
        </div>

        {/* CUE-specific Information */}
        {data.tokens && (
          <div className="card">
            <h3>CUE Tokens</h3>
            <div className="info-list">
              {data.tokens.map((token, index) => (
                <div key={index} className="info-item">
                  <span className="label">{token.metadata?.name}:</span>
                  <span className="value">{token.metadata?.amount || 'N/A'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {data.analytics && (
          <div className="card">
            <h3>Analytics Jobs</h3>
            <div className="info-list">
              {data.analytics.slice(-5).map((job, index) => (
                <div key={index} className="info-item">
                  <span className="label">{job.jobId}:</span>
                  <span className="value">{job.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FranchiseInfo;