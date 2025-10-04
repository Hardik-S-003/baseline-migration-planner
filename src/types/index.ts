export type BrowserType = 'chrome' | 'firefox' | 'safari' | 'edge';

export interface BrowserSupport {
  version_added: string | boolean | null;
  version_removed?: string;
  flags?: {
    type: string;
    name: string;
    value_to_set: string;
  }[];
}

export type FeatureBrowserData = {
  [K in BrowserType]: BrowserSupport;
};

export interface Feature {
  id: string;
  name: string;
  category: string;
  baselineStatus: 'limited' | 'newly' | 'widely';
  adoptionDate: string;
  currentUsage: number;
  impact: 'low' | 'medium' | 'high';
  description: string;
  mdn_path?: string; // Path to feature in MDN BCD
  browser_support?: FeatureBrowserData;
}

export interface ProjectAnalysis {
  projectName: string;
  currentFeatures: Feature[];
  recommendedFeatures: Feature[];
  userBaseProfile: {
    safari: number;
    chrome: number;
    firefox: number;
    edge: number;
  };
}
