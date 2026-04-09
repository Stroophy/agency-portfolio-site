-- Migration: Create portfolio_assets table for PI-HUB Web Services agency
-- Created: 2026-04-09 08:50 UTC (6:50 PM Melbourne)
-- Purpose: Store portfolio projects, images, and tech stacks for agency website

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create portfolio_assets table
CREATE TABLE portfolio_assets (
  -- Primary key
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Project metadata
  project_name VARCHAR(255) NOT NULL,
  project_slug VARCHAR(255) UNIQUE NOT NULL,
  project_description TEXT NOT NULL,
  project_category VARCHAR(100) NOT NULL CHECK (project_category IN ('landing-page', 'business-website', 'e-commerce', 'web-app', 'portfolio', 'other')),
  
  -- Client information
  client_name VARCHAR(255),
  client_industry VARCHAR(100),
  client_location VARCHAR(100),
  client_testimonial TEXT,
  
  -- Project details
  project_url VARCHAR(500),
  github_url VARCHAR(500),
  live_demo_url VARCHAR(500),
  
  -- Tech stack (stored as arrays for flexibility)
  frontend_tech TEXT[] DEFAULT '{}',
  backend_tech TEXT[] DEFAULT '{}',
  tools_tech TEXT[] DEFAULT '{}',
  
  -- Images (store Supabase Storage paths)
  cover_image_path VARCHAR(500) NOT NULL,
  gallery_image_paths VARCHAR(500)[] DEFAULT '{}',
  
  -- Project metrics
  development_time_days INTEGER,
  project_budget_range VARCHAR(50) CHECK (project_budget_range IN ('<$1k', '$1k-$3k', '$3k-$5k', '$5k-$10k', '$10k+')),
  complexity_level VARCHAR(20) CHECK (complexity_level IN ('simple', 'medium', 'complex', 'enterprise')),
  
  -- Content
  project_challenges TEXT,
  project_solutions TEXT,
  key_features TEXT[] DEFAULT '{}',
  results_achieved TEXT,
  
  -- Status and visibility
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  
  -- Timestamps
  project_completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_urls CHECK (
    (project_url IS NULL OR project_url ~ '^https?://[^\s/$.?#].[^\s]*$') AND
    (github_url IS NULL OR github_url ~ '^https?://[^\s/$.?#].[^\s]*$') AND
    (live_demo_url IS NULL OR live_demo_url ~ '^https?://[^\s/$.?#].[^\s]*$')
  )
);

