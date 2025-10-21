import { api, publicApi, API_ENDPOINTS } from './api.js';

// Referrals service
export const referralsService = {
  // Subscribe to a deal
  subscribeToDeal: async (dealId, referrerId) => {
    try {
      const response = await api.post(API_ENDPOINTS.REFERRALS.SUBSCRIBE, {
        deal_id: dealId,
        referrer_id: referrerId,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Successfully subscribed to deal.',
          subscription: response.data,
        };
      }

      throw new Error('Failed to subscribe to deal. Invalid response from server.');
    } catch (error) {
      console.error('Subscribe to deal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to subscribe to deal. Please try again.',
      };
    }
  },

  // Unsubscribe from a deal
  unsubscribeFromDeal: async (dealId, referrerId) => {
    try {
      const response = await api.post(API_ENDPOINTS.REFERRALS.UNSUBSCRIBE, {
        deal_id: dealId,
        referrer_id: referrerId,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Successfully unsubscribed from deal.',
        };
      }

      throw new Error('Failed to unsubscribe from deal. Invalid response from server.');
    } catch (error) {
      console.error('Unsubscribe from deal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to unsubscribe from deal. Please try again.',
      };
    }
  },

  // Get subscribers for a business (business view)
  getBusinessSubscribers: async (businessId) => {
    try {
      const response = await api.get(API_ENDPOINTS.REFERRALS.MY_SUBSCRIBERS(businessId));

      if (response.success) {
        return {
          success: true,
          subscribers: response.data,
          total: response.data.length,
        };
      }

      throw new Error('Failed to fetch subscribers. Invalid response from server.');
    } catch (error) {
      console.error('Get business subscribers error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch subscribers. Please try again.',
      };
    }
  },

  // Get my subscribers (alias for getBusinessSubscribers)
  getMySubscribers: async (businessId) => {
    try {
      const response = await api.get(API_ENDPOINTS.REFERRALS.MY_SUBSCRIBERS(businessId));

      if (response.success) {
        return {
          success: true,
          data: response.data, // Return the full response data including business info
        };
      }

      throw new Error('Failed to fetch subscribers. Invalid response from server.');
    } catch (error) {
      console.error('Get my subscribers error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch subscribers. Please try again.',
      };
    }
  },

  // Get user's subscriptions (customer view)
  getMySubscriptions: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.REFERRALS.MY_SUBSCRIPTIONS);

      if (response.success) {
        return {
          success: true,
          data: response.data, // Return the full response data including referrer info
        };
      }

      throw new Error('Failed to fetch subscriptions. Invalid response from server.');
    } catch (error) {
      console.error('Get my subscriptions error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch subscriptions. Please try again.',
      };
    }
  },

  // Get subscription analytics for a business
  getSubscriptionAnalytics: async (businessId, timeRange = '30d') => {
    try {
      const subscribersResponse = await referralsService.getBusinessSubscribers(businessId);
      
      if (!subscribersResponse.success) {
        return subscribersResponse;
      }

      const subscribers = subscribersResponse.subscribers;

      // Calculate analytics
      const analytics = {
        totalSubscribers: subscribers.length,
        activeSubscribers: subscribers.filter(sub => sub.is_active).length,
        totalEarnings: subscribers.reduce((sum, sub) => sum + (sub.earnings || 0), 0),
        averageEarnings: subscribers.length > 0 
          ? subscribers.reduce((sum, sub) => sum + (sub.earnings || 0), 0) / subscribers.length 
          : 0,
        topPerformers: subscribers
          .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
          .slice(0, 10),
        subscriptionTrends: subscribers.reduce((trends, sub) => {
          const date = new Date(sub.subscribed_at).toISOString().split('T')[0];
          trends[date] = (trends[date] || 0) + 1;
          return trends;
        }, {}),
      };

      return {
        success: true,
        analytics,
      };
    } catch (error) {
      console.error('Get subscription analytics error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch subscription analytics. Please try again.',
      };
    }
  },

  // Get referral performance for a user
  getReferralPerformance: async () => {
    try {
      const subscriptionsResponse = await referralsService.getMySubscriptions();
      
      if (!subscriptionsResponse.success) {
        return subscriptionsResponse;
      }

      const subscriptions = subscriptionsResponse.subscriptions;

      // Calculate performance metrics
      const performance = {
        totalSubscriptions: subscriptions.length,
        activeSubscriptions: subscriptions.filter(sub => sub.is_active).length,
        totalEarnings: subscriptions.reduce((sum, sub) => sum + (sub.earnings || 0), 0),
        averageEarnings: subscriptions.length > 0 
          ? subscriptions.reduce((sum, sub) => sum + (sub.earnings || 0), 0) / subscriptions.length 
          : 0,
        topEarningDeals: subscriptions
          .sort((a, b) => (b.earnings || 0) - (a.earnings || 0))
          .slice(0, 5),
        monthlyEarnings: subscriptions.reduce((monthly, sub) => {
          const month = new Date(sub.subscribed_at).toISOString().substring(0, 7);
          monthly[month] = (monthly[month] || 0) + (sub.earnings || 0);
          return monthly;
        }, {}),
      };

      return {
        success: true,
        performance,
      };
    } catch (error) {
      console.error('Get referral performance error:', error);
      return {
        success: false,
        error: error.message || 'Failed to fetch referral performance. Please try again.',
      };
    }
  },

  // Check if user is subscribed to a deal
  isSubscribedToDeal: async (dealId) => {
    try {
      const subscriptionsResponse = await referralsService.getMySubscriptions();
      
      if (!subscriptionsResponse.success) {
        return subscriptionsResponse;
      }

      const isSubscribed = subscriptionsResponse.subscriptions.some(
        subscription => subscription.deal_id === dealId
      );

      return {
        success: true,
        isSubscribed,
      };
    } catch (error) {
      console.error('Check subscription status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to check subscription status. Please try again.',
      };
    }
  },

  // Get referral link for a deal
  getReferralLink: (dealId, userId) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/deal/${dealId}?ref=${userId}`;
  },

  // Share deal (would integrate with social sharing APIs)
  shareDeal: async (dealId, platform, customMessage = '') => {
    try {
      const dealResponse = await dealsService.getDeal(dealId);
      
      if (!dealResponse.success) {
        return dealResponse;
      }

      const deal = dealResponse.deal;
      const referralLink = referralsService.getReferralLink(dealId, deal.user_id);
      
      const shareData = {
        title: deal.deal_name,
        text: customMessage || deal.deal_description,
        url: referralLink,
        platform,
      };

      // In a real implementation, this would integrate with social sharing APIs
      return {
        success: true,
        shareData,
        message: 'Deal ready to share!',
      };
    } catch (error) {
      console.error('Share deal error:', error);
      return {
        success: false,
        error: error.message || 'Failed to prepare deal for sharing. Please try again.',
      };
    }
  },

  // Create payment for referral
  createPayment: async (referralCode, amount) => {
    try {
      const response = await api.post(API_ENDPOINTS.REFERRALS.CREATE_PAYMENT, {
        referral_code: referralCode,
        amount: amount,
      });

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Payment created successfully.',
          payment: response.data,
        };
      }

      throw new Error('Failed to create payment. Invalid response from server.');
    } catch (error) {
      console.error('Create payment error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create payment. Please try again.',
      };
    }
  },

  // Verify referral code
  verifyReferral: async (referralCode) => {
    try {
      const response = await publicApi.get(`${API_ENDPOINTS.REFERRALS.VERIFY_REFERRAL}?code=${referralCode}`);

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Referral verified successfully.',
          referral: response.data,
        };
      }

      throw new Error('Failed to verify referral. Invalid response from server.');
    } catch (error) {
      console.error('Verify referral error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify referral. Please try again.',
      };
    }
  },

  // Create onboarding link
  createOnboardingLink: async () => {
    try {
      const response = await api.post(API_ENDPOINTS.REFERRALS.CREATE_ONBOARDING_LINK);

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Onboarding link created successfully.',
          link: response.data,
        };
      }

      throw new Error('Failed to create onboarding link. Invalid response from server.');
    } catch (error) {
      console.error('Create onboarding link error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create onboarding link. Please try again.',
      };
    }
  },

  // Get onboarding status
  getOnboardingStatus: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.REFERRALS.ONBOARDING_STATUS);

      if (response.success) {
        return {
          success: true,
          message: response.data.message || 'Onboarding status retrieved successfully.',
          status: response.data,
        };
      }

      throw new Error('Failed to get onboarding status. Invalid response from server.');
    } catch (error) {
      console.error('Get onboarding status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get onboarding status. Please try again.',
      };
    }
  },
};

export default referralsService;
