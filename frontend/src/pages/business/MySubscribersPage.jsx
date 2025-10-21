import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { referralsService } from '../../services';
import { 
  UsersIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  UserCircleIcon,
  EyeIcon,
  ClipboardIcon,
  LinkIcon,
  ClockIcon,
  GiftIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MySubscribersPage = () => {
  const { user, business } = useAuth();
  const [subscribersData, setSubscribersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (business?.id) {
      fetchSubscribers();
    }
  }, [business?.id]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const result = await referralsService.getMySubscribers(business.id);
      
      if (result.success) {
        setSubscribersData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch subscribers');
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

  // Calculate business stats
  const totalSubscribers = subscribersData?.total_subscribers || 0;
  const totalRevenue = subscribersData?.subscribers?.reduce((sum, sub) => sum + (sub.business_revenue || 0), 0) || 0;
  const totalCommissions = subscribersData?.subscribers?.reduce((sum, sub) => sum + (sub.commission_earned || 0), 0) || 0;
  const avgRevenuePerSubscriber = totalSubscribers > 0 ? Math.round(totalRevenue / totalSubscribers) : 0;

  const businessStats = [
    {
      label: 'Total Subscribers',
      value: totalSubscribers.toLocaleString(),
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+15%',
      changeType: 'positive'
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Commissions Paid',
      value: `$${totalCommissions.toLocaleString()}`,
      icon: GiftIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Avg. Revenue/Subscriber',
      value: `$${avgRevenuePerSubscriber}`,
      icon: ChartBarIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  const getUserInitials = (user) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getRewardDisplay = (deal) => {
    if (deal.reward_type === 'commission') {
      return `${deal.customer_incentive}% Commission`;
    } else {
      return 'Special Offer';
    }
  };

  const getRewardColor = (deal) => {
    if (deal.reward_type === 'commission') {
      return 'from-green-500 to-emerald-500';
    } else {
      return 'from-blue-500 to-indigo-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your subscribers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          
          {/* Business Profile Header */}
          <div className="business-profile-header auth-card mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 flex-1">
                {/* Business Logo */}
                <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br ${subscribersData?.business?.logo_url ? 'bg-white border border-gray-300' : 'from-dealshark-blue to-blue-600'} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  {subscribersData?.business?.logo_url ? (
                    <img
                      src={subscribersData.business.logo_url}
                      alt={subscribersData.business.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl object-contain"
                    />
                  ) : (
                    <BuildingOfficeIcon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white" />
                  )}
                </div>
                
                {/* Business Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                    {subscribersData?.business?.name || business?.business_name || 'My Business'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-600">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <GlobeAltIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{subscribersData?.business?.industry || business?.industry || 'Business'}</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{subscribersData?.business?.city || business?.city}, {subscribersData?.business?.state || business?.state}</span>
                    </div>
                    {subscribersData?.business?.is_verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <StarIcon className="h-2 w-2 sm:h-3 sm:w-3" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Subscribers Count Badge */}
              <div className="flex items-center space-x-3 w-full lg:w-auto">
                <div className="bg-dealshark-blue text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl w-full lg:w-auto text-center">
                  <div className="text-xl sm:text-2xl font-bold">{totalSubscribers}</div>
                  <div className="text-xs sm:text-sm opacity-90">Active Subscribers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {businessStats.map((stat, index) => (
              <div key={stat.label} className={`stat-card auth-card animate-fade-in-up delay-${(index + 1) * 100}`}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center space-x-1 text-xs sm:text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Business Details Card */}
          {/* <div className="business-details-card auth-card mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <EnvelopeIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Email</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.email || business?.email || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <PhoneIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Phone</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.phone_number || business?.phone_number || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <GlobeAltIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Website</span>
                </div>
                <p className="text-gray-600">
                  {subscribersData?.business?.website || business?.website ? (
                    <a href={subscribersData?.business?.website || business?.website} target="_blank" rel="noopener noreferrer" className="text-dealshark-blue hover:underline">
                      {subscribersData?.business?.website || business?.website}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <MapPinIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Address</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.address || business?.business_address || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <BuildingOfficeIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Registration</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.registration_no || business?.registration_no || 'Not provided'}</p>
              </div>
              
              <div className="detail-item">
                <div className="flex items-center space-x-3 mb-2">
                  <CalendarIcon className="h-5 w-5 text-dealshark-blue" />
                  <span className="font-medium text-gray-900">Industry</span>
                </div>
                <p className="text-gray-600">{subscribersData?.business?.industry || business?.industry || 'Not specified'}</p>
              </div>
            </div>
          </div> */}

          {/* Subscribers Section */}
          <div className="subscribers-section auth-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Subscribers</h2>
              <div className="text-xs sm:text-sm text-gray-600">
                {subscribersData?.subscribers?.length || 0} {subscribersData?.subscribers?.length === 1 ? 'subscriber' : 'subscribers'} total
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="error-message mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Subscribers Grid */}
            {!subscribersData || subscribersData.subscribers?.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <UsersIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 px-4">No subscribers yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                  Your deals are live! Share them with your network to start getting subscribers and earning referrals.
                </p>
                <div className="text-xs sm:text-sm text-gray-500 px-4">
                  Tip: Share your deals on social media and with your customers to attract more subscribers
                </div>
              </div>
            ) : (
              <div className="subscribers-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {subscribersData.subscribers.map((subscriber, index) => (
                  <div key={subscriber.subscription_id} className={`subscriber-card bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-${(index + 1) * 100}`}>
                    <div className="p-4 sm:p-6">
                      {/* Subscriber Header */}
                      <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 ${subscriber.referrer.profile_image_url ? 'bg-white border border-gray-300' : 'bg-gradient-to-br from-dealshark-blue to-blue-600'} rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0`}>
                          {subscriber.referrer.profile_image_url ? (
                            <img
                              src={subscriber.referrer.profile_image_url}
                              alt={`${subscriber.referrer.first_name} ${subscriber.referrer.last_name}`}
                              className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-contain"
                            />
                          ) : (
                            <span className="text-white font-bold text-base sm:text-lg">
                              {getUserInitials(subscriber.referrer)}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base text-gray-900 truncate">
                            {subscriber.referrer.first_name} {subscriber.referrer.last_name}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">{subscriber.referrer.email}</p>
                        </div>
                      </div>

                      {/* Deal Info */}
                      <div className="mb-3 sm:mb-4">
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base md:text-lg mb-2 line-clamp-2">
                          {subscriber.deal.deal_name}
                        </h4>
                        <div className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-white text-xs sm:text-sm font-semibold bg-gradient-to-r ${getRewardColor(subscriber.deal)}`}>
                          {subscriber.deal.reward_type === 'commission' ? (
                            <CurrencyDollarIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          ) : (
                            <GiftIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                          )}
                          <span className="truncate">{getRewardDisplay(subscriber.deal)}</span>
                        </div>
                      </div>

                      {/* Subscription Stats */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-500 text-xs sm:text-sm">Joined:</span>
                          <span className="font-medium text-xs sm:text-sm">
                            {new Date(subscriber.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-500 text-xs sm:text-sm">Referral Code:</span>
                          <span className="font-mono text-xs sm:text-sm bg-gray-100 px-2 py-1 rounded truncate max-w-[50%]">
                            {subscriber.referral_code}
                          </span>
                        </div>

                        {subscriber.commission_earned && (
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-500 text-xs sm:text-sm">Commission Earned:</span>
                            <span className="font-semibold text-sm sm:text-base text-green-600">
                              ${subscriber.commission_earned}
                            </span>
                          </div>
                        )}

                        {subscriber.business_revenue && (
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-500 text-xs sm:text-sm">Revenue Generated:</span>
                            <span className="font-semibold text-sm sm:text-base text-blue-600">
                              ${subscriber.business_revenue}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Referral Link */}
                      <div className="mb-3 sm:mb-4">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                          Referral Link
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={subscriber.referral_link}
                            readOnly
                            className="w-full px-2 sm:px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-xs sm:text-sm font-mono pr-8"
                          />
                          <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 flex-shrink-0" />
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleCopyUrl(subscriber.referral_link)}
                        className="w-full btn-secondary flex items-center justify-center space-x-2 text-xs sm:text-sm py-2 sm:py-2.5"
                      >
                        <ClipboardIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Copy Referral Link</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MySubscribersPage;