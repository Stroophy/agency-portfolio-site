// TypeScript interfaces for Stroophy Digital Services (SDS) Portfolio
// Generated: 2026-04-09 08:50 UTC (6:50 PM Melbourne)

export type ProjectCategory = 
  | 'landing-page' 
  | 'business-website' 
  | 'e-commerce' 
  | 'web-app' 
  | 'portfolio' 
  | 'other';

export type BudgetRange = 
  | '<$1k' 
  | '$1k-$3k' 
  | '$3k-$5k' 
  | '$5k-$10k' 
  | '$10k+';

export type ComplexityLevel = 
  | 'simple' 
  | 'medium' 
  | 'complex' 
  | 'enterprise';

export interface PortfolioAsset {
  // Core fields
  id: string;
  project_name: string;
  project_slug: string;
  project_description: string;
  project_category: ProjectCategory;
  
  // Client information
  client_name?: string;
  client_industry?: string;
  client_location?: string;
  client_testimonial?: string;
  
  // Project URLs
  project_url?: string;
  github_url?: string;
  live_demo_url?: string;
  
  // Tech stack
  frontend_tech: string[];
  backend_tech: string[];
  tools_tech: string[];
  
  // Images
  cover_image_path: string;
  gallery_image_paths: string[];
  
  // Project details
  development_time_days?: number;
  project_budget_range?: BudgetRange;
  complexity_level?: ComplexityLevel;
  
  // Content
  project_challenges?: string;
  project_solutions?: string;
  key_features: string[];
  results_achieved?: string;
  
  // Status
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  
  // Timestamps
  project_completed_date: string; // ISO date string
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
}

// Simplified version for public API (frontend)
export interface PublicPortfolioAsset {
  id: string;
  project_name: string;
  project_slug: string;
  project_description: string;
  project_category: ProjectCategory;
  client_name?: string;
  client_industry?: string;
  client_location?: string;
  client_testimonial?: string;
  project_url?: string;
  github_url?: string;
  live_demo_url?: string;
  frontend_tech: string[];
  backend_tech: string[];
  tools_tech: string[];
  cover_image_path: string;
  gallery_image_paths: string[];
  development_time_days?: number;
  project_budget_range?: BudgetRange;
  complexity_level?: ComplexityLevel;
  project_challenges?: string;
  project_solutions?: string;
  key_features: string[];
  results_achieved?: string;
  is_featured: boolean;
  display_order: number;
  project_completed_date: string;
  created_at: string;
}

// API response types
export interface PortfolioApiResponse {
  success: boolean;
  data: PortfolioAsset | PortfolioAsset[] | null;
  error?: string;
  count?: number;
}

// Filter options for portfolio
export interface PortfolioFilterOptions {
  category?: ProjectCategory;
  featured?: boolean;
  tech?: string; // Search for specific technology
  limit?: number;
  offset?: number;
  sortBy?: 'newest' | 'oldest' | 'featured' | 'budget' | 'complexity';
}

// Form data for creating/updating portfolio items
export interface PortfolioFormData {
  project_name: string;
  project_slug: string;
  project_description: string;
  project_category: ProjectCategory;
  client_name?: string;
  client_industry?: string;
  client_location?: string;
  client_testimonial?: string;
  project_url?: string;
  github_url?: string;
  live_demo_url?: string;
  frontend_tech: string[];
  backend_tech: string[];
  tools_tech: string[];
  cover_image_path: string;
  gallery_image_paths: string[];
  development_time_days?: number;
  project_budget_range?: BudgetRange;
  complexity_level?: ComplexityLevel;
  project_challenges?: string;
  project_solutions?: string;
  key_features: string[];
  results_achieved?: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  project_completed_date: string;
}

// Supabase storage file upload response
export interface SupabaseFileUpload {
  path: string;
  fullPath: string;
  url: string;
  error?: string;
}

// Constants for portfolio categories
export const PORTFOLIO_CATEGORIES: { value: ProjectCategory; label: string; description: string }[] = [
  { value: 'landing-page', label: 'Landing Page', description: 'Single-page websites for campaigns or products' },
  { value: 'business-website', label: 'Business Website', description: 'Multi-page websites for small businesses' },
  { value: 'e-commerce', label: 'E-commerce Store', description: 'Online stores with shopping cart and payments' },
  { value: 'web-app', label: 'Web Application', description: 'Interactive applications with user accounts' },
  { value: 'portfolio', label: 'Portfolio Site', description: 'Showcase websites for individuals or creatives' },
  { value: 'other', label: 'Other', description: 'Custom projects or unique requirements' }
];

// Common tech stack options (for auto-suggest in forms)
export const COMMON_TECH_STACK = {
  frontend: [
    'Next.js', 'React', 'Vue.js', 'Angular', 'Svelte',
    'TypeScript', 'JavaScript', 'Tailwind CSS', 'Bootstrap',
    'CSS3', 'HTML5', 'Framer Motion', 'GSAP'
  ],
  backend: [
    'Supabase', 'PostgreSQL', 'MySQL', 'MongoDB',
    'Node.js', 'Express.js', 'Python', 'Django', 'FastAPI',
    'Ruby on Rails', 'PHP', 'Laravel', 'Firebase'
  ],
  tools: [
    'Vercel', 'Netlify', 'GitHub', 'GitLab', 'Docker',
    'Figma', 'Adobe XD', 'Photoshop', 'Illustrator',
    'Cloudinary', 'Stripe', 'PayPal', 'SendGrid',
    'Google Analytics', 'Hotjar', 'Mailchimp'
  ]
};

// Helper functions
export function generateProjectSlug(projectName: string): string {
  return projectName
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function formatBudgetRange(budget: BudgetRange): string {
  const map: Record<BudgetRange, string> = {
    '<$1k': 'Under $1,000',
    '$1k-$3k': '$1,000 - $3,000',
    '$3k-$5k': '$3,000 - $5,000',
    '$5k-$10k': '$5,000 - $10,000',
    '$10k+': '$10,000+'
  };
  return map[budget];
}

export function formatComplexity(complexity: ComplexityLevel): string {
  const map: Record<ComplexityLevel, string> = {
    'simple': 'Simple',
    'medium': 'Medium',
    'complex': 'Complex',
    'enterprise': 'Enterprise'
  };
  return map[complexity];
}