import React from 'react';
import { Feature } from '../types';
import { Calendar, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  const getStatusIcon = () => {
    switch (feature.baselineStatus) {
      case 'widely': return <CheckCircle className="status-icon widely" />;
      case 'newly': return <TrendingUp className="status-icon newly" />;
      case 'limited': return <AlertCircle className="status-icon limited" />;
    }
  };

  const getStatusText = () => {
    switch (feature.baselineStatus) {
      case 'widely': return 'Widely Available';
      case 'newly': return 'Newly Available';
      case 'limited': return 'Limited Support';
    }
  };

  const getAdoptionRecommendation = () => {
    const today = new Date();
    const adoptionDate = new Date(feature.adoptionDate);
    const monthsToWait = Math.ceil((adoptionDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30));
    
    if (monthsToWait <= 0) return "✅ Safe to adopt now!";
    if (monthsToWait <= 6) return `⏳ Wait ${monthsToWait} month${monthsToWait === 1 ? '' : 's'}`;
    return `🔄 Wait ${Math.ceil(monthsToWait / 12)} year${monthsToWait <= 12 ? '' : 's'}`;
  };

  return (
    <div className={`feature-card ${feature.baselineStatus}`}>
      <div className="feature-header">
        <div className="feature-title">
          <h4>{feature.name}</h4>
          <span className="feature-category">{feature.category}</span>
        </div>
        {getStatusIcon()}
      </div>
      
      <p className="feature-description">{feature.description}</p>
      
      <div className="feature-metrics">
        <div className="metric">
          <Calendar size={16} />
          <span>Target: {new Date(feature.adoptionDate).toLocaleDateString()}</span>
        </div>
        <div className="metric">
          <TrendingUp size={16} />
          <span>Support: {feature.currentUsage}%</span>
        </div>
      </div>
      
      <div className="feature-status">
        <span className={`status-badge ${feature.baselineStatus}`}>
          {getStatusText()}
        </span>
        <span className="adoption-rec">
          {getAdoptionRecommendation()}
        </span>
      </div>
    </div>
  );
};

export default FeatureCard;
