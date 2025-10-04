import { Feature, ProjectAnalysis } from '../types';

export const sampleFeatures: Feature[] = [
  {
    id: 'css-grid',
    name: 'CSS Grid',
    category: 'CSS Layout',
    baselineStatus: 'widely',
    adoptionDate: '2024-01-15',
    currentUsage: 95,
    impact: 'high',
    description: 'Two-dimensional grid-based layout system'
  },
  {
    id: 'container-queries',
    name: 'Container Queries',
    category: 'CSS Layout', 
    baselineStatus: 'newly',
    adoptionDate: '2025-06-01',
    currentUsage: 78,
    impact: 'medium',
    description: 'Style elements based on container size'
  },
  {
    id: 'css-cascade-layers',
    name: 'CSS Cascade Layers',
    category: 'CSS Architecture',
    baselineStatus: 'limited',
    adoptionDate: '2026-03-15',
    currentUsage: 45,
    impact: 'medium',
    description: 'Control specificity with @layer'
  },
  {
    id: 'top-level-await',
    name: 'Top-level await',
    category: 'JavaScript ES2022',
    baselineStatus: 'widely',
    adoptionDate: '2024-08-01',
    currentUsage: 88,
    impact: 'high',
    description: 'Use await outside async functions'
  },
  {
    id: 'import-maps',
    name: 'Import Maps',
    category: 'JavaScript Modules',
    baselineStatus: 'newly',
    adoptionDate: '2025-09-01',
    currentUsage: 72,
    impact: 'high',
    description: 'Control module specifier resolution'
  }
];

export const mockProject: ProjectAnalysis = {
  projectName: "E-commerce Dashboard",
  currentFeatures: sampleFeatures.filter(f => f.baselineStatus === 'widely'),
  recommendedFeatures: sampleFeatures.filter(f => f.baselineStatus !== 'widely'),
  userBaseProfile: {
    safari: 25,
    chrome: 45,
    firefox: 20,
    edge: 10
  }
};
