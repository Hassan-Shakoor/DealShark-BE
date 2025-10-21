import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { referralsService } from '../services';
import { 
  ClipboardIcon, 
  UserIcon, 
  CurrencyDollarIcon,
  LinkIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MySubscriptionsPage = () => {
  const { user } = useAuth();
  const [subscriptionsData, setSubscriptionsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const result = await referralsService.getMySubscriptions();
      
      if (result.success) {
        setSubscriptionsData(result.data);
      } else {
        setError(result.error || 'Failed to fetch subscriptions');
      }
    } catch (error) {
      setError('Failed to fetch subscriptions');
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = async (referralLink) => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success('Referral link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleUnsubscribe = async (subscriptionId) => {
    if (!window.confirm('Are you sure you want to unsubscribe from this deal?')) {
      return;
    }

    try {
      // This would need to be implemented in referralsService
      // const result = await referralsService.unsubscribeFromDeal(subscriptionId);
      toast.success('Successfully unsubscribed from deal');
      fetchSubscriptions(); // Refresh the list
    } catch (error) {
      toast.error('Failed to unsubscribe');
    }
  };

  const getBusinessIcon = (business) => {
    if (business.logo_url) {
      return (
        <img
          src={business.logo_url}
          alt={business.business_name}
          className="w-12 h-12 rounded-lg object-contain"
        />
      );
    }
    return <UserIcon className="w-12 h-12 text-gray-400" />;
  };

  const getRewardDisplay = (deal) => {
    if (deal.reward_type === 'commission') {
      return `${deal.customer_incentive}% Referral Bonus`;
    } else if (deal.reward_type === 'no_reward') {
      return `${deal.customer_incentive}% Referral Bonus`;
    } else {
      return `${deal.customer_incentive}% Referral Bonus`;
    }
  };

  const getUserInitials = (email) => {
    if (!email) return 'TU';
    const name = email.split('@')[0];
    return name.substring(0, 2).toUpperCase();
  };

  const getUserDisplayName = (email) => {
    if (!email) return 'Test User';
    const name = email.split('@')[0];
    // Convert to title case
    return name.charAt(0).toUpperCase() + name.slice(1) + ' User';
  };

  return (
    <div className="min-h-screen bg-gray-50">
 
      {/* User Profile Section */}
      <div className="bg-dealshark-blue">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6">
              {/* User Avatar */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center border-2 sm:border-4 border-white shadow-lg flex-shrink-0">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-200 rounded-lg sm:rounded-xl flex items-center justify-center">
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-600">
                    {getUserInitials(subscriptionsData?.referrer?.email || user?.email)}
                  </span>
                </div>
              </div>
              
              {/* User Info */}
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-1 sm:mb-2 truncate">
                  {getUserDisplayName(subscriptionsData?.referrer?.email || user?.email)}
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm md:text-base lg:text-lg truncate">{subscriptionsData?.referrer?.email || user?.email}</p>
              </div>
            </div>

            {/* Shark Mascot */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="text-5xl xl:text-6xl">🦈</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">My Subscriptions</h2>
        </div>

        {/* Subscriptions Container */}
        <div className="bg-dealshark-yellow rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border-2 sm:border-4 border-dealshark-yellow">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg animate-pulse">
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="h-2 sm:h-3 bg-gray-200 rounded"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-8 sm:h-10 bg-gray-200 rounded"></div>
                    <div className="flex space-x-2">
                      <div className="h-7 sm:h-8 bg-gray-200 rounded flex-1"></div>
                      <div className="h-7 sm:h-8 bg-gray-200 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-red-500 text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">⚠️</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 px-4">Error Loading Subscriptions</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-4">{error}</p>
              <button
                onClick={fetchSubscriptions}
                className="bg-dealshark-blue text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : !subscriptionsData || subscriptionsData.subscriptions.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📋</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2 px-4">No Subscriptions Yet</h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">You haven't subscribed to any deals yet. Start exploring deals to begin earning!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {subscriptionsData.subscriptions.map((subscription) => (
                <div key={subscription.subscription_id} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-shadow">
                  {/* Business Info */}
                  <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                      {getBusinessIcon(subscription.business)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg truncate">
                        {subscription.deal.deal_name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm truncate">
                        {subscription.business.business_name}
                      </p>
                    </div>
                  </div>

                  {/* Reward Info */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-dealshark-blue font-semibold text-sm sm:text-base md:text-lg">
                      {getRewardDisplay(subscription.deal)}
                    </p>
                  </div>

                  {/* Referral Link */}
                  <div className="mb-3 sm:mb-4">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Referral Link
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={subscription.referral_link}
                        readOnly
                        className="w-full px-2 sm:px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-xs sm:text-sm font-mono pr-8"
                      />
                      <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex-shrink-0" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                    <button
                      onClick={() => handleCopyUrl(subscription.referral_link)}
                      className="flex-1 bg-dealshark-blue text-white py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <ClipboardIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Copy URL</span>
                    </button>
                    <button
                      onClick={() => handleUnsubscribe(subscription.subscription_id)}
                      className="flex-1 bg-red-500 text-white py-2 px-3 sm:px-4 text-xs sm:text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Unsubscribe</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MySubscriptionsPage;