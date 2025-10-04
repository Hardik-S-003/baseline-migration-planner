import React, { useState, useEffect } from 'react';
import Timeline from './components/Timeline';
import FeatureCard from './components/FeatureCard';
import { mockProject } from './data/mockData';
import { getAllFeatures } from './utils/bcdTransform';
import { ProjectAnalysis, Feature } from './types';
import ErrorBoundary from './components/ErrorBoundary';
import { LoadingState } from './components/LoadingState';
import { BarChart3, Calendar, Zap } from 'lucide-react';
import './styles/components.css';
import ProjectAnalyzer from './components/ProjectAnalyzer';

// Constants
const INITIAL_ADOPTION_THRESHOLD = 95;

function App() {
  const [currentProject, setCurrentProject] = useState<ProjectAnalysis>(mockProject);
  const [activeTab, setActiveTab] = useState<'timeline' | 'features'>('timeline');
  const [adoptionThreshold, setAdoptionThreshold] = useState(95);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        console.log('Starting to load features...');
        setLoading(true);
        setError(null);
        
        // Use setTimeout to prevent UI freeze
        await new Promise(resolve => setTimeout(resolve, 0));
        const bcdFeatures = await getAllFeatures();
        console.log('Loaded BCD features:', bcdFeatures.length);
        
        if (bcdFeatures.length === 0) {
          throw new Error('No features were loaded from BCD data');
        }
        
        setFeatures(bcdFeatures);
        
        // Update the project with real BCD data
        setCurrentProject(prev => ({
          ...prev,
          currentFeatures: bcdFeatures.filter((f: Feature) => f.baselineStatus === 'widely'),
          recommendedFeatures: bcdFeatures.filter((f: Feature) => f.baselineStatus !== 'widely')
        }));
      } catch (error) {
        console.error('Error loading BCD features:', error);
        setError(error instanceof Error ? error.message : 'Failed to load features');
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, []);

  const allFeatures = [
    ...currentProject.currentFeatures,
    ...currentProject.recommendedFeatures
  ];

  if (error) {
    return (
      <div className="app">
        <div className="error-message">
          <h2>Error Loading Features</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading-message">
          <h2>Loading Features...</h2>
          <p>Please wait while we analyze browser compatibility data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <BarChart3 size={32} />
            <h1>Baseline Migration Planner</h1>
          </div>
          <p className="subtitle">
            Plan your web feature adoption timeline based on real browser support data
          </p>
        </div>
      </header>

      <main className="main-content">
        <section className="project-overview">
          <h2>📊 Project: {currentProject.projectName}</h2>
          <div className="overview-stats">
            <div className="stat-card">
              <Zap className="stat-icon" />
              <div>
                <h3>{currentProject.currentFeatures.length}</h3>
                <p>Current Features</p>
              </div>
            </div>
            <div className="stat-card">
              <Calendar className="stat-icon" />
              <div>
                <h3>{currentProject.recommendedFeatures.length}</h3>
                <p>Upcoming Features</p>
              </div>
            </div>
            <div className="stat-card">
              <BarChart3 className="stat-icon" />
              <div>
                <h3>{Math.round(currentProject.userBaseProfile.chrome)}%</h3>
                <p>Chrome Users</p>
              </div>
            </div>
          </div>
        </section>

        <nav className="tab-navigation">
          <button 
            className={activeTab === 'timeline' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('timeline')}
          >
            📈 Timeline View
          </button>
          <button 
            className={activeTab === 'features' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('features')}
          >
            🔧 Feature Details
          </button>
        </nav>

        {activeTab === 'timeline' && (
          <section className="timeline-section">
            <Timeline 
              features={allFeatures}
              adoptionThreshold={adoptionThreshold}
              onThresholdChange={setAdoptionThreshold}
            />
          </section>
        )}

        {activeTab === 'features' && (
          <section className="features-section">
            <h3>🚀 Feature Recommendations</h3>
            <div className="features-grid">
              {allFeatures.map(feature => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </section>
        )}
      </main>

      <section className="analyzer-section">
        <ProjectAnalyzer onAnalysisComplete={setCurrentProject} />
      </section>
    </div>
  );
}
function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
export default AppWrapper;
