import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dealsService } from '../services';
import SignInModal from '../components/common/SignInModal';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  GiftIcon,
  EyeIcon,
  SparklesIcon,
  FireIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Import mascot images
import promotionalMascot from '../assets/images/promotional-mascot.webp';
import customerServiceMascot from '../assets/images/customer-service-maskot.webp';
import shoppingMascots from '../assets/images/shopping-mascots.webp';

const DealsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedRewardType, setSelectedRewardType] = useState('all');
  const [industries, setIndustries] = useState([]);
  const [industriesLoading, setIndustriesLoading] = useState(true);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    fetchIndustries();
  }, []);

  useEffect(() => {
    // Sync search query with URL parameter
    const urlSearch = searchParams.get('search') || '';
    setSearchQuery(urlSearch);
    fetchDeals();
  }, [searchParams, selectedIndustry, selectedRewardType]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchIndustries = async () => {
    try {
      setIndustriesLoading(true);
      const result = await dealsService.getAllIndustries();
  
      if (result?.success && result?.industries) {
        setIndustries([{ value: 'all', label: 'All Industries' }, ...result.industries?.industries?.map(industry => ({
          value: industry,
          label: industry
        }))]);
      } else {
        console.error('Failed to fetch industries:', result.error);
      }
    } catch (err) {
      console.error('Error fetching industries:', err);
    } finally {
      setIndustriesLoading(false);
    }
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      
      // Get search parameters from URL
      const searchParam = searchParams.get('search') || '';
      
      // Build search params object
      const apiSearchParams = {};
      if (searchParam) {
        apiSearchParams.search = searchParam;
      }
      if (selectedIndustry && selectedIndustry !== 'all') {
        apiSearchParams.industry = selectedIndustry;
      }
      if (selectedRewardType && selectedRewardType !== 'all') {
        apiSearchParams.reward_type = selectedRewardType;
      }
      
      const result = await dealsService.getAllDeals(user?.id || null, apiSearchParams);

      if (result?.deals) {
        setDeals(result.deals || []);
      } else {
        setError(result.error);
        toast.error(result.error || 'Failed to fetch deals');
      }
    } catch (err) {
      setError('Failed to fetch deals');
      toast.error('Failed to fetch deals');
    } finally {
      setLoading(false);
    }
  };

  const rewardTypes = [
    { value: 'all', label: 'All Rewards' },
    { value: 'commission', label: 'Commission' },
    { value: 'no_reward', label: 'No Reward' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  };

  const handleDealClick = (dealId) => {
    if (!isAuthenticated) {
      setShowSignInModal(true);
    } else {
      navigate(`/deal/${dealId}`);
    }
  };

  // No client-side filtering needed - filtering is done server-side via API
  const filteredDeals = deals;

  const handleSubscribe = async (dealId) => {
    if (!user) {
      toast.error('Please login to subscribe to deals');
      return;
    }

    try {
      // Implement subscription logic here
      console.log('Subscribing to deal:', dealId);
      toast.success('Successfully subscribed to deal!');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe to deal');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRewardDisplay = (deal) => {
    if (deal.reward_type === 'commission') {
      return `${deal.customer_incentive}% Commission`;
    } else {
      return 'No Reward';
    }
  };

  const getRewardColor = (deal) => {
    if (deal.reward_type === 'commission') {
      return 'bg-gradient-to-r from-green-500 to-emerald-500';
    } else {
      return 'bg-gradient-to-r from-blue-500 to-indigo-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dealshark-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Deals</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchDeals}
            className="bg-dealshark-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Mascot */}
        <div className="mb-8 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            {/* Left Side - Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-dealshark-yellow to-yellow-400 rounded-full mb-4 shadow-lg">
                <FireIcon className="h-5 w-5 text-gray-900 mr-2" />
                <span className="text-sm font-bold text-gray-900">Hot Deals Available</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Browse <span className="text-dealshark-blue">Amazing</span> Deals
              </h1>
              <p className="text-gray-600 text-lg lg:text-xl max-w-2xl">
                Discover incredible deals from our partner businesses and start earning commissions on every referral
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">{filteredDeals.length} Live Deals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <SparklesIcon className="h-4 w-4 text-dealshark-yellow" />
                  <span className="text-sm text-gray-600">New Deals Daily</span>
                </div>
              </div>
            </div>

            {/* Right Side - Mascot */}
            <div className="lg:w-1/3 flex justify-center lg:justify-end">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src={shoppingMascots}
                  alt="DealShark Shopping Mascots"
                  className="w-64 lg:w-80 h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-dealshark-blue/5 to-blue-600/5 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-dealshark-yellow/5 to-yellow-400/5 rounded-full -ml-12 -mb-12"></div>

          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <FunnelIcon className="h-5 w-5 text-dealshark-blue mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Find Your Perfect Deal</h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSearch} className="relative group">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-dealshark-blue transition-colors" />
                  <input
                    type="text"
                    placeholder="Search deals, businesses, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-dealshark-blue/20 focus:border-dealshark-blue transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                  {/* Clear Button - Shows when there's text */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchParams({});
                      }}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all duration-300"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  )}
                </form>
              </div>

              {/* Industry Filter */}
              <div className="relative">
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  disabled={industriesLoading}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-dealshark-blue/20 focus:border-dealshark-blue transition-all duration-300 appearance-none bg-white shadow-sm hover:shadow-md cursor-pointer font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {industriesLoading ? (
                    <option value="all">Loading industries...</option>
                  ) : (
                    industries.map(industry => (
                      <option key={industry.value} value={industry.value}>
                        {industry.label}
                      </option>
                    ))
                  )}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Reward Type Filter */}
              <div className="relative">
                <select
                  value={selectedRewardType}
                  onChange={(e) => setSelectedRewardType(e.target.value)}
                  className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-dealshark-blue/20 focus:border-dealshark-blue transition-all duration-300 appearance-none bg-white shadow-sm hover:shadow-md cursor-pointer font-medium"
                >
                  {rewardTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count with Customer Service Mascot */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={customerServiceMascot}
                alt="Customer Service"
                className="w-16 h-16 transform hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-gray-600 text-lg">
                Showing <span className="font-bold text-dealshark-blue text-2xl">{filteredDeals.length}</span> deal{filteredDeals.length !== 1 ? 's' : ''}
              </p>
              {(searchQuery || selectedIndustry !== 'all' || selectedRewardType !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchParams({});
                    setSelectedIndustry('all');
                    setSelectedRewardType('all');
                  }}
                  className="text-sm text-dealshark-blue hover:text-blue-700 font-medium transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {(searchQuery || selectedIndustry !== 'all' || selectedRewardType !== 'all') && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-blue-50 rounded-full">
                <FunnelIcon className="h-4 w-4 text-dealshark-blue" />
                <span className="text-sm text-dealshark-blue font-medium">Filters active</span>
              </div>
            )}
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDeals.map((deal, index) => (
            <div
              key={deal.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Featured Badge */}
              {deal.is_featured && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center px-3 py-1.5 bg-gradient-to-r from-dealshark-yellow to-yellow-400 rounded-full shadow-lg animate-pulse">
                    <StarIcon className="h-4 w-4 text-gray-900 fill-current mr-1" />
                    <span className="text-xs font-bold text-gray-900">HOT</span>
                  </div>
                </div>
              )}

              {/* Business Header */}
              <div className="p-6 pb-4 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center mb-4">
                  <div className="relative">
                    <div className={`w-16 h-16 bg-gradient-to-br ${deal.business?.business_logo_url ? 'bg-white border border-gray-300' : 'from-dealshark-blue to-blue-600'} rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      {deal.business?.business_logo_url ? (
                        <img
                          src={deal.business.business_logo_url}
                          alt={deal.business.business_name}
                          className="w-14 h-14 rounded-xl object-contain"
                        />
                      ) : (
                        <span className="text-white text-2xl font-bold">
                          {deal.business?.business_name?.charAt(0) || 'B'}
                        </span>
                      )}
                    </div>
                    {/* Floating sparkle */}
                    {/* <div className="absolute -top-1 -right-1 w-5 h-5 bg-dealshark-yellow rounded-full flex items-center justify-center text-xs animate-bounce">
                      %
                    </div> */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate text-lg group-hover:text-dealshark-blue transition-colors">
                      {deal.business?.business_name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {deal.business?.industry}
                      </span>
                      {deal.subscription_info?.is_subscribed && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center">
                          ✓ Subscribed
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Deal Info */}
                <div className="mb-4">
                  <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 leading-tight">
                    {deal.deal_name}
                  </h4>
                  <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                    {deal.deal_description}
                  </p>
                </div>

                {/* Reward Badge */}
                <div className="mb-4">
                  <div className={`inline-flex items-center px-4 py-2.5 rounded-xl text-white text-sm font-bold ${getRewardColor(deal)} shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    {deal.reward_type === 'commission' ? (
                      <CurrencyDollarIcon className="h-5 w-5 mr-2" />
                    ) : (
                      <GiftIcon className="h-5 w-5 mr-2" />
                    )}
                    {getRewardDisplay(deal)}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="flex -space-x-2 mr-2">
                      <div className="w-6 h-6 bg-dealshark-blue rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-green-400 rounded-full border-2 border-white"></div>
                      <div className="w-6 h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                    </div>
                    <span className="font-semibold">{deal.subscribers_count || 0}</span>
                  </div>
                  <div className="text-xs text-gray-400 font-medium">
                    {formatDate(deal.created_at)}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="px-6 py-4 bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
                <button
                  onClick={() => handleDealClick(deal.id)}
                  className="flex items-center justify-center w-full bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3.5 px-4 rounded-xl font-bold transition-all duration-300 group-hover:shadow-xl transform group-hover:scale-105"
                >
                  <EyeIcon className="h-5 w-5 mr-2" />
                  {deal.subscription_info?.is_subscribed ? 'View Details' : 'View Deal'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results with Mascot */}
        {filteredDeals.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="max-w-2xl mx-auto">
              {/* Promotional Mascot */}
              <div className="relative inline-block mb-8">
                <img
                  src={promotionalMascot}
                  alt="No deals found"
                  className="w-48 h-auto mx-auto opacity-60"
                />
                <div className="absolute top-0 right-0 text-4xl animate-bounce">😔</div>
                <div className="absolute bottom-0 left-0 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🔍</div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                No Deals Found
              </h3>
              <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                We couldn't find any deals matching your search criteria. Try adjusting your filters or browse all available deals.
              </p>

              {/* Quick Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedRewardType('all');
                  }}
                  className="bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Clear All Filters
                </button>
                <Link
                  to="/"
                  className="border-2 border-dealshark-blue text-dealshark-blue hover:bg-dealshark-blue hover:text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105"
                >
                  Back to Home
                </Link>
              </div>

              {/* Suggestions */}
              <div className="bg-blue-50 rounded-2xl p-6 max-w-lg mx-auto">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Search Tips:</h4>
                <ul className="text-left text-gray-600 space-y-2 text-sm">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-dealshark-blue rounded-full mr-3"></span>
                    Try using different keywords or categories
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-dealshark-blue rounded-full mr-3"></span>
                    Check for spelling mistakes in your search
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-dealshark-blue rounded-full mr-3"></span>
                    Browse all deals to see what's available
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sign In Modal */}
      <SignInModal 
        isOpen={showSignInModal} 
        onClose={() => setShowSignInModal(false)} 
      />
    </div>
  );
};

export default DealsPage;