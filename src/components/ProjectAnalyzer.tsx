import React, { useState } from 'react';
import { Feature, ProjectAnalysis } from '../types';
import { Upload, Loader, CheckCircle, AlertCircle } from 'lucide-react';

interface ProjectAnalyzerProps {
  onAnalysisComplete: (project: ProjectAnalysis) => void;
}

interface AnalysisStep {
  label: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
}

const ProjectAnalyzer: React.FC<ProjectAnalyzerProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);

  const analysisSteps: AnalysisStep[] = [
    { label: 'Scanning project structure', status: 'pending' },
    { label: 'Analyzing dependencies', status: 'pending' },
    { label: 'Detecting feature usage', status: 'pending' },
    { label: 'Generating recommendations', status: 'pending' }
  ];

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate each step with a delay
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      analysisSteps[i].status = 'in-progress';
      await new Promise(resolve => setTimeout(resolve, 1500));
      analysisSteps[i].status = 'completed';
    }

    // Mock analysis complete
    setTimeout(() => {
      setIsAnalyzing(false);
      onAnalysisComplete({
        projectName: file?.name.replace(/\.[^/.]+$/, '') || 'Unnamed Project',
        currentFeatures: [], // This would be populated with real detected features
        recommendedFeatures: [], // This would be populated with real recommendations
        userBaseProfile: {
          chrome: 45,
          firefox: 20,
          safari: 25,
          edge: 10
        }
      });
    }, 1000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const getStepIcon = (status: AnalysisStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="step-icon completed" />;
      case 'in-progress':
        return <Loader className="step-icon loading" />;
      case 'error':
        return <AlertCircle className="step-icon error" />;
      default:
        return <div className="step-icon pending" />;
    }
  };

  return (
    <div className="project-analyzer">
      {!isAnalyzing ? (
        <div className="upload-container">
          <input
            type="file"
            id="project-upload"
            onChange={handleFileChange}
            accept=".zip,.tar.gz"
            className="hidden-input"
          />
          <label htmlFor="project-upload" className="upload-label">
            <Upload size={24} />
            <span>Choose project file or drag & drop</span>
            <span className="file-note">.zip or .tar.gz</span>
          </label>
          {file && (
            <div className="selected-file">
              <span>{file.name}</span>
              <button 
                className="analyze-btn"
                onClick={simulateAnalysis}
              >
                Start Analysis
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="analysis-progress">
          <h3>Analyzing Project</h3>
          <div className="steps-container">
            {analysisSteps.map((step, index) => (
              <div 
                key={index}
                className={`analysis-step ${step.status}`}
              >
                {getStepIcon(step.status)}
                <span>{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectAnalyzer;
