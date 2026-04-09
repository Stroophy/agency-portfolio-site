// Supabase client configuration for Stroophy Digital Services (SDS)
// Generated: 2026-04-09 08:50 UTC (6:50 PM Melbourne)

import { createClient } from '@supabase/supabase-js';
import { PortfolioAsset, PublicPortfolioAsset, PortfolioFilterOptions, PortfolioApiResponse } from './portfolio-types';

// Supabase configuration
// Note: Replace with your actual Supabase URL and anon key
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-application-name': 'pi-hub-portfolio',
    },
  },
});

// Portfolio API Service
export class PortfolioService {
  // Get all published portfolio assets
  static async getAllPortfolioAssets(
    filters: PortfolioFilterOptions = {}
  ): Promise<PortfolioApiResponse> {
    try {
      let query = supabase
        .from('portfolio_assets')
        .select('*')
        .eq('is_published', true);

      // Apply filters
      if (filters.category) {
        query = query.eq('project_category', filters.category);
      }

      if (filters.featured !== undefined) {
        query = query.eq('is_featured', filters.featured);
      }

      if (filters.tech) {
        query = query.or(`frontend_tech.cs.{${filters.tech}},backend_tech.cs.{${filters.tech}},tools_tech.cs.{${filters.tech}}`);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('project_completed_date', { ascending: false });
          break;
        case 'oldest':
          query = query.order('project_completed_date', { ascending: true });
          break;
        case 'featured':
          query = query.order('is_featured', { ascending: false }).order('display_order', { ascending: true });
          break;
        case 'budget':
          // Note: This requires custom logic since budget is a string enum
          query = query.order('project_budget_range', { ascending: true });
          break;
        case 'complexity':
          query = query.order('complexity_level', { ascending: true });
          break;
        default:
          query = query.order('display_order', { ascending: true }).order('created_at', { ascending: false });
      }

      // Apply pagination
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as PortfolioAsset[],
        count: count || data?.length || 0,
      };
    } catch (error: any) {
      console.error('Error fetching portfolio assets:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch portfolio assets',
      };
    }
  }

  // Get single portfolio asset by slug
  static async getPortfolioAssetBySlug(slug: string): Promise<PortfolioApiResponse> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('project_slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as PortfolioAsset,
      };
    } catch (error: any) {
      console.error(`Error fetching portfolio asset ${slug}:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch portfolio asset',
      };
    }
  }

  // Get featured portfolio assets
  static async getFeaturedPortfolioAssets(limit: number = 3): Promise<PortfolioApiResponse> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('is_published', true)
        .eq('is_featured', true)
        .order('display_order', { ascending: true })
        .limit(limit);

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as PortfolioAsset[],
      };
    } catch (error: any) {
      console.error('Error fetching featured portfolio assets:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch featured portfolio assets',
      };
    }
  }

  // Get portfolio assets by category
  static async getPortfolioAssetsByCategory(
    category: string,
    limit: number = 6
  ): Promise<PortfolioApiResponse> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('is_published', true)
        .eq('project_category', category)
        .order('display_order', { ascending: true })
        .limit(limit);

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as PortfolioAsset[],
      };
    } catch (error: any) {
      console.error(`Error fetching portfolio assets by category ${category}:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to fetch portfolio assets by category',
      };
    }
  }

  // Search portfolio assets by technology
  static async searchPortfolioAssetsByTech(tech: string): Promise<PortfolioApiResponse> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('is_published', true)
        .or(`frontend_tech.cs.{${tech}},backend_tech.cs.{${tech}},tools_tech.cs.{${tech}}`)
        .order('display_order', { ascending: true });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as PortfolioAsset[],
      };
    } catch (error: any) {
      console.error(`Error searching portfolio assets by tech ${tech}:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to search portfolio assets by technology',
      };
    }
  }

  // Get all unique categories
  static async getPortfolioCategories(): Promise<{ success: boolean; data: string[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('project_category')
        .eq('is_published', true);

      if (error) {
        throw error;
      }

      const categories = [...new Set(data.map(item => item.project_category))];
      return {
        success: true,
        data: categories,
      };
    } catch (error: any) {
      console.error('Error fetching portfolio categories:', error);
      return {
        success: false,
        data: [],
        error: error.message || 'Failed to fetch portfolio categories',
      };
    }
  }

  // Upload image to Supabase Storage
  static async uploadPortfolioImage(
    file: File,
    projectSlug: string
  ): Promise<{ success: boolean; path?: string; url?: string; error?: string }> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${projectSlug}-${Date.now()}.${fileExt}`;
      const filePath = `portfolio-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      return {
        success: true,
        path: filePath,
        url: publicUrl,
      };
    } catch (error: any) {
      console.error('Error uploading portfolio image:', error);
      return {
        success: false,
        error: error.message || 'Failed to upload image',
      };
    }
  }

  // Get public URL for portfolio image
  static getPortfolioImageUrl(path: string): string {
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(path);
    return publicUrl;
  }
}

// Admin functions (require authentication)
export class PortfolioAdminService {
  // Create new portfolio asset
  static async createPortfolioAsset(
    assetData: Partial<PortfolioAsset>,
    token: string
  ): Promise<PortfolioApiResponse> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .insert([assetData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as PortfolioAsset,
      };
    } catch (error: any) {
      console.error('Error creating portfolio asset:', error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to create portfolio asset',
      };
    }
  }

  // Update portfolio asset
  static async updatePortfolioAsset(
    id: string,
    updates: Partial<PortfolioAsset>,
    token: string
  ): Promise<PortfolioApiResponse> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data as PortfolioAsset,
      };
    } catch (error: any) {
      console.error(`Error updating portfolio asset ${id}:`, error);
      return {
        success: false,
        data: null,
        error: error.message || 'Failed to update portfolio asset',
      };
    }
  }

  // Delete portfolio asset
  static async deletePortfolioAsset(
    id: string,
    token: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('portfolio_assets')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return {
        success: true,
      };
    } catch (error: any) {
      console.error(`Error deleting portfolio asset ${id}:`, error);
      return {
        success: false,
        error: error.message || 'Failed to delete portfolio asset',
      };
    }
  }
}

// Export utility functions
export const portfolioUtils = {
  // Format tech stack for display
  formatTechStack: (techArray: string[]): string => {
    return techArray.join(', ');
  },

  // Calculate project duration
  formatProjectDuration: (days: number): string => {
    if (days < 7) {
      return `${days} day${days !== 1 ? 's' : ''}`;
    } else if (days < 30) {
      const weeks = Math.floor(days / 7);
      return `${weeks} week${weeks !== 1 ? 's' : ''}`;
    } else {
      const months = Math.floor(days / 30);
      return `${months} month${months !== 1 ? 's' : ''}`;
    }
  },

  // Generate project card data
  generateProjectCardData: (asset: PortfolioAsset) => {
    return {
      id: asset.id,
      title: asset.project_name,
      description: asset.project_description.substring(0, 150) + '...',
      category: asset.project_category,
      imageUrl: PortfolioService.getPortfolioImageUrl(asset.cover_image_path),
      techStack: [...asset.frontend_tech, ...asset.backend_tech].slice(0, 3),
      client: asset.client_name,
      budget: asset.project_budget_range,
      duration: asset.development_time_days 
        ? portfolioUtils.formatProjectDuration(asset.development_time_days)
        : 'N/A',
      slug: asset.project_slug,
      isFeatured: asset.is_featured,
    };
  },
};