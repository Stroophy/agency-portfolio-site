-- PI-HUB Web Services Portfolio Database Schema
-- Core table for storing portfolio projects

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create portfolio_assets table
CREATE TABLE IF NOT EXISTS portfolio_assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_name VARCHAR(255) NOT NULL,
  project_slug VARCHAR(255) UNIQUE NOT NULL,
  project_description TEXT NOT NULL,
  project_category VARCHAR(100) NOT NULL CHECK (project_category IN ('landing-page', 'business-website', 'e-commerce', 'web-app', 'portfolio', 'other')),
  
  -- Client info
  client_name VARCHAR(255),
  client_industry VARCHAR(100),
  client_location VARCHAR(100),
  client_testimonial TEXT,
  
  -- URLs
  project_url VARCHAR(500),
  github_url VARCHAR(500),
  live_demo_url VARCHAR(500),
  
  -- Tech stack
  frontend_tech TEXT[] DEFAULT '{}',
  backend_tech TEXT[] DEFAULT '{}',
  tools_tech TEXT[] DEFAULT '{}',
  
  -- Images
  cover_image_path VARCHAR(500) NOT NULL,
  gallery_image_paths VARCHAR(500)[] DEFAULT '{}',
  
  -- Project details
  development_time_days INTEGER,
  project_budget_range VARCHAR(50) CHECK (project_budget_range IN ('<$1k', '$1k-$3k', '$3k-$5k', '$5k-$10k', '$10k+')),
  complexity_level VARCHAR(20) CHECK (complexity_level IN ('simple', 'medium', 'complex', 'enterprise')),
  
  -- Content
  project_challenges TEXT,
  project_solutions TEXT,
  key_features TEXT[] DEFAULT '{}',
  results_achieved TEXT,
  
  -- Status
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  project_completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_assets(project_category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_assets(is_featured) WHERE is_featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_portfolio_published ON portfolio_assets(is_published) WHERE is_published = TRUE;
CREATE INDEX IF NOT EXISTS idx_portfolio_order ON portfolio_assets(display_order);

-- Sample data for testing
INSERT INTO portfolio_assets (
  project_name, project_slug, project_description, project_category,
  client_name, client_industry, client_location, project_url,
  frontend_tech, backend_tech, tools_tech, cover_image_path,
  development_time_days, project_budget_range, complexity_level,
  key_features, results_achieved, is_featured, display_order, project_completed_date
) VALUES
(
  'Melbourne Cafe Website',
  'melbourne-cafe-website',
  'Modern website for local cafe with online ordering',
  'business-website',
  'Urban Brew Cafe',
  'Food & Beverage',
  'Melbourne, Australia',
  'https://urbanbrewcafe.com',
  ARRAY['Next.js', 'React', 'Tailwind CSS'],
  ARRAY['Supabase', 'PostgreSQL'],
  ARRAY['Vercel', 'Figma'],
  'portfolio-images/cafe-cover.jpg',
  21,
  '$3k-$5k',
  'medium',
  ARRAY['Online ordering', 'Table booking', 'Mobile-responsive'],
  'Increased online orders by 40%',
  TRUE,
  1,
  '2026-03-15'
);