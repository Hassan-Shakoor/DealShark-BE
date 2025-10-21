import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { dealsService } from '../../services';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
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
  ArrowTrendingDownIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

const BusinessDealsPage = () => {
  const { user, business } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMyDeals();
  }, []);

  const fetchMyDeals = async () => {
    try {
      setLoading(true);
      const result = await dealsService.getMyDeals();

      if (result.success) {
        setDeals(result.deals || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  // Calculate business stats
  const totalSubscribers = deals.reduce((sum, deal) => sum + (deal.subscription_count || 0), 0);
  const totalRevenue = deals.reduce((sum, deal) => sum + (deal.business_revenue || 0), 0);
  const activeDeals = deals.length;
  const avgSubscribersPerDeal = activeDeals > 0 ? Math.round(totalSubscribers / activeDeals) : 0;

  const businessStats = [
    {
      label: 'Total Subscribers',
      value: totalSubscribers.toLocaleString(),
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+12%',
      changeType: 'positive'
    },
    {
      label: 'Active Deals',
      value: activeDeals,
      icon: ChartBarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+2',
      changeType: 'positive'
    },
    {
      label: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+8%',
      changeType: 'positive'
    },
    {
      label: 'Avg. Subscribers/Deal',
      value: avgSubscribersPerDeal,
      icon: ArrowTrendingUpIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+5%',
      changeType: 'positive'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your deals...</p>
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
                <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br ${business?.business_logo_url ? 'bg-white border border-gray-300' : 'from-dealshark-blue to-blue-600'} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  {business?.business_logo_url ? (
                    <img
                      src={business.business_logo_url}
                      alt={business.business_name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl object-contain"
                    />
                  ) : (
                    <BuildingOfficeIcon className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white" />
                  )}
                </div>

                {/* Business Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 truncate">
                    {business?.business_name || 'My Business'}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-600">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <GlobeAltIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm">{business?.industry || 'Business'}</span>
                    </div>
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <MapPinIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{business?.business_city}, {business?.business_state}, {business?.business_country}</span>
                    </div>
                    {business?.is_verified && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        <StarIcon className="h-2 w-2 sm:h-3 sm:w-3" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Create Deal Button */}
              <Link
                to="/create-deal"
                className="btn-primary flex items-center justify-center space-x-2 animate-fade-in-up w-full lg:w-auto text-sm sm:text-base py-2.5 sm:py-3"
              >
                <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Create New Deal</span>
              </Link>
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
                  <div className={`flex items-center space-x-1 text-xs sm:text-sm font-medium ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stat.changeType === 'positive' ? (
                      <ArrowTrendingUpIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Business Details Card */}
          <div className="business-details-card auth-card mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Business Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="detail-item">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-gray-900">Email</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base break-all">{business?.email || 'Not provided'}</p>
              </div>

              <div className="detail-item">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-gray-900">Phone</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{business?.phone_number || 'Not provided'}</p>
              </div>

              <div className="detail-item">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-gray-900">Website</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base break-all">
                  {business?.website ? (
                    <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-dealshark-blue hover:underline">
                      {business.website}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>

              <div className="detail-item">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <MapPinIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-gray-900">Address</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{business?.business_address || 'Not provided'}</p>
              </div>

              <div className="detail-item">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <BuildingOfficeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-gray-900">Registration</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{business?.registration_no || 'Not provided'}</p>
              </div>

              <div className="detail-item">
                <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                  <span className="font-medium text-sm sm:text-base text-gray-900">Industry</span>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{business?.industry || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Deals Section */}
          <div className="deals-section auth-card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">My Deals</h2>
              <div className="text-xs sm:text-sm text-gray-600">
                {deals.length} {deals.length === 1 ? 'deal' : 'deals'} total
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="error-message mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Deals Grid */}
            {deals.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <PlusIcon className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 px-4">No deals yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-md mx-auto px-4">
                  Create your first deal to start attracting customers and growing your business through referrals.
                </p>
                <Link
                  to="/create-deal"
                  className="btn-primary inline-flex items-center justify-center space-x-2 text-sm sm:text-base py-2.5 sm:py-3 px-4 sm:px-6"
                >
                  <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Create Your First Deal</span>
                </Link>
              </div>
            ) : (
              <div className="deals-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {deals.map((deal, index) => (
                  <div key={deal.id} className={`deal-card bg-white rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up delay-${(index + 1) * 100}`}>
                    <div className="p-4 sm:p-6">
                      {/* Deal Header */}
                      <div className="flex items-start justify-between mb-3 sm:mb-4 gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 line-clamp-2 flex-1">
                          {deal.deal_name}
                        </h3>
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 ${deal.reward_type === 'commission'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                          }`}>
                          {deal.reward_type === 'commission' ? 'Commission' : 'No Reward'}
                        </span>
                      </div>

                      {/* Deal Description */}
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">
                        {deal.deal_description}
                      </p>

                      {/* Deal Stats */}
                      <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                        {deal.reward_type === 'commission' && (
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-gray-500 text-xs sm:text-sm">Customer Incentive:</span>
                            <span className="font-semibold text-sm sm:text-base text-green-600">
                              {deal.customer_incentive}%
                            </span>
                          </div>
                        )}

                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-500 text-xs sm:text-sm">Subscribers:</span>
                          <div className="flex items-center space-x-1">
                            <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                            <span className="font-semibold text-sm sm:text-base">{deal.subscription_count || 0}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-500 text-xs sm:text-sm">Created:</span>
                          <span className="font-medium text-xs sm:text-sm">
                            {new Date(deal.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between items-center gap-2">
                          <span className="text-gray-500 text-xs sm:text-sm">Status:</span>
                          <span className={`font-medium text-xs ${deal.is_active ? 'text-green-600 bg-green-100 px-2 sm:px-3 py-1 rounded-full' : 'text-red-600 bg-red-100 px-2 sm:px-3 py-1 rounded-full'}`}>
                            {deal.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Link
                          to={`/update-deal/${deal.id}`}
                          className="flex-1 bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
                        >
                          <PencilSquareIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Edit</span>
                        </Link>
                        <Link
                          to={`/deal/${deal.id}`}
                          className="flex-1 btn-secondary flex items-center justify-center space-x-2 text-xs sm:text-sm py-2 sm:py-2.5 px-3 sm:px-4"
                        >
                          <EyeIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>View</span>
                        </Link>
                      </div>
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

export default BusinessDealsPage;