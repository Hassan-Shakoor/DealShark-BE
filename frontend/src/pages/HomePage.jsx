import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dealsService, referralsService } from '../services';
import SignInModal from '../components/common/SignInModal';
import {
  MagnifyingGlassIcon,
  StarIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  CurrencyDollarIcon,
  GiftIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import HowItWorksSection from '../components/sections/HowItWorksSection';
import PartnersSection from '../components/sections/PartnersSection';

// Import mascot images
import speakerMascot from '../assets/images/speaker-mascot.webp';
import businessMascot from '../assets/images/business-mascot.webp';
import waitingMascot from '../assets/images/waiting-mascot.webp';
import carSharkMascot from '../assets/images/car-shark-mascot.webp';
import girlHoldingPhone from '../assets/images/girl-shark-holding-phone.webp';
import promotionalMascot from '../assets/images/promotional-mascot.webp';
import shoppingMascots from '../assets/images/shopping-mascots.webp';
import lastChanceDealsMascot from '../assets/images/last-chance-deals.webp';

const HomePage = () => {
  const { isAuthenticated, userType, user, business } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingOnboardingStatus, setLoadingOnboardingStatus] = useState(true);
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [showSignInModal, setShowSignInModal] = useState(false);

  useEffect(() => {
    fetchDeals();
    fetchSubscriptionsStatus();
  }, []);

  const fetchSubscriptionsStatus = async () => {
    try {
      setLoadingOnboardingStatus(true);
      const result = await referralsService.getOnboardingStatus();
      if (result.success) {
        setOnboardingStatus(result?.status);
      }
    } catch (error) {
      console.error('Error fetching subscriptions status:', error);
    } finally {
      setLoadingOnboardingStatus(false);
    }
  };

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const result = await dealsService.getAllDeals();

      if (result?.deals) {
        // Take only the first 6 deals for homepage
        setDeals(result.deals.slice(0, 6));
      } else {
        console.error('Failed to fetch deals:', result.error);
      }
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to deals page with search query
      navigate(`/deals?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleDealClick = (dealId) => {
    if (!isAuthenticated) {
      setShowSignInModal(true);
    } else {
      navigate(`/deal/${dealId}`);
    }
  };

  const getDealIcon = (industry) => {
    const icons = {
      'Food': '🍽️',
      'Electronics': '📱',
      'Fashion': '👗',
      'Beauty': '💄',
      'Fitness': '💪',
      'Travel': '✈️',
      'Home': '🏠',
      'Books': '📚',
      'Crafting': '🎨',
      'Automotive': '🚗',
      'Sports': '⚽',
      'Health': '🏥',
      'Education': '📚',
      'Entertainment': '🎬'
    };
    return icons[industry] || '🛍️';
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

  const stats = [
    { label: 'Active Users', value: '10K+', icon: UsersIcon },
    { label: 'Partner Brands', value: '500+', icon: StarIcon },
    { label: 'Total Earnings', value: '$50K+', icon: ArrowTrendingUpIcon }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Payment Account Alert for Business Users */}
      {isAuthenticated && userType === 'business' && business && !onboardingStatus?.details_submitted && !loadingOnboardingStatus && (
        <div className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-yellow-50 border-b-2 sm:border-b-4 border-yellow-400 px-3 sm:px-4 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-start sm:items-center space-x-3 sm:space-x-4 flex-1">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
                    <ExclamationTriangleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-900" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-yellow-900 font-semibold text-sm sm:text-base md:text-lg">
                    Connect the Payment Account to make your Deals Active
                  </p>
                  <p className="text-yellow-700 text-xs sm:text-sm mt-1">
                    Set up your payment method to start receiving referral payments
                  </p>
                </div>
              </div>
              <div className="flex-shrink-0 w-full sm:w-auto">
                <Link
                  to="/profile"
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
                >
                  <span>Connect Now</span>
                  <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-dealshark-blue via-blue-700 to-dealshark-blue py-10 sm:py-12 md:py-16 lg:py-24 px-3 sm:px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-dealshark-yellow rounded-full"></div>
          <div className="absolute top-32 right-20 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-dealshark-yellow rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12">
            {/* Left Side - Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[5.2rem] font-bold text-white leading-[1.1] mb-4 tracking-[-1px]">
                UNLOCK <span className="text-dealshark-yellow drop-shadow-lg">EXCLUSIVE</span> DEALS
                <br />
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">EARN WHILE YOU SAVE</span>
                <br />
                <span className="text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium">WITH TOP BRANDS</span>
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0">
                Transform your shopping experience into a profitable venture. Access premium discounts, earn referral commissions, and discover exclusive offers from leading brands worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Link
                  to="/deals"
                  className="bg-dealshark-yellow text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Discover Deals
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-white text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-dealshark-blue transition-all duration-300"
                >
                  Start Earning
                </Link>
              </div>
            </div>

            {/* Right Side - Business Mascot */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                {/* Business Mascot */}
                <div className="relative">
                  <img
                    src={carSharkMascot}
                    alt="DealShark Car Mascot"
                    className="w-64 sm:w-72 md:w-80 lg:w-96 xl:w-[28rem] h-auto drop-shadow-2xl"
                  // style={{ transform: 'scaleX(-1)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <HowItWorksSection />

      {/* Partners Section */}
      <PartnersSection />

      {/* Search Bar Section */}
      <section className="bg-white py-8 sm:py-6 md:py-8 px-3 sm:px-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex gap-2 md:block md:gap-0">
          <div className="flex-shrink-0 block md:hidden">
            <div className="relative transform hover:scale-110 transition-transform duration-300">
              <img
                src={girlHoldingPhone}
                alt="Girl Holding Phone"
                className="w-18 md:w-20 lg:w-24 h-auto mr-2"
              />
              {/* Floating question mark */}
              {/* <div className="absolute -top-2 -right-2 text-2xl">❓</div> */}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center md:justify-between gap-4 sm:gap-6">
            {/* Left Side - Customer Service Mascot */}
            <div className="flex-shrink-0 hidden md:block">
              <div className="relative transform hover:scale-110 transition-transform duration-300">
                <img
                  src={girlHoldingPhone}
                  alt="Girl Holding Phone"
                  className="w-18 md:w-20 lg:w-24 h-auto mr-2"
                />
                {/* Floating question mark */}
                {/* <div className="absolute -top-2 -right-2 text-2xl">❓</div> */}
              </div>
            </div>

            {/* Center - Search Bar */}
            <div className="md:flex-1 w-full max-w-2xl">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search deals on DealShark"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-24 sm:pr-28 text-sm sm:text-base md:text-lg rounded-lg sm:rounded-xl border-2 border-gray-200 focus:outline-none focus:border-dealshark-blue focus:ring-4 focus:ring-blue-100 transition-all duration-300 shadow-md"
                  />
                  {/* Clear Button - Shows when there's text */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-14 sm:right-16 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-all duration-300"
                    >
                      <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </button>
                  )}
                  {/* Search Button */}
                  <button
                    type="submit"
                    className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-dealshark-blue text-white p-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                  >
                    <MagnifyingGlassIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Side - Description */}
            <div className="flex-shrink-0 text-center lg:text-left">
              <p className="text-gray-600 text-xs sm:text-sm lg:text-base font-medium">
                Your gateway to premium discounts and earning opportunities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Logos Section */}
      <section className="py-10 sm:py-12 md:py-16 px-3 sm:px-4 bg-gradient-to-r from-white via-gray-50 to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 sm:w-40 sm:h-40 border-2 border-dealshark-blue rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 sm:w-32 sm:h-32 border-2 border-dealshark-yellow rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 border-2 border-green-500 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <StarIcon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
            </div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Trusted by <span className="text-dealshark-blue">Top Brands</span>
            </h3>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Shop with confidence from these verified partners who trust DealShark for their referral programs
            </p>
          </div>

          <div className="relative">
            {/* Gradient overlays for scroll effect */}
            <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-16 md:w-20 bg-gradient-to-l from-white to-transparent z-10"></div>

            <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 md:gap-8 lg:gap-12 py-6 sm:py-8">
              {[
                { name: 'Walmart', color: 'from-blue-600 to-blue-800' },
                { name: 'eBay', color: 'from-green-600 to-green-800' },
                { name: 'Amazon', color: 'from-orange-500 to-orange-700' },
                { name: 'Target', color: 'from-red-500 to-red-700' },
                { name: 'Best Buy', color: 'from-yellow-500 to-yellow-700' }
              ].map((brand, index) => (
                <div
                  key={brand.name}
                  className="group relative"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r ${brand.color} bg-clip-text text-transparent hover:scale-110 transition-all duration-300 cursor-pointer px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-gray-50 hover:shadow-lg`}>
                    {brand.name}
                  </div>
                  {/* Hover effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-dealshark-blue/10 to-blue-600/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              ))}

              {/* View More Button */}
              <div className="group ml-2 sm:ml-4 md:ml-8">
                <div className="flex items-center space-x-1 sm:space-x-2 text-dealshark-blue hover:text-blue-700 transition-colors duration-300 cursor-pointer px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-50 hover:shadow-lg">
                  <span className="font-semibold text-sm sm:text-base md:text-lg">View All</span>
                  <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span>SSL Secured</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Verified Partners</span>
              </div>
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Leaving Soon Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-dealshark-blue via-blue-600 to-dealshark-blue relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-20 h-20 sm:w-24 sm:h-24 bg-dealshark-yellow rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-16 h-16 sm:w-20 sm:h-20 bg-dealshark-yellow rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>

          {/* Additional geometric shapes */}
          <div className="absolute top-1/4 left-1/3 w-8 h-8 sm:w-12 sm:h-12 bg-white/20 rotate-45 animate-spin" style={{ animationDuration: '25s' }}></div>
          <div className="absolute bottom-1/4 right-1/4 w-6 h-6 sm:w-10 sm:h-10 bg-dealshark-yellow/20 rotate-45 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
          <div className="absolute top-1/2 left-1/6 w-4 h-4 sm:w-6 sm:h-6 bg-white/30 rounded-full animate-bounce"></div>
          <div className="absolute bottom-1/3 right-1/6 w-3 h-3 sm:w-5 sm:h-5 bg-dealshark-yellow/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
              <div className="relative mr-0 sm:mr-6 mb-4 sm:mb-0">
                {/* Background decorative elements */}
                <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8">
                  {/* Outer ring */}
                  {/* <div className="absolute inset-0 border-2 border-dealshark-yellow/30 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div> */}
                  {/* <div className="absolute inset-2 sm:inset-3 lg:inset-3 border border-white/40 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div> */}

                  {/* Floating geometric shapes */}
                  {/* <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 bg-dealshark-yellow rounded-full animate-bounce"></div>
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-dealshark-yellow rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-2">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
                  </div>
                   */}
                  {/* Corner accent shapes */}
                  {/* <div className="absolute top-2 left-2 w-1 h-1 sm:w-2 sm:h-2 bg-dealshark-yellow rotate-45"></div>
                  <div className="absolute top-2 right-2 w-1 h-1 sm:w-2 sm:h-2 bg-white rotate-45"></div>
                  <div className="absolute bottom-2 left-2 w-1 h-1 sm:w-2 sm:h-2 bg-white rotate-45"></div>
                  <div className="absolute bottom-2 right-2 w-1 h-1 sm:w-2 sm:h-2 bg-dealshark-yellow rotate-45"></div> */}
                </div>

                {/* Main mascot */}
                <img
                  src={lastChanceDealsMascot}
                  alt="DealShark Last Chance Deals Mascot"
                  className="relative z-10 w-20 sm:w-24 lg:w-32 h-auto transform hover:scale-110 transition-transform duration-500 drop-shadow-lg"
                />

                {/* Urgency indicators */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 z-20">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 z-20">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 bg-dealshark-yellow rounded-full flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '0.3s' }}>
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-900 rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
                  Deals <span className="text-dealshark-yellow">Leaving Soon</span>
                </h2>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <div className="w-8 sm:w-10 md:w-12 h-0.5 sm:h-1 bg-dealshark-yellow rounded-full"></div>
                  <div className="w-6 sm:w-7 md:w-8 h-0.5 sm:h-1 bg-white rounded-full"></div>
                  <div className="w-3 sm:w-4 h-0.5 sm:h-1 bg-dealshark-yellow rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto font-medium px-4">
              Don't miss out on these amazing deals! Limited time offers that are ending soon.
              <span className="text-dealshark-yellow font-bold"> Act fast!</span>
            </p>
          </div>

          {/* Offers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden animate-pulse border border-gray-100">
                  <div className="p-4 sm:p-6 md:p-8 pb-4 sm:pb-6">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
                      <div className="w-16 sm:w-20 h-5 sm:h-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="w-20 sm:w-24 h-4 sm:h-5 bg-gray-200 rounded-full mb-4 sm:mb-6"></div>
                    <div className="w-full h-3 sm:h-4 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                    <div className="w-4/5 h-3 sm:h-4 bg-gray-200 rounded mb-4 sm:mb-6"></div>
                    <div className="w-24 sm:w-28 h-7 sm:h-8 bg-gray-200 rounded-full mb-4 sm:mb-6"></div>
                    <div className="w-full h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : deals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {deals.slice(0, 6).map((deal, index) => (
                <div
                  key={deal.id}
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden cursor-pointer border border-gray-100 hover:border-dealshark-blue/20"
                  onClick={() => handleDealClick(deal.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header with Gradient */}
                  <div className="relative p-4 sm:p-6 md:p-8 pb-2 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="relative">
                        <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br ${deal.business?.business_logo_url ? 'white border border-gray-300' : 'from-dealshark-blue to-blue-600'} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                          {deal.business?.business_logo_url ? (
                            <img
                              src={deal.business.business_logo_url}
                              alt={deal.business.business_name}
                              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl object-contain"
                            />
                          ) : (
                            <span className="text-white text-2xl sm:text-2xl md:text-3xl">
                              {getDealIcon(deal.business?.industry)}
                            </span>
                          )}
                        </div>
                        {/* Urgent timer icon */}
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                          ⏰
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full flex items-center font-bold shadow-lg animate-pulse">
                        <span className="hidden sm:inline">ENDING SOON</span>
                        <span className="sm:hidden">SOON</span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-dealshark-blue to-blue-600 text-white text-xs sm:text-sm rounded-full font-semibold shadow-lg">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
                      {deal.business?.industry || 'General'}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 md:p-8 pt-3 sm:pt-4">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-2 line-clamp-1 group-hover:text-dealshark-blue transition-colors duration-300">
                      {deal.business?.business_name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
                      {deal.deal_name}
                    </p>

                    {/* Reward Badge */}
                    <div className="mb-4 sm:mb-6">
                      <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-bold bg-gradient-to-r ${getRewardColor(deal)} shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
                        {deal.reward_type === 'commission' ? (
                          <CurrencyDollarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        ) : (
                          <GiftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        )}
                        {getRewardDisplay(deal)}
                      </div>
                    </div>

                    {/* Subscribers */}
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                      <div className="flex -space-x-1.5 sm:-space-x-2 mr-2 sm:mr-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-dealshark-blue rounded-full border-2 border-white"></div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="font-medium">{deal.subscribers_count || 0} users joined</span>
                    </div>

                    {/* Action Button */}
                    <div className={`w-full py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base rounded-lg sm:rounded-xl font-bold text-center transition-all duration-300 transform group-hover:scale-105 shadow-lg ${deal.subscription_info?.is_subscribed
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                      : 'bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      }`}>
                      {userType === 'business' ? 'View Deal' : (deal.subscription_info?.is_subscribed ? 'View Deal' : 'Subscribe Now')}
                      <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12 md:py-16">
              <div className="relative inline-block mb-6 sm:mb-8">
                <img
                  src={promotionalMascot}
                  alt="No deals available"
                  className="w-24 sm:w-28 md:w-32 h-auto opacity-60"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 px-4">No deals ending soon</h3>
              <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4">
                All current deals are still active! Check back later for deals that are ending soon.
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-blue-200">
                <div className="w-2 h-2 bg-dealshark-yellow rounded-full animate-pulse"></div>
                <span>More deals coming soon</span>
              </div>
            </div>
          )}

          {/* View More Button */}
          <div className="text-center mt-10 sm:mt-12 md:mt-16">
            <div className="relative inline-block">
              <Link
                to="/deals"
                className="group inline-flex items-center bg-gradient-to-r from-dealshark-yellow to-yellow-400 text-gray-900 px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <span className="mr-2 sm:mr-3">View All Deals</span>
                <ArrowRightIcon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              {/* Floating elements around button */}
              <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-white rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-dealshark-yellow rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Additional info */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-blue-200 px-4">
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
                <span>Deals updated daily</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-dealshark-yellow rounded-full mr-1.5 sm:mr-2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Limited time offers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Top Offers Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-dealshark-yellow via-yellow-300 to-dealshark-yellow relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full"></div>
          <div className="absolute top-32 right-20 w-20 h-20 sm:w-24 sm:h-24 bg-gray-900 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-full"></div>
          <div className="absolute bottom-32 right-1/3 w-16 h-16 sm:w-20 sm:h-20 bg-gray-900 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-10 sm:mb-12 md:mb-16">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 sm:mb-8">
              <div className="relative mr-0 sm:mr-6 mb-4 sm:mb-0">
                <img
                  src={promotionalMascot}
                  alt="DealShark Promotional Mascot"
                  className="w-20 sm:w-24 lg:w-32 h-auto transform hover:scale-110 transition-transform duration-500 drop-shadow-lg"
                />
                {/* Floating percentage symbols */}
                {/* <div className="absolute -top-3 -right-3 text-2xl bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg">%</div>
                <div className="absolute -bottom-3 -left-3 text-xl bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">%</div>
                <div className="absolute top-4 -right-6 text-lg">🔥</div> */}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  Today's <span className="text-dealshark-blue">Hot</span> Offers
                </h2>
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <div className="w-8 sm:w-10 md:w-12 h-0.5 sm:h-1 bg-dealshark-blue rounded-full"></div>
                  <div className="w-6 sm:w-7 md:w-8 h-0.5 sm:h-1 bg-gray-900 rounded-full"></div>
                  <div className="w-3 sm:w-4 h-0.5 sm:h-1 bg-dealshark-blue rounded-full"></div>
                </div>
              </div>
            </div>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 max-w-3xl mx-auto font-medium px-4">
              Discover amazing deals from top brands and start earning commissions instantly.
              <span className="text-dealshark-blue font-bold"> Limited time offers!</span>
            </p>
          </div>

          {/* Offers Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden animate-pulse border border-gray-100">
                  <div className="p-4 sm:p-6 md:p-8 pb-4 sm:pb-6">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gray-200 rounded-xl sm:rounded-2xl"></div>
                      <div className="w-16 sm:w-20 h-5 sm:h-6 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="w-20 sm:w-24 h-4 sm:h-5 bg-gray-200 rounded-full mb-4 sm:mb-6"></div>
                    <div className="w-full h-3 sm:h-4 bg-gray-200 rounded mb-2 sm:mb-3"></div>
                    <div className="w-4/5 h-3 sm:h-4 bg-gray-200 rounded mb-4 sm:mb-6"></div>
                    <div className="w-24 sm:w-28 h-7 sm:h-8 bg-gray-200 rounded-full mb-4 sm:mb-6"></div>
                    <div className="w-full h-10 sm:h-12 bg-gray-200 rounded-lg sm:rounded-xl"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : deals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {deals.map((deal, index) => (
                <div
                  key={deal.id}
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden cursor-pointer border border-gray-100 hover:border-dealshark-blue/20"
                  onClick={() => handleDealClick(deal.id)}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Card Header with Gradient */}
                  <div className="relative p-4 sm:p-6 md:p-8 pb-2 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex justify-between items-start mb-4 sm:mb-6">
                      <div className="relative">
                        <div className={`w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br ${deal.business?.business_logo_url ? 'white border border-gray-300' : 'from-dealshark-blue to-blue-600'} rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110`}>
                          {deal.business?.business_logo_url ? (
                            <img
                              src={deal.business.business_logo_url}
                              alt={deal.business.business_name}
                              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl object-contain"
                            />
                          ) : (
                            <span className="text-white text-2xl sm:text-2xl md:text-3xl">
                              {getDealIcon(deal.business?.industry)}
                            </span>
                          )}
                        </div>
                        {/* Floating elements */}
                        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-dealshark-yellow rounded-full flex items-center justify-center text-xs font-bold text-gray-900 animate-pulse">
                          %
                        </div>
                      </div>

                      {deal.is_featured && (
                        <div className="bg-gradient-to-r from-dealshark-yellow to-yellow-400 text-gray-900 text-xs px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-full flex items-center font-bold shadow-lg animate-pulse">
                          <StarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 fill-current" />
                          <span className="hidden sm:inline">HOT DEAL</span>
                          <span className="sm:hidden">HOT</span>
                        </div>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-dealshark-blue to-blue-600 text-white text-xs sm:text-sm rounded-full font-semibold shadow-lg">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full mr-1.5 sm:mr-2 animate-pulse"></span>
                      {deal.business?.industry || 'General'}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-6 md:p-8 pt-3 sm:pt-4">
                    <h3 className="font-bold text-gray-900 text-base sm:text-lg md:text-xl mb-2 line-clamp-1 group-hover:text-dealshark-blue transition-colors duration-300">
                      {deal.business?.business_name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
                      {deal.deal_name}
                    </p>

                    {/* Reward Badge */}
                    <div className="mb-4 sm:mb-6">
                      <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-white text-xs sm:text-sm font-bold bg-gradient-to-r ${getRewardColor(deal)} shadow-lg transform group-hover:scale-105 transition-transform duration-300`}>
                        {deal.reward_type === 'commission' ? (
                          <CurrencyDollarIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        ) : (
                          <GiftIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
                        )}
                        {getRewardDisplay(deal)}
                      </div>
                    </div>

                    {/* Subscribers */}
                    <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                      <div className="flex -space-x-1.5 sm:-space-x-2 mr-2 sm:mr-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-dealshark-blue rounded-full border-2 border-white"></div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-400 rounded-full border-2 border-white"></div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <UsersIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 flex-shrink-0" />
                      <span className="font-medium">{deal.subscribers_count || 0} users joined</span>
                    </div>

                    {/* Action Button */}
                    <div className={`w-full py-3 sm:py-4 px-4 sm:px-6 text-sm sm:text-base rounded-lg sm:rounded-xl font-bold text-center transition-all duration-300 transform group-hover:scale-105 shadow-lg ${deal.subscription_info?.is_subscribed
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                      : 'bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      }`}>
                      {userType === 'business' ? 'View Deal' : (deal.subscription_info?.is_subscribed ? 'View Deal' : 'Subscribe Now')}
                      <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2 inline-block group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 sm:py-12 md:py-16">
              <div className="relative inline-block mb-6 sm:mb-8">
                <img
                  src={promotionalMascot}
                  alt="No deals available"
                  className="w-24 sm:w-28 md:w-32 h-auto opacity-60"
                />
                {/* <div className="absolute -top-3 -right-3 text-3xl">😔</div>
                <div className="absolute -bottom-3 -left-3 text-2xl">⏰</div> */}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 px-4">No deals available right now</h3>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-md mx-auto px-4">
                We're working hard to bring you amazing deals. Check back soon for exciting new offers!
              </p>
              <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
                <div className="w-2 h-2 bg-dealshark-blue rounded-full animate-pulse"></div>
                <span>New deals coming soon</span>
              </div>
            </div>
          )}

          {/* View More Button */}
          <div className="text-center mt-10 sm:mt-12 md:mt-16">
            <div className="relative inline-block">
              <Link
                to="/deals"
                className="group inline-flex items-center bg-gradient-to-r from-dealshark-blue to-blue-600 text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg md:text-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl"
              >
                <span className="mr-2 sm:mr-3">Explore All Deals</span>
                <ArrowRightIcon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              {/* Floating elements around button */}
              <div className="absolute -top-1.5 -left-1.5 sm:-top-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-dealshark-yellow rounded-full animate-bounce"></div>
              <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>

            {/* Additional info */}
            <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 px-4">
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full mr-1.5 sm:mr-2 animate-pulse"></div>
                <span>Live deals updated daily</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full mr-1.5 sm:mr-2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <span>Instant commission tracking</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 sm:py-12 md:py-16 px-3 sm:px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-24 h-24 sm:w-32 sm:h-32 bg-dealshark-blue rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-20 h-20 sm:w-24 sm:h-24 bg-dealshark-yellow rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 right-1/3 w-16 h-16 sm:w-20 sm:h-20 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 px-4">
              Trusted by <span className="text-dealshark-blue">Thousands</span> Worldwide
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Join our growing community of users and businesses who trust DealShark for their referral needs
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group text-center bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 hover:border-dealshark-blue/20"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-4 sm:mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <stat.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </div>
                  {/* Floating elements */}
                  <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-dealshark-yellow rounded-full animate-bounce"></div>
                  <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-dealshark-blue to-blue-600 bg-clip-text text-transparent mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-600 font-semibold text-base sm:text-lg group-hover:text-dealshark-blue transition-colors duration-300">
                  {stat.label}
                </div>
                {/* Progress indicator */}
                <div className="mt-3 sm:mt-4 w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                  <div
                    className="bg-gradient-to-r from-dealshark-blue to-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-1000 group-hover:animate-pulse"
                    style={{ width: `${85 + (index * 5)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-dealshark-blue to-blue-700 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-24 h-24 sm:w-32 sm:h-32 bg-dealshark-yellow rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 md:gap-12">
            {/* Left Side - Shopping Mascots */}
            <div className="lg:w-1/3 flex justify-center lg:justify-start">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <img
                  src={shoppingMascots}
                  alt="DealShark Shopping Mascots"
                  className="w-48 sm:w-56 md:w-64 lg:w-80 h-auto drop-shadow-2xl"
                />
                {/* Floating shopping elements */}
                {/* <div className="absolute top-4 -left-4 text-2xl">🛍️</div>
                <div className="absolute bottom-8 -right-4 text-2xl">🎁</div> */}
              </div>
            </div>

            {/* Right Side - CTA Content */}
            <div className="lg:w-2/3 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
                Ready to Start Earning?
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto lg:mx-0 px-4 lg:px-0">
                Join thousands of users already earning commissions through our referral platform.
                It's free to join and you can start earning immediately.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/signup"
                      className="bg-dealshark-yellow text-gray-900 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg md:text-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
                    >
                      Get Started Free
                    </Link>
                    <Link
                      to="/business-onboarding"
                      className="border-2 border-white text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg md:text-xl hover:bg-white hover:text-dealshark-blue transition-all duration-300 shadow-xl"
                    >
                      List Your Business
                    </Link>
                  </>
                ) : (
                  <Link
                    to={userType === 'customer' ? '/my-subscriptions' : '/my-subscribers'}
                    className="bg-dealshark-yellow text-gray-900 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg md:text-xl hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-xl"
                  >
                    Go to Dashboard
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sign In Modal */}
      <SignInModal
        isOpen={showSignInModal}
        onClose={() => setShowSignInModal(false)}
      />
    </div>
  );
};

export default HomePage;