-- Create indexes for performance
CREATE INDEX idx_portfolio_assets_category ON portfolio_assets(project_category);
CREATE INDEX idx_portfolio_assets_featured ON portfolio_assets(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_portfolio_assets_published ON portfolio_assets(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_portfolio_assets_order ON portfolio_assets(display_order);
CREATE INDEX idx_portfolio_assets_tech_stack ON portfolio_assets USING GIN(frontend_tech, backend_tech, tools_tech);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic updated_at
CREATE TRIGGER update_portfolio_assets_updated_at
BEFORE UPDATE ON portfolio_assets
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create RLS (Row Level Security) policies
ALTER TABLE portfolio_assets ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public read access to published portfolio items
CREATE POLICY "Public can view published portfolio assets"
ON portfolio_assets FOR SELECT
USING (is_published = TRUE);

-- Policy: Allow authenticated users full access (for admin panel)
CREATE POLICY "Authenticated users have full access"
ON portfolio_assets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create storage bucket for portfolio images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for portfolio images bucket
CREATE POLICY "Public can view portfolio images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload portfolio images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can update portfolio images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can delete portfolio images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'portfolio-images');

-- Create view for public API (simplified for frontend)
CREATE VIEW public_portfolio_assets AS
SELECT 
  id,
  project_name,
  project_slug,
  project_description,
  project_category,
  client_name,
  client_industry,
  client_location,
  client_testimonial,
  project_url,
  github_url,
  live_demo_url,
  frontend_tech,
  backend_tech,
  tools_tech,
  cover_image_path,
  gallery_image_paths,
  development_time_days,
  project_budget_range,
  complexity_level,
  project_challenges,
  project_solutions,
  key_features,
  results_achieved,
  is_featured,
  display_order,
  project_completed_date,
  created_at
FROM portfolio_assets
WHERE is_published = TRUE
ORDER BY display_order ASC, created_at DESC;

-- Insert sample data for testing/demo
INSERT INTO portfolio_assets (
  project_name,
  project_slug,
  project_description,
  project_category,
  client_name,
  client_industry,
  client_location,
  project_url,
  frontend_tech,
  backend_tech,
  tools_tech,
  cover_image_path,
  development_time_days,
  project_budget_range,
  complexity_level,
  key_features,
  results_achieved,
  is_featured,
  display_order,
  project_completed_date
) VALUES
(
  'Melbourne Cafe Website',
  'melbourne-cafe-website',
  'A modern, responsive website for a local Melbourne cafe with online ordering and table booking system.',
  'business-website',
  'Urban Brew Cafe',
  'Food & Beverage',
  'Melbourne, Australia',
  'https://urbanbrewcafe.com',
  ARRAY['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
  ARRAY['Supabase', 'PostgreSQL', 'Node.js'],
  ARRAY['Vercel', 'GitHub Actions', 'Figma'],
  'portfolio-images/cafe-cover.jpg',
  21,
  '$3k-$5k',
  'medium',
  ARRAY['Online ordering', 'Table booking', 'Menu with filters', 'Customer reviews', 'Mobile-responsive'],
  'Increased online orders by 40% and reduced phone calls for bookings by 60%',
  TRUE,
  1,
  '2026-03-15'
),
(
  'E-commerce Store for Local Artisan',
  'artisan-ecommerce-store',
  'Full-featured e-commerce platform for a Melbourne-based artisan selling handmade crafts.',
  'e-commerce',
  'Handcrafted Melbourne',
  'Retail & Crafts',
  'Melbourne, Australia',
  'https://handcraftedmelbourne.com',
  ARRAY['Next.js', 'React', 'Tailwind CSS', 'Stripe Elements'],
  ARRAY['Supabase', 'PostgreSQL', 'Stripe API'],
  ARRAY['Vercel', 'GitHub', 'Cloudinary'],
  'portfolio-images/artisan-cover.jpg',
  35,
  '$5k-$10k',
  'complex',
  ARRAY['Product catalog', 'Shopping cart', 'Checkout with Stripe', 'Inventory management', 'Order tracking'],
  'Enabled artisan to scale business 3x with automated order processing',
  TRUE,
  2,
  '2026-02-28'
),
(
  'Portfolio Website for Freelancer',
  'freelancer-portfolio',
  'Clean, minimalist portfolio website for a Melbourne-based UI/UX designer.',
  'portfolio',
  'Alex Designer',
  'Design & Creative',
  'Melbourne, Australia',
  'https://alexdesigner.com',
  ARRAY['Next.js', 'React', 'Framer Motion', 'Tailwind CSS'],
  ARRAY['Supabase', 'PostgreSQL'],
  ARRAY['Vercel', 'Figma', 'GitHub'],
  'portfolio-images/portfolio-cover.jpg',
  14,
  '$1k-$3k',
  'simple',
  ARRAY['Project showcase', 'Contact form', 'Dark/light mode', 'Performance optimized', 'SEO friendly'],
  'Helped freelancer secure 5 new clients within first month of launch',
  TRUE,
  3,
  '2026-01-20'
);

-- Create comment on table for documentation
COMMENT ON TABLE portfolio_assets IS 'Stores portfolio projects for PI-HUB Web Services agency website';
COMMENT ON COLUMN portfolio_assets.project_slug IS 'URL-friendly slug for the project (used in routes)';
COMMENT ON COLUMN portfolio_assets.cover_image_path IS 'Path to cover image in Supabase Storage (bucket: portfolio-images)';
COMMENT ON COLUMN portfolio_assets.gallery_image_paths IS 'Array of paths to additional gallery images';
COMMENT ON COLUMN portfolio_assets.frontend_tech IS 'Array of frontend technologies used in the project';
COMMENT ON COLUMN portfolio_assets.backend_tech IS 'Array of backend technologies used in the project';
COMMENT ON COLUMN portfolio_assets.tools_tech IS 'Array of tools and services used in the project';

-- Grant permissions
GRANT SELECT ON public_portfolio_assets TO anon, authenticated;
GRANT ALL ON portfolio_assets TO authenticated;