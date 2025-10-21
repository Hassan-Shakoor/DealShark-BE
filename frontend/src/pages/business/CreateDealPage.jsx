import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dealsService } from '../../services';
import { 
  SparklesIcon, 
  GiftIcon, 
  CurrencyDollarIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Import mascot images
import createOfferMascot from '../../assets/images/create-offer-mascot.webp';

const CreateDealPage = () => {
  const navigate = useNavigate();
  const { user, userType } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    dealTitle: '',
    dealDescription: '',
    dealType: '', // 'commission' or 'non-commission'
    customerIncentive: '',
    noRewardReason: '',
    dealPosterOptions: '',
  });

  const [errors, setErrors] = useState({});
  const [dealPosterOptions, setDealPosterOptions] = useState({
    commission_based: [],
    no_reward_based: []
  });
  const [loadingPosterOptions, setLoadingPosterOptions] = useState(false);

  // Redirect if not business user
  useEffect(() => {
    if (userType !== 'business') {
      navigate('/login');
    }
  }, [userType, navigate]);

  // Fetch deal poster options on component mount
  useEffect(() => {
    fetchDealPosterOptions();
  }, []);

  const fetchDealPosterOptions = async () => {
    try {
      setLoadingPosterOptions(true);
      const result = await dealsService.getDealPosterOptions();

      if (result.success) {
        setDealPosterOptions(result.options);
      } else {
        console.error('Failed to fetch deal poster options:', result.error);
        // Set default options as fallback
        setDealPosterOptions({
          commission_based: [
            "Earn {incentive}% commission by sharing this deal!",
            "Invite friends and get ${incentive} reward!",
            "Refer and earn {incentive} on every sale."
          ],
          no_reward_based: [
            "This discount is big enough to share!",
            "Exclusive / Limited offer — don't miss it!",
            "High-demand deal — share with your friends!"
          ]
        });
      }
    } catch (error) {
      console.error('Error fetching deal poster options:', error);
      // Set default options as fallback
      setDealPosterOptions({
        commission_based: [
          "Earn {incentive}% commission by sharing this deal!",
          "Invite friends and get ${incentive} reward!",
          "Refer and earn {incentive} on every sale."
        ],
        no_reward_based: [
          "This discount is big enough to share!",
          "Exclusive / Limited offer — don't miss it!",
          "High-demand deal — share with your friends!"
        ]
      });
    } finally {
      setLoadingPosterOptions(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.dealTitle.trim()) {
      newErrors.dealTitle = 'Deal/Offer title is required';
    }

    if (!formData.dealDescription.trim()) {
      newErrors.dealDescription = 'Deal/Offer description is required';
    }

    if (!formData.dealType) {
      newErrors.dealType = 'Please select a deal type';
    }

    if (formData.dealType === 'commission') {
      if (!formData.customerIncentive) {
        newErrors.customerIncentive = 'Customer incentive is required for commission deals';
      }
    } else if (formData.dealType === 'non-commission') {
      if (!formData.noRewardReason) {
        newErrors.noRewardReason = 'Please select a reason for no reward';
      }
    }

    if (!formData.dealPosterOptions) {
      newErrors.dealPosterOptions = 'Please select a deal poster option';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const dealData = {
        deal_name: formData.dealTitle.trim(),
        deal_description: formData.dealDescription.trim(),
        poster_text: formData.dealPosterOptions,
      };

      // Add type-specific fields
      if (formData.dealType === 'commission') {
        dealData.reward_type = 'commission';
        dealData.customer_incentive = parseFloat(formData.customerIncentive);
      } else {
        dealData.reward_type = 'no_reward';
        dealData.no_reward_reason = formData.noRewardReason;
      }

      // Call the create deal API
      const result = await dealsService.createDeal(dealData);

      if (result.success) {
        toast.success('Deal created successfully!');
        navigate('/business/deals'); // Redirect to deals list
      } else {
        toast.error(result.error || 'Failed to create deal');
      }
    } catch (error) {
      console.error('Create deal error:', error);
      toast.error('Failed to create deal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-6 sm:py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/business/deals')}
          className="group flex items-center text-gray-600 hover:text-dealshark-blue mb-6 sm:mb-8 transition-all duration-300 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl hover:bg-white hover:shadow-md"
        >
          <ArrowLeftIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="font-semibold text-sm sm:text-base">Back to My Deals</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Side - Mascot & Info */}
          <div className="lg:col-span-1">
            {/* Promotional Mascot Card */}
            <div className="lg:sticky lg:top-8">
              <div className="bg-gradient-to-br from-dealshark-yellow via-yellow-300 to-dealshark-yellow rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                <div className="relative z-10 text-center">
                <img 
                  src={createOfferMascot} 
                  alt="Create Deal Mascot" 
                  className="w-32 sm:w-36 md:w-40 h-auto mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300"
                />
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Create Your Deal
                </h3>
                <p className="text-xs sm:text-sm text-gray-800 mb-4 sm:mb-6 leading-relaxed">
                  Create compelling offers that drive customer acquisition and maximize your referral program's ROI
                </p>
                
                {/* Benefits */}
                <div className="space-y-2 sm:space-y-3 text-left">
                  <div className="flex items-start space-x-2 sm:space-x-3 bg-white/50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-yellow" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">Maximize Revenue</p>
                      <p className="text-xs text-gray-800">Optimize commission structures for profitability</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3 bg-white/50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GiftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-yellow" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">Expand Reach</p>
                      <p className="text-xs text-gray-800">Access our network of skilled referrers</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3 bg-white/50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <SparklesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-yellow" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">Data-Driven Insights</p>
                      <p className="text-xs text-gray-800">Track performance with advanced analytics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="text-center lg:text-left mb-6 sm:mb-8">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-dealshark-blue to-blue-600 rounded-full mb-3 sm:mb-4 shadow-lg">
                <PlusCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">New Deal Creation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">Create New Deal</h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg px-2">Design compelling offers that drive customer acquisition and maximize your referral program's effectiveness</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
                {/* Error Messages */}
                {errors && Object.keys(errors).length > 0 && (
                  <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl">
                    <div className="flex items-start">
                      <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-red-600 text-xs sm:text-sm font-medium">Please fix the following errors:</p>
                        <ul className="text-red-600 text-xs sm:text-sm mt-1 list-disc list-inside">
                          {Object.values(errors).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Deal/Offer Title */}
                <div>
                  <label htmlFor="dealTitle" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    DEAL/OFFER TITLE*
                  </label>
                  <input
                    type="text"
                    id="dealTitle"
                    name="dealTitle"
                    value={formData.dealTitle}
                    onChange={handleInputChange}
                    placeholder="Enter Deal/Offer Name"
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-dealshark-blue/20 focus:border-dealshark-blue transition-all duration-300 ${
                      errors.dealTitle ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {errors.dealTitle && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {errors.dealTitle}
                    </p>
                  )}
                </div>

                {/* Deal/Offer Description */}
                <div>
                  <label htmlFor="dealDescription" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    DEAL/OFFER DESCRIPTION*
                  </label>
                  <textarea
                    id="dealDescription"
                    name="dealDescription"
                    value={formData.dealDescription}
                    onChange={handleInputChange}
                    placeholder="Enter deal description here..."
                    rows={4}
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-dealshark-blue/20 focus:border-dealshark-blue transition-all duration-300 resize-none ${
                      errors.dealDescription ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {errors.dealDescription && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {errors.dealDescription}
                    </p>
                  )}
                </div>

                {/* Type of Deal/Offer */}
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4 uppercase tracking-wide">
                    TYPE OF DEAL/OFFER*
                  </label>
                  
                  <div className="space-y-3 sm:space-y-4">
                    {/* Commission Deal Option */}
                    <label className="flex items-start p-3 sm:p-4 md:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:border-dealshark-blue hover:bg-blue-50 group">
                      <input
                        type="radio"
                        name="dealType"
                        value="commission"
                        checked={formData.dealType === 'commission'}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue focus:ring-dealshark-blue border-gray-300 flex-shrink-0"
                      />
                      <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                        <div className="flex items-center mb-1 sm:mb-2">
                          <CurrencyDollarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">Commission Deal (Recommended)</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          You set a commission referral reward per new customer (e.g. £5-£20). 
                          Referrers are highly motivated to share your offers and deals because they earn money - 
                          (These deals get priority visibility on our platform, as the businesses gain new customers, 
                          the referrers are rewarded for bringing new customers to the business and the customer gets 
                          a discount or saving).
                        </p>
                        {formData.dealType === 'commission' && (
                          <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-green-700 font-semibold">
                            <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Non-Commission Option */}
                    <label className="flex items-start p-3 sm:p-4 md:p-5 border-2 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 hover:border-dealshark-blue hover:bg-blue-50 group">
                      <input
                        type="radio"
                        name="dealType"
                        value="non-commission"
                        checked={formData.dealType === 'non-commission'}
                        onChange={handleInputChange}
                        className="mt-1 h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue focus:ring-dealshark-blue border-gray-300 flex-shrink-0"
                      />
                      <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                        <div className="flex items-center mb-1 sm:mb-2">
                          <GiftIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-1 sm:mr-2 flex-shrink-0" />
                          <span className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">Non-Commission Based Incentive</span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          Instead of cash, you offer perks for bringing in customers (e.g. free products / services, 
                          discount vouchers or loyalty credit). This option still gives referrers an incentive to share 
                          your deals and offers while being rewarded for their time and effort.
                        </p>
                        {formData.dealType === 'non-commission' && (
                          <div className="mt-2 sm:mt-3 flex items-center text-xs sm:text-sm text-green-700 font-semibold">
                            <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  {errors.dealType && (
                    <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                      <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      {errors.dealType}
                    </p>
                  )}
                </div>

                {/* Customer Incentive (for commission deals) */}
                {formData.dealType === 'commission' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <label htmlFor="customerIncentive" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      CUSTOMER INCENTIVE* (Commission %)
                    </label>
                    <input
                      type="number"
                      id="customerIncentive"
                      name="customerIncentive"
                      value={formData.customerIncentive}
                      onChange={handleInputChange}
                      placeholder="Enter commission percentage (e.g., 5)"
                      min="0"
                      step="0.01"
                      className={`w-full px-3 sm:px-4 py-2.5 sm:py-3.5 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 ${
                        errors.customerIncentive ? 'border-red-500' : 'border-gray-200'
                      }`}
                      required
                    />
                    <p className="text-xs text-gray-600 mt-2 flex items-start">
                      <SparklesIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Commission percentage that referrers will earn for each successful referral</span>
                    </p>
                    {errors.customerIncentive && (
                      <p className="text-red-500 text-xs sm:text-sm mt-2 flex items-center">
                        <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        {errors.customerIncentive}
                      </p>
                    )}
                  </div>
                )}

                {/* No Reward Reason (for non-commission deals) */}
                {formData.dealType === 'non-commission' && (
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                    <label htmlFor="noRewardReason" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      NO REWARD REASON*
                    </label>
                    <select
                      id="noRewardReason"
                      name="noRewardReason"
                      value={formData.noRewardReason}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 appearance-none ${
                        errors.noRewardReason ? 'border-red-500' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Choose an option...</option>
                      <option value="big_discount">The discount is big enough to share.</option>
                      <option value="exclusive">It's exclusive / limited.</option>
                      <option value="high_demand">It's high-demand (people share it naturally).</option>
                    </select>
                    {errors.noRewardReason && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XMarkIcon className="h-4 w-4 mr-1" />
                        {errors.noRewardReason}
                      </p>
                    )}
                  </div>
                )}

                {/* Deal Poster Options */}
                <div>
                  <label htmlFor="dealPosterOptions" className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                    DEAL POSTER OPTIONS*
                  </label>
                  {loadingPosterOptions ? (
                    <div className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-dealshark-blue border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-gray-600">Loading poster options...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.dealType === 'commission' ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-3 font-medium">Commission-based poster options:</p>
                          <div className="space-y-2">
                            {dealPosterOptions.commission_based.map((option, index) => (
                              <label key={index} className="flex items-start cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-dealshark-blue hover:bg-blue-50 transition-all duration-300">
                                <input
                                  type="radio"
                                  name="dealPosterOptions"
                                  value={option}
                                  checked={formData.dealPosterOptions === option}
                                  onChange={handleInputChange}
                                  className="mr-3 mt-1 h-5 w-5 text-dealshark-blue"
                                />
                                <div className="flex-1">
                                  <span className="text-sm text-gray-900 font-semibold">{option}</span>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {option.includes('{incentive}') ? 'Replace {incentive} with your commission amount' : ''}
                                    {option.includes('${incentive}') ? 'Replace ${incentive} with your reward amount' : ''}
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : formData.dealType === 'non-commission' ? (
                        <div>
                          <p className="text-sm text-gray-600 mb-3 font-medium">Non-commission poster options:</p>
                          <div className="space-y-2">
                            {dealPosterOptions.no_reward_based.map((option, index) => (
                              <label key={index} className="flex items-start cursor-pointer p-4 border-2 border-gray-200 rounded-xl hover:border-dealshark-blue hover:bg-blue-50 transition-all duration-300">
                                <input
                                  type="radio"
                                  name="dealPosterOptions"
                                  value={option}
                                  checked={formData.dealPosterOptions === option}
                                  onChange={handleInputChange}
                                  className="mr-3 mt-1 h-5 w-5 text-dealshark-blue"
                                />
                                <div className="flex-1">
                                  <span className="text-sm text-gray-900 font-semibold">{option}</span>
                                  <p className="text-xs text-gray-500 mt-1">
                                    Perfect for deals with big discounts or exclusive offers
                                  </p>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-500">
                          <span>Please select a deal type first</span>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.dealPosterOptions && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      {errors.dealPosterOptions}
                    </p>
                  )}
                </div>

                {/* Privacy Note */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <SparklesIcon className="h-6 w-6 text-dealshark-blue flex-shrink-0 mt-1" />
                    <div className="text-sm text-gray-700 space-y-3">
                      <p className="font-semibold text-gray-900">Privacy & Data Protection</p>
                      <p>
                        DealShark is committed to protecting and respecting your privacy. We'll only use 
                        the information provided to administer your account and to provide the products and 
                        services you requested from us.
                      </p>
                      <p className="text-xs text-gray-600">
                        For more information, please review our{' '}
                        <a href="#" className="text-dealshark-blue hover:underline font-medium">Privacy Policy</a>.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-4 sm:pt-6">
                  <button
                    type="button"
                    onClick={() => navigate('/business/deals')}
                    className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-bold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 transform hover:scale-105 order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 sm:px-8 md:px-10 py-3 sm:py-4 text-sm sm:text-base rounded-lg sm:rounded-xl font-bold text-white transition-all duration-300 transform shadow-xl flex items-center justify-center space-x-2 order-1 sm:order-2 ${
                      isLoading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 hover:shadow-2xl'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Deal...</span>
                      </>
                    ) : (
                      <>
                        <PlusCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span>Create Deal</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDealPage;