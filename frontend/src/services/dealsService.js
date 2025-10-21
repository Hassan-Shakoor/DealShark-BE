import { api, publicApi, API_ENDPOINTS } from './api.js';

// Deals service
export const dealsService = {
  // Create a new deal
  createDeal: async (dealData) => {
    try {
      const response = await api.post(API_ENDPOINTS.DEALS.CREATE, dealData);

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Deal created successfully.',
          deal: response.data,
        };
      }

      throw new Error('Failed to create deal. Invalid response from server.');
    } catch (error) {
      console.error('Create deal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create deal. Please try again.',
      };
    }
  },

  // Create commission deal
  createCommissionDeal: async (dealData) => {
    try {
      const response = await api.post(API_ENDPOINTS.DEALS.CREATE, {
        ...dealData,
        reward_type: 'commission',
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Commission deal created successfully.',
          deal: response.data,
        };
      }

      throw new Error('Failed to create commission deal. Invalid response from server.');
    } catch (error) {
      console.error('Create commission deal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create commission deal. Please try again.',
      };
    }
  },

  // Create no-reward deal
  createNoRewardDeal: async (dealData) => {
    try {
      const response = await api.post(API_ENDPOINTS.DEALS.CREATE, {
        ...dealData,
        reward_type: 'no_reward',
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'No-reward deal created successfully.',
          deal: response.data,
        };
      }

      throw new Error('Failed to create no-reward deal. Invalid response from server.');
    } catch (error) {
      console.error('Create no-reward deal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create no-reward deal. Please try again.',
      };
    }
  },

  // Get all deals for the current business
  getMyDeals: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DEALS.GET_MY_DEALS);

      if (response.success) {
        return {
          success: true,
          deals: response.data,
        };
      }

      throw new Error('Failed to fetch deals. Invalid response from server.');
    } catch (error) {
      console.error('Get my deals error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch deals. Please try again.',
      };
    }
  },

  // Get a specific deal by ID
  getDeal: async (dealId, userId = null) => {
    try {
      let url = API_ENDPOINTS.DEALS.GET_DEAL(dealId);
      
      // Add user_id query parameter if provided
      if (userId) {
        url += `?user_id=${userId}`;
      }

      const response = await api.get(url);

      if (response.success) {
        return {
          success: true,
          deal: response.data,
        };
      }

      throw new Error('Failed to fetch deal. Invalid response from server.');
    } catch (error) {
      console.error('Get deal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch deal. Please try again.',
      };
    }
  },

  // Get all industries
  getAllIndustries: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DEALS.GET_INDUSTRIES);

      if (response.success) {
        return {
          success: true,
          industries: response.data,
        };
      }

      throw new Error('Failed to fetch industries. Invalid response from server.');
    } catch (error) {
      console.error('Get industries error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch industries. Please try again.',
      };
    }
  },

  // Get all deals across all businesses
  getAllDeals: async (userId = null, searchParams = {}) => {
    try {
      let url = API_ENDPOINTS.DEALS.GET_ALL_DEALS;
      const params = new URLSearchParams();
      
      // Add user_id query parameter if provided
      if (userId) {
        params.append('user_id', userId);
      }

      // Add search parameters if provided
      if (searchParams.search) {
        params.append('search', searchParams.search);
      }
      if (searchParams.industry) {
        params.append('industry', searchParams.industry);
      }
      if (searchParams.reward_type) {
        params.append('reward_type', searchParams.reward_type);
      }

      // Append query parameters to URL if any exist
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const response = await api.get(url);

      if (response.success) {
        return {
          success: true,
          deals: response.data,
        };
      }

      throw new Error('Failed to fetch all deals. Invalid response from server.');
    } catch (error) {
      console.error('Get all deals error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch deals. Please try again.',
      };
    }
  },

  // Get deal poster options
  getDealPosterOptions: async () => {
    try {
      const response = await publicApi.get(API_ENDPOINTS.DEALS.DEAL_POSTER_OPTIONS);

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Deal poster options retrieved successfully.',
          options: response.data,
        };
      }

      throw new Error('Failed to get deal poster options. Invalid response from server.');
    } catch (error) {
      console.error('Get deal poster options error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get deal poster options. Please try again.',
      };
    }
  },

  // Get deals by business ID
  getDealsByBusiness: async (businessId, userId = null) => {
    try {
      let url = API_ENDPOINTS.DEALS.GET_DEALS_BY_BUSINESS(businessId);
      
      // Add user_id query parameter if provided
      if (userId) {
        url += `?user_id=${userId}`;
      }

      const response = await api.get(url);

      if (response.success) {
        return {
          success: true,
          deals: response.data,
        };
      }

      throw new Error('Failed to fetch business deals. Invalid response from server.');
    } catch (error) {
      console.error('Get business deals error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch business deals. Please try again.',
      };
    }
  },

  // Update a deal
  updateDeal: async (dealId, dealData) => {
    try {
      const response = await api.patch(API_ENDPOINTS.DEALS.UPDATE_DEAL(dealId), dealData);

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Deal updated successfully.',
          deal: response.data,
        };
      }

      throw new Error('Failed to update deal. Invalid response from server.');
    } catch (error) {
      console.error('Update deal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update deal. Please try again.',
      };
    }
  },

  // Get deal poster options
  getDealPosterOptions: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DEALS.DEAL_POSTER_OPTIONS);

      if (response.success) {
        return {
          success: true,
          options: response.data,
        };
      }

      throw new Error('Failed to fetch deal poster options. Invalid response from server.');
    } catch (error) {
      console.error('Get deal poster options error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch deal poster options. Please try again.',
      };
    }
  },

  // Search deals
  searchDeals: async (searchQuery, filters = {}) => {
    try {
      // This would typically be handled by the backend with query parameters
      const allDealsResponse = await dealsService.getAllDeals();
      
      if (!allDealsResponse.success) {
        return allDealsResponse;
      }

      let deals = allDealsResponse.deals;

      // Client-side filtering (in a real app, this would be done server-side)
      if (searchQuery) {
        deals = deals.filter(deal => 
          deal.deal_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.deal_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          deal.business?.business_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply filters
      if (filters.rewardType) {
        deals = deals.filter(deal => deal.reward_type === filters.rewardType);
      }

      if (filters.businessId) {
        deals = deals.filter(deal => deal.business?.id === filters.businessId);
      }

      if (filters.minIncentive) {
        deals = deals.filter(deal => deal.customer_incentive >= filters.minIncentive);
      }

      return {
        success: true,
        deals,
        total: deals.length,
      };
    } catch (error) {
      console.error('Search deals error:', error);
      return {
        success: false,
        error: error.message || 'Failed to search deals. Please try again.',
      };
    }
  },

  // Get trending deals (could be based on subscription count or other metrics)
  getTrendingDeals: async (limit = 10) => {
    try {
      const response = await dealsService.getAllDeals();
      
      if (!response.success) {
        return response;
      }

      // Sort by subscription count or other trending metrics
      const trendingDeals = response.deals
        .sort((a, b) => (b.subscription_count || 0) - (a.subscription_count || 0))
        .slice(0, limit);

      return {
        success: true,
        deals: trendingDeals,
      };
    } catch (error) {
      console.error('Get trending deals error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch trending deals. Please try again.',
      };
    }
  },
};

export default dealsService;
