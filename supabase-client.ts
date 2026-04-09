// Supabase client configuration for PI-HUB Web Services
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
      if (filters.sortBy === 'newest') {
        query = query.order('project_completed_date', { ascending: false });
      } else if (filters.sortBy === 'oldest') {
        query = query.order('project_completed_date', { ascending: true });
      } else if (filters.sortBy === 'featured') {
        query = query.order('is_featured', { ascending: false });
      } else if (filters.sortBy === 'budget') {
        // Note: This requires a numeric budget field
        query = query.order('display_order', { ascending: true });
      } else {
        // Default: featured first, then by display order
        query = query.order('is_featured', { ascending: false }).order('display_order', { ascending: true });
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
        return {
          success: false,
          data: null,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as PortfolioAsset[],
        count: count || 0,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get a single portfolio asset by ID
  static async getPortfolioAssetById(id: string): Promise<PortfolioApiResponse> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (error) {
        return {
          success: false,
          data: null,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as PortfolioAsset,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get portfolio asset by slug
  static async getPortfolioAssetBySlug(slug: string): Promise<PortfolioApiResponse> {
    try {
      const { data, error } = await supabase
        .from('portfolio_assets')
        .select('*')
        .eq('project_slug', slug)
        .eq('is_published', true)
        .single();

      if (error) {
        return {
          success: false,
          data: null,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as PortfolioAsset,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get featured portfolio assets
  static async getFeaturedPortfolioAssets(limit: number = 3): Promise<PortfolioApiResponse> {
    return this.getAllPortfolioAssets({
      featured: true,
      limit,
      sortBy: 'featured',
    });
  }

  // Get portfolio assets by category
  static async getPortfolioAssetsByCategory(
    category: string,
    limit?: number
  ): Promise<PortfolioApiResponse> {
    return this.getAllPortfolioAssets({
      category: category as any,
      limit,
    });
  }

  // Get portfolio statistics
  static async getPortfolioStats() {
    try {
      // Get total published projects
      const { count: totalCount, error: countError } = await supabase
        .from('portfolio_assets')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      if (countError) {
        return {
          success: false,
          error: countError.message,
        };
      }

      // Get featured projects count
      const { count: featuredCount, error: featuredError } = await supabase
        .from('portfolio_assets')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true)
        .eq('is_featured', true);

      if (featuredError) {
        return {
          success: false,
          error: featuredError.message,
        };
      }

      // Get categories distribution
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('portfolio_assets')
        .select('project_category')
        .eq('is_published', true);

      if (categoriesError) {
        return {
          success: false,
          error: categoriesError.message,
        };
      }

      const categories = categoriesData.reduce((acc, item) => {
        acc[item.project_category] = (acc[item.project_category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        success: true,
        data: {
          totalProjects: totalCount || 0,
          featuredProjects: featuredCount || 0,
          categories,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Search portfolio assets
  static async searchPortfolioAssets(
    searchTerm: string,
    filters: PortfolioFilterOptions = {}
  ): Promise<PortfolioApiResponse> {
    try {
      let query = supabase
        .from('portfolio_assets')
        .select('*')
        .eq('is_published', true)
        .or(`project_name.ilike.%${searchTerm}%,project_description.ilike.%${searchTerm}%,client_name.ilike.%${searchTerm}%`);

      // Apply additional filters
      if (filters.category) {
        query = query.eq('project_category', filters.category);
      }

      if (filters.featured !== undefined) {
        query = query.eq('is_featured', filters.featured);
      }

      const { data, error, count } = await query;

      if (error) {
        return {
          success: false,
          data: null,
          error: error.message,
        };
      }

      return {
        success: true,
        data: data as PortfolioAsset[],
        count: count || 0,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Helper function to check Supabase connection
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('portfolio_assets').select('count', { count: 'exact', head: true });
    return !error;
  } catch {
    return false;
  }
}

// Export a simplified version for client-side use
export const portfolioApi = {
  getAll: PortfolioService.getAllPortfolioAssets,
  getById: PortfolioService.getPortfolioAssetById,
  getBySlug: PortfolioService.getPortfolioAssetBySlug,
  getFeatured: PortfolioService.getFeaturedPortfolioAssets,
  getByCategory: PortfolioService.getPortfolioAssetsByCategory,
  getStats: PortfolioService.getPortfolioStats,
  search: PortfolioService.searchPortfolioAssets,
  checkConnection: checkSupabaseConnection,
};