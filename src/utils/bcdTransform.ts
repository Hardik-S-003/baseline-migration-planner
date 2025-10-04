import { default as bcd } from '@mdn/browser-compat-data';
import { Feature, BrowserSupport, FeatureBrowserData, BrowserType } from '../types';

const MAX_FEATURES = 100; // Maximum number of features to load initially
const PRIORITY_CATEGORIES = {
  css: ['properties', 'selectors'],
  javascript: ['builtins'],
  html: ['elements'],
  api: []
} as const;

interface Compat {
  __compat?: {
    support: {
      [key in BrowserType]?: BrowserSupport;
    };
    description?: string;
  };
  [key: string]: any;
}

function calculateCurrentUsage(browserSupport: FeatureBrowserData): number {
  // This is a simplified calculation using estimated market share
  const marketShare = {
    chrome: 0.45, // 45% market share
    firefox: 0.20, // 20% market share
    safari: 0.25, // 25% market share
    edge: 0.10 // 10% market share
  };

  let totalSupport = 0;
  const browsers = Object.keys(browserSupport) as BrowserType[];
  
  browsers.forEach(browser => {
    const support = browserSupport[browser];
    // Consider a feature supported if it has a version_added that's not false or null
    if (support.version_added && typeof support.version_added !== 'boolean') {
      totalSupport += marketShare[browser] * 100;
    }
  });

  return Math.round(totalSupport);
}

function determineBaselineStatus(currentUsage: number): Feature['baselineStatus'] {
  if (currentUsage >= 95) return 'widely';
  if (currentUsage >= 75) return 'newly';
  return 'limited';
}

function estimateAdoptionDate(browserSupport: FeatureBrowserData): string {
  const today = new Date();
  
  // Create new Date objects for each time period
  const sixMonthsFromNow = new Date(today.getTime());
  sixMonthsFromNow.setMonth(today.getMonth() + 6);
  
  const oneYearFromNow = new Date(today.getTime());
  oneYearFromNow.setMonth(today.getMonth() + 12);
  
  const usage = calculateCurrentUsage(browserSupport);
  
  if (usage >= 95) return today.toISOString().split('T')[0];
  if (usage >= 75) return sixMonthsFromNow.toISOString().split('T')[0];
  return oneYearFromNow.toISOString().split('T')[0];
}

function determineImpact(path: string): Feature['impact'] {
  const pathLower = path.toLowerCase();
  // Determine impact based on feature category and usage patterns
  if (pathLower.includes('javascript.builtins') || 
      pathLower.includes('css.properties') ||
      pathLower.includes('html.elements')) {
    return 'high';
  }
  if (pathLower.includes('api') || pathLower.includes('javascript.operators')) {
    return 'medium';
  }
  return 'low';
}

function getCategoryLabel(path: string): string {
  const categories: Record<string, string> = {
    'css.properties': 'CSS Properties',
    'javascript.builtins': 'JavaScript',
    'api': 'Web APIs',
    'html.elements': 'HTML',
    'javascript.operators': 'JS Operators',
    'css.selectors': 'CSS Selectors',
    'http': 'HTTP'
  };

  const mainCategory = path.split('.')[0];
  const subCategory = path.split('.')[1];
  const fullPath = `${mainCategory}.${subCategory}`;

  return categories[fullPath] || categories[mainCategory] || mainCategory.toUpperCase();
}

export function transformBcdFeature(
  path: string,
  compat: Compat['__compat'],
  name: string
): Feature | null {
  if (!compat || !compat.support) {
    return null;
  }

  try {
    const browserSupport: FeatureBrowserData = {
      chrome: compat.support.chrome || { version_added: null },
      firefox: compat.support.firefox || { version_added: null },
      safari: compat.support.safari || { version_added: null },
      edge: compat.support.edge || { version_added: null }
    };

    const currentUsage = calculateCurrentUsage(browserSupport);
    const category = getCategoryLabel(path);

    return {
      id: path.replace(/\./g, '-'),
      name,
      category,
      baselineStatus: determineBaselineStatus(currentUsage),
      adoptionDate: estimateAdoptionDate(browserSupport),
      currentUsage,
      impact: determineImpact(path),
      description: compat.description || `${name} - Web Platform Feature`,
      mdn_path: path,
      browser_support: browserSupport
    };
  } catch (error) {
    console.error(`Error transforming feature ${path}:`, error);
    return null;
  }
}
export function getAllFeatures(): Feature[] {
  const features: Feature[] = [];
  console.log('Starting BCD data transformation...');

  function traverseData(obj: Compat, path: string[] = []): boolean {
    if (!obj || typeof obj !== 'object') return false;
    if (features.length >= MAX_FEATURES) return true;

    if (obj.__compat) {
      try {
        const feature = transformBcdFeature(
          path.join('.'),
          obj.__compat,
          path[path.length - 1]
        );
        if (feature) {
          features.push(feature);
          console.debug(`Added feature: ${feature.name}`);
        }
      } catch (error) {
        console.error(`Error processing feature at path ${path.join('.')}:`, error);
      }
    }

    if (features.length >= MAX_FEATURES) return true;

    // Sort entries to prioritize more important features
    const entries = Object.entries(obj)
      .filter(([key]) => !key.startsWith('__'))
      .sort(([keyA], [keyB]) => {
        const categoryKey = path[0] as keyof typeof PRIORITY_CATEGORIES;
        const subcategories = PRIORITY_CATEGORIES[categoryKey];
        const priorityA = subcategories && (subcategories as readonly string[]).includes(keyA) ? 1 : 0;
        const priorityB = subcategories && (subcategories as readonly string[]).includes(keyB) ? 1 : 0;
        return priorityB - priorityA;
      });

    for (const [key, value] of entries) {
      if (value && typeof value === 'object') {
        if (traverseData(value as Compat, [...path, key])) {
          return true;
        }
      }
    }
    return false;
  }

  try {
    // Process categories in order of priority
    for (const [category, subcategories] of Object.entries(PRIORITY_CATEGORIES)) {
      if (subcategories.length === 0 && (bcd as any)[category]) {
        traverseData((bcd as any)[category] as Compat, [category]);
      } else {
        for (const sub of subcategories) {
          if ((bcd as any)[category]?.[sub]) {
            traverseData((bcd as any)[category][sub] as Compat, [category, sub]);
          }
        }
      }
      
      if (features.length >= MAX_FEATURES) break;
    }

    console.log(`Processed ${features.length} features`);
    return features;
  } catch (error) {
    console.error('Error processing BCD data:', error);
    return [];
  }
}