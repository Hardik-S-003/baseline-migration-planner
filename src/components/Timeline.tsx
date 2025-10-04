import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Feature } from '../types';

interface TimelineProps {
  features: Feature[];
  adoptionThreshold?: number;
  onThresholdChange?: (threshold: number) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip">
        <h4>{data.name}</h4>
        <p className="tooltip-category">{data.category}</p>
        <div className="tooltip-stats">
          <p>Support: {data.adoption}%</p>
          <p>Impact: {data.impact}</p>
          <p>Status: {data.status}</p>
        </div>
        <p className="tooltip-date">
          {new Date(data.date).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          })}
        </p>
      </div>
    );
  }
  return null;
};

const Timeline: React.FC<TimelineProps> = ({ 
  features, 
  adoptionThreshold = 95,
  onThresholdChange 
}) => {
  const timelineData = features.map(feature => ({
    name: feature.name,
    date: new Date(feature.adoptionDate).getTime(),
    adoption: feature.currentUsage,
    status: feature.baselineStatus,
    impact: feature.impact,
    category: feature.category
  })).sort((a, b) => a.date - b.date);

  const formatDate = (tickItem: any) => {
    return new Date(tickItem).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'widely': return '#22c55e';
      case 'newly': return '#f59e0b'; 
      case 'limited': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="timeline-container">
      <h3>🗓️ Feature Adoption Timeline</h3>
      <div className="threshold-slider">
        <label htmlFor="adoption-threshold">Safe Adoption Threshold: {adoptionThreshold}%</label>
        <input
          type="range"
          id="adoption-threshold"
          min="85"
          max="99"
          step="1"
          value={adoptionThreshold}
          onChange={(e) => onThresholdChange?.(Number(e.target.value))}
        />
      </div>
      <div style={{ width: '100%', height: '400px' }}>
        <ResponsiveContainer>
          <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date"
              type="number"
              scale="time"
              domain={['dataMin', 'dataMax']}
              tickFormatter={formatDate}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              label={{ value: 'Browser Support %', angle: -90, position: 'insideLeft' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={adoptionThreshold} stroke="#22c55e" strokeDasharray="5 5" label={`${adoptionThreshold}% Threshold`} />
            <Line 
              type="monotone" 
              dataKey="adoption" 
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 8, fill: '#3b82f6' }}
              activeDot={{ r: 10, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="timeline-note">
        📊 Green line shows 95% support threshold. Features above this line are safe to adopt.
      </p>
    </div>
  );
};

export default Timeline;
