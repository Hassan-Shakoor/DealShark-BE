import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dealsService, referralsService } from '../services';
import {
  StarIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ShareIcon,
  ClipboardIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  FireIcon,
  ArrowLeftIcon,
  CalendarIcon,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Import mascot images
import promotionalMascot from '../assets/images/promotional-mascot.webp';
import customerServiceMascot from '../assets/images/customer-service-maskot.webp';

const DealDetailPage = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isBusiness } = useAuth();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (dealId) {
      fetchDealDetails();
    }
  }, [dealId]);

  const fetchDealDetails = async () => {
    try {
      setLoading(true);
      const result = await dealsService.getDeal(dealId, user?.id);

      if (result?.success) {
        setDeal(result.deal);
      } else {
        setError(result.error);
        toast.error(result.error || 'Failed to fetch deal details');
      }
    } catch (err) {
      setError('Failed to fetch deal details');
      toast.error('Failed to fetch deal details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    try {
      setSubscribing(true);

      if (deal.subscription_info?.is_subscribed) {
        // Unsubscribe
        const result = await referralsService.unsubscribeFromDeal(dealId, user.id);
        if (result.success) {
          toast.success('Successfully unsubscribed from deal');
          // Refresh deal data
          await fetchDealDetails();
        } else {
          toast.error(result.error || 'Failed to unsubscribe');
        }
      } else {
        // Subscribe
        const result = await referralsService.subscribeToDeal(dealId, user.id);
        if (result.success) {
          toast.success('Successfully subscribed to deal!');
          // Refresh deal data
          await fetchDealDetails();
        } else {
          toast.error(result.error || 'Failed to subscribe');
        }
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to subscribe/unsubscribe');
    } finally {
      setSubscribing(false);
    }
  };

  const copyReferralLink = async () => {
    if (deal?.subscription_info?.referral_link) {
      try {
        await navigator.clipboard.writeText(deal.subscription_info.referral_link);
        setCopied(true);
        toast.success('Referral link copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
      return 'from-green-500 to-emerald-500';
    } else {
      return 'from-blue-500 to-indigo-500';
    }
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dealshark-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  if (error || !deal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Deal Not Found</h3>
          <p className="text-gray-600 mb-4">{error || 'The deal you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/deals')}
            className="bg-dealshark-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Deals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button with enhanced styling */}
        <button
          onClick={() => navigate('/deals')}
          className="group flex items-center text-gray-600 hover:text-dealshark-blue mb-3 md:mb-6 lg:mb-8 transition-all duration-300 px-4 py-2 rounded-xl hover:bg-white hover:shadow-md"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold">Back to Deals</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Deal Header Card with Mascot */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden relative">
              {/* Featured Badge */}
              {deal.is_featured && (
                <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
                  <div className="flex items-center px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-dealshark-yellow to-yellow-400 rounded-full shadow-lg animate-pulse">
                    <FireIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-900 mr-1 md:mr-2" />
                    <span className="text-xs md:text-sm font-bold text-gray-900">HOT DEAL</span>
                  </div>
                </div>
              )}
              
              {/* Business Header */}
              <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-dealshark-blue/5 to-blue-600/5 rounded-full -mr-16 sm:-mr-24 md:-mr-32 -mt-16 sm:-mt-24 md:-mt-32"></div>
                
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 md:gap-6 mb-4 md:mb-6 max-sm:mt-6">
                    <div className="flex items-start md:items-center flex-1 w-full">
                      <div className="relative flex-shrink-0">
                        <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${deal.business?.business_logo_url ? 'bg-white border border-gray-300' : 'from-dealshark-blue to-blue-600'} rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 md:mr-6 shadow-lg md:shadow-xl transform hover:scale-110 transition-transform duration-300`}>
                          {deal.business?.business_logo_url ? (
                            <img
                              src={deal.business.business_logo_url}
                              alt={deal.business.business_name}
                              className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl object-contain"
                            />
                          ) : (
                            <span className="text-white text-2xl sm:text-3xl font-bold">
                              {deal.business?.business_name?.charAt(0) || 'B'}
                            </span>
                          )}
                        </div>
                        {/* Floating sparkle */}
                        {/* <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-dealshark-yellow rounded-full flex items-center justify-center shadow-lg animate-bounce">
                          <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 text-gray-900" />
                        </div> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2 break-words">
                          {deal.business?.business_name}
                        </h1>
                        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                          <span className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded-full font-medium">
                            {deal.business?.industry}
                          </span>
                          <div className="flex items-center text-xs sm:text-sm text-gray-500">
                            <UserGroupIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="font-semibold">{deal.business?.business_subscribers_count || 0}</span>
                            <span className="ml-1 hidden sm:inline">subscribers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Customer Service Mascot */}
                    <div className="hidden lg:block w-24 flex-shrink-0">
                      <div className="relative">
                        <img 
                          src={customerServiceMascot} 
                          alt="Customer Service" 
                          className="w-24 h-24 transform hover:scale-110 transition-transform duration-300 absolute top-2"
                        />
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Deal Title and Description */}
                  <div className="mb-4 md:mb-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 md:mb-4 leading-tight break-words">
                      {deal.deal_name}
                    </h2>
                    <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                      {deal.deal_description}
                    </p>
                  </div>

                  {/* Reward Badge */}
                  <div className="mb-4 md:mb-6">
                    <div className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-white text-sm sm:text-base font-bold bg-gradient-to-r ${getRewardColor(deal)} shadow-lg sm:shadow-xl transform hover:scale-105 transition-transform duration-300`}>
                      {deal.reward_type === 'commission' ? (
                        <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                      ) : (
                        <GiftIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                      )}
                      <span className="break-words">{deal.poster_text}</span>
                    </div>
                  </div>

                  {/* Deal Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                    <div className="text-center p-3 sm:p-4 md:p-5 bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-dealshark-blue" />
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-dealshark-blue to-blue-600 bg-clip-text text-transparent">
                        {deal.subscribers_count || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Subscribers</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 md:p-5 bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <UserGroupIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-green-600" />
                      </div>
                      <div className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {deal.business?.business_subscribers_count || 0}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1 hidden sm:block">Business Total</div>
                      <div className="text-xs text-gray-600 font-medium mt-1 sm:hidden">Total</div>
                    </div>
                    <div className={`text-center p-3 sm:p-4 md:p-5 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border ${deal.is_active ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200'}`}>
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${deal.is_active ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                      </div>
                      <div className={`text-base sm:text-lg font-bold px-2 sm:px-3 py-1 mx-auto w-fit rounded-full ${deal.is_active ? 'text-green-700' : 'text-red-700'}`}>
                        {deal.is_active ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Status</div>
                    </div>
                    <div className="text-center p-3 sm:p-4 md:p-5 bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                      <div className="flex items-center justify-center mb-1 sm:mb-2">
                        <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-purple-600" />
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-gray-900 mt-1 break-words">
                        {formatDate(deal.created_at)}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600 font-medium mt-1">Created</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Information Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 md:p-8">
              <div className="flex items-center mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                  <GlobeAltIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Business Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 flex items-center">
                    <div className="w-2 h-2 bg-dealshark-blue rounded-full mr-2 flex-shrink-0"></div>
                    Contact Details
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
                      <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 font-medium">Email</p>
                        <p className="text-xs sm:text-sm text-gray-900 font-medium break-all">{deal.business?.business_email}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
                      <PhoneIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                        <p className="text-xs sm:text-sm text-gray-900 font-medium break-all">{deal.business?.business_phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl hover:bg-gray-100 transition-colors">
                      <GlobeAltIcon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-gray-500 font-medium">Website</p>
                        <a
                          href={deal.business?.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs sm:text-sm text-dealshark-blue hover:text-blue-700 font-medium hover:underline break-all"
                        >
                          {deal.business?.website}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-3 sm:mb-4 flex items-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full mr-2 flex-shrink-0"></div>
                    Deal Details
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg sm:rounded-xl border border-blue-100">
                      <p className="text-xs text-gray-600 font-medium mb-1">Reward Type</p>
                      <p className="text-xs sm:text-sm text-gray-900 font-bold capitalize">{deal.reward_type.replace('_', ' ')}</p>
                    </div>
                    {/* {deal.no_reward_reason && (
                      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                        <p className="text-xs text-gray-600 font-medium mb-1">Reason</p>
                        <p className="text-sm text-gray-900 font-bold capitalize">{deal.no_reward_reason.replace('_', ' ')}</p>
                      </div>
                    )}
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-xs text-gray-600 font-medium mb-1">Poster Text</p>
                      <p className="text-sm text-gray-900 font-bold">{deal.poster_text}</p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar with Mascot */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {/* Promotional Mascot Card */}
            <div className="bg-gradient-to-br from-dealshark-yellow via-yellow-300 to-dealshark-yellow rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
              <div className="relative z-10 text-center">
                <img 
                  src={promotionalMascot} 
                  alt="Promotional Mascot" 
                  className="w-24 sm:w-32 h-auto mx-auto mb-3 sm:mb-4 transform hover:scale-110 transition-transform duration-300"
                />
                {isBusiness ? (
                  <>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">
                      Business Deal Overview
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-800">
                      View deal details and see how customers can help promote your business
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2">
                      Start Earning Today!
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-800">
                      Subscribe now and get your unique referral link to start earning commissions
                    </p>
                  </>
                )}
              </div>
            </div>
            
            {/* Action Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-4 sm:p-6 lg:sticky lg:top-8">
              {/* Business User Notice */}
              {isBusiness ? (
                <div className="mb-4 sm:mb-6">
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 shadow-sm">
                    <div className="flex items-center mb-2 sm:mb-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                        <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div>
                        <span className="font-bold text-orange-900 text-sm sm:text-base md:text-lg block">Business Account</span>
                        <span className="text-xs sm:text-sm text-orange-700">View Only</span>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-orange-700 leading-relaxed">
                      Businesses cannot subscribe to deals. Only customers can subscribe and earn commissions by referring others.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Subscription Status */}
                  {deal.subscription_info?.is_subscribed ? (
                    <div className="mb-4 sm:mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 shadow-sm">
                        <div className="flex items-center mb-2 sm:mb-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                            <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-green-900 text-sm sm:text-base md:text-lg block">Subscribed!</span>
                            <span className="text-xs sm:text-sm text-green-700">You're earning from this deal</span>
                          </div>
                        </div>
                      </div>

                      {/* Referral Information */}
                      <div className="mb-4 sm:mb-6">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-2 sm:mb-3 flex items-center">
                          <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue mr-2 flex-shrink-0" />
                          Your Referral Link
                        </h4>
                        <div className="flex items-center space-x-2 mb-2 sm:mb-3">
                          <input
                            type="text"
                            value={deal.subscription_info.referral_link}
                            readOnly
                            className="flex-1 min-w-0 px-2 sm:px-3 md:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-xs sm:text-sm bg-gray-50 font-mono"
                          />
                          <button
                            onClick={copyReferralLink}
                            className="p-2 sm:p-3 bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex-shrink-0"
                          >
                            {copied ? (
                              <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            ) : (
                              <ClipboardIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            )}
                          </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg sm:rounded-xl p-2 sm:p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 font-medium mb-1">Referral Code</p>
                          <p className="font-mono font-bold text-sm sm:text-base text-gray-900 break-all">{deal.subscription_info.referral_code}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4 sm:mb-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 mb-4 sm:mb-6 shadow-sm">
                        <div className="flex items-center mb-2 sm:mb-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
                            <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <div>
                            <span className="font-bold text-blue-900 text-sm sm:text-base md:text-lg block">Not Subscribed</span>
                            <span className="text-xs sm:text-sm text-blue-700">Subscribe to start earning!</span>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                          Get your unique referral link and earn commissions on every referral.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3 sm:space-y-4">
                    <button
                      onClick={handleSubscribe}
                      disabled={subscribing}
                      className={`w-full py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${deal.subscription_info?.is_subscribed
                        ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white'
                        : 'bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                        } ${subscribing ? 'opacity-50 cursor-not-allowed transform-none' : ''}`}
                    >
                      {subscribing ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                          <span className="text-sm sm:text-base">{deal.subscription_info?.is_subscribed ? 'Unsubscribing...' : 'Subscribing...'}</span>
                        </div>
                      ) : (
                        deal.subscription_info?.is_subscribed ? 'Unsubscribe' : 'Subscribe Now'
                      )}
                    </button>

                    {deal.subscription_info?.is_subscribed && (
                      <button
                        onClick={copyReferralLink}
                        className="w-full py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-900 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md hover:shadow-lg"
                      >
                        <ShareIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                        <span className="text-sm sm:text-base">Share Referral Link</span>
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* How it works - Only show for customers */}
              {!isBusiness && (
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg flex items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-lg flex items-center justify-center mr-2 flex-shrink-0">
                      <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    How it Works
                  </h4>
                  <div className="space-y-2 sm:space-y-3">
                    {[
                      { icon: '1️⃣', text: 'Share your referral link with friends' },
                      { icon: '2️⃣', text: 'When they make a purchase, you earn' },
                      { icon: '3️⃣', text: 'Track your earnings in your profile' },
                      { icon: '4️⃣', text: 'Withdraw your earnings anytime' }
                    ].map((step, index) => (
                      <div key={index} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 bg-gradient-to-r from-gray-50 to-white rounded-lg sm:rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                        <span className="text-xl sm:text-2xl flex-shrink-0">{step.icon}</span>
                        <p className="text-xs sm:text-sm text-gray-700 font-medium pt-0.5 sm:pt-1">{step.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-[#00000040] flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-md w-full">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-dealshark-blue rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <ExclamationTriangleIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Login Required</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                  You need to login first to subscribe to deals and start earning commissions.
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="w-full sm:flex-1 py-2.5 sm:py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full sm:flex-1 py-2.5 sm:py-2 px-4 bg-dealshark-blue hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors text-sm sm:text-base"
                  >
                    Login Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealDetailPage;