// Shared types for portfolio content (minimal stubs to unblock build)

export type PortfolioFilterOptions = {
  category?: string;
  featured?: boolean;
  tech?: string;
  sortBy?: 'newest' | 'oldest' | 'featured' | 'budget';
  limit?: number;
  offset?: number;
};

export type PortfolioAsset = Record<string, any>;
export type PublicPortfolioAsset = Record<string, any>;

export type PortfolioApiResponse = {
  success: boolean;
  data: PortfolioAsset[] | PortfolioAsset | null;
  count?: number;
  error?: string;
};
