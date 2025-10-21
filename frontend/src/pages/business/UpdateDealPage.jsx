import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dealsService } from '../../services';
import { 
  SparklesIcon, 
  GiftIcon, 
  CurrencyDollarIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  PencilSquareIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Import mascot images
import promotionalMascot from '../../assets/images/promotional-mascot.webp';

const UpdateDealPage = () => {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const { userType } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isActive, setIsActive] = useState(true);
  
  const [formData, setFormData] = useState({
    dealTitle: '',
    dealDescription: '',
    dealType: '',
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

  // Fetch deal data and poster options
  useEffect(() => {
    fetchDealData();
    fetchDealPosterOptions();
  }, [dealId]);

  const fetchDealData = async () => {
    try {
      setIsFetching(true);
      const result = await dealsService.getDeal(dealId);

      if (result.success) {
        const deal = result.deal;
        setFormData({
          dealTitle: deal.deal_name || '',
          dealDescription: deal.deal_description || '',
          dealType: deal.reward_type === 'commission' ? 'commission' : 'non-commission',
          customerIncentive: deal.customer_incentive || '',
          noRewardReason: deal.no_reward_reason || '',
          dealPosterOptions: deal.poster_text || '',
        });
        setIsActive(deal.is_active !== undefined ? deal.is_active : true);
      } else {
        toast.error(result.error || 'Failed to fetch deal');
        navigate('/business/deals');
      }
    } catch (error) {
      console.error('Error fetching deal:', error);
      toast.error('Failed to load deal data');
      navigate('/business/deals');
    } finally {
      setIsFetching(false);
    }
  };

  const fetchDealPosterOptions = async () => {
    try {
      setLoadingPosterOptions(true);
      const result = await dealsService.getDealPosterOptions();

      if (result.success) {
        setDealPosterOptions(result.options);
      } else {
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

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleToggleActive = () => {
    setIsActive(prev => !prev);
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
        is_active: isActive,
      };

      // Add type-specific fields
      if (formData.dealType === 'commission') {
        dealData.reward_type = 'commission';
        dealData.customer_incentive = parseFloat(formData.customerIncentive);
      } else {
        dealData.reward_type = 'no_reward';
        dealData.no_reward_reason = formData.noRewardReason;
      }

      // Call the update deal API
      const result = await dealsService.updateDeal(dealId, dealData);

      if (result.success) {
        toast.success('Deal updated successfully!');
        navigate('/business/deals');
      } else {
        toast.error(result.error || 'Failed to update deal');
      }
    } catch (error) {
      console.error('Update deal error:', error);
      toast.error('Failed to update deal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-dealshark-blue mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading deal data...</p>
        </div>
      </div>
    );
  }

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
            <div className="lg:sticky lg:top-8">
              <div className="bg-gradient-to-br from-dealshark-yellow via-yellow-300 to-dealshark-yellow rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -mr-12 sm:-mr-16 -mt-12 sm:-mt-16"></div>
                <div className="relative z-10 text-center">
                <img 
                  src={promotionalMascot} 
                  alt="Update Deal Mascot" 
                  className="w-32 sm:w-36 md:w-40 h-auto mx-auto mb-4 sm:mb-6 transform hover:scale-110 transition-transform duration-300"
                />
                
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  Update Your Deal
                </h3>
                <p className="text-xs sm:text-sm text-gray-800 mb-4 sm:mb-6 leading-relaxed">
                  Modify your deal details and control its visibility
                </p>
                
                {/* Active Status Card */}
                <div className={`bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border-2 ${isActive ? 'border-green-500' : 'border-gray-400'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center flex-1 min-w-0">
                      {isActive ? (
                        <EyeIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-2 flex-shrink-0" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600 mr-2 flex-shrink-0" />
                      )}
                      <div className="text-left min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-gray-900">Deal Status</p>
                        <p className={`text-xs ${isActive ? 'text-green-700' : 'text-gray-600'}`}>
                          {isActive ? 'Active & Visible' : 'Inactive & Hidden'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleActive}
                      className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 flex-shrink-0 ${
                        isActive 
                          ? 'bg-green-500 focus:ring-green-300' 
                          : 'bg-gray-400 focus:ring-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                          isActive ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 sm:space-y-3 text-left">
                  <div className="flex items-start space-x-2 sm:space-x-3 bg-white/50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-yellow" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">Edit Details</p>
                      <p className="text-xs text-gray-800">Update any information</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 sm:space-x-3 bg-white/50 rounded-lg sm:rounded-xl p-2 sm:p-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      {isActive ? (
                        <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-yellow" />
                      ) : (
                        <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-yellow" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-gray-900">Toggle Visibility</p>
                      <p className="text-xs text-gray-800">Show or hide from customers</p>
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
                <PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white mr-2 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-white">Deal Update</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 px-2">Update Deal</h1>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg px-2">Modify your deal details and manage its visibility</p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            
                {/* Error Messages */}
                {errors && Object.keys(errors).length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <XMarkIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                      <div>
                        <p className="text-red-600 text-sm font-medium">Please fix the following errors:</p>
                        <ul className="text-red-600 text-sm mt-1 list-disc list-inside">
                          {Object.values(errors).map((error, index) => (
                            <li key={index}>{error}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* Active/Inactive Toggle */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                        DEAL STATUS
                      </label>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {isActive 
                          ? 'This deal is currently visible to all customers' 
                          : 'This deal is hidden and not visible to customers'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className={`text-xs sm:text-sm font-bold ${isActive ? 'text-green-600' : 'text-gray-500'}`}>
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      <button
                        type="button"
                        onClick={handleToggleActive}
                        className={`relative inline-flex h-8 w-14 sm:h-10 sm:w-18 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 shadow-lg flex-shrink-0 ${
                          isActive 
                            ? 'bg-green-500 focus:ring-green-300' 
                            : 'bg-gray-400 focus:ring-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 sm:h-8 sm:w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            isActive ? 'translate-x-7 sm:translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Deal/Offer Title */}
                <div>
                  <label htmlFor="dealTitle" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    DEAL/OFFER TITLE*
                  </label>
                  <input
                    type="text"
                    id="dealTitle"
                    name="dealTitle"
                    value={formData.dealTitle}
                    onChange={handleInputChange}
                    placeholder="Enter Deal/Offer Name"
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-dealshark-blue/20 focus:border-dealshark-blue transition-all duration-300 ${
                      errors.dealTitle ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {errors.dealTitle && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      {errors.dealTitle}
                    </p>
                  )}
                </div>

                {/* Deal/Offer Description */}
                <div>
                  <label htmlFor="dealDescription" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                    DEAL/OFFER DESCRIPTION*
                  </label>
                  <textarea
                    id="dealDescription"
                    name="dealDescription"
                    value={formData.dealDescription}
                    onChange={handleInputChange}
                    placeholder="Enter deal description here..."
                    rows={4}
                    className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-dealshark-blue/20 focus:border-dealshark-blue transition-all duration-300 resize-none ${
                      errors.dealDescription ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {errors.dealDescription && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      {errors.dealDescription}
                    </p>
                  )}
                </div>

                {/* Type of Deal/Offer */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wide">
                    TYPE OF DEAL/OFFER*
                  </label>
                  
                  <div className="space-y-4">
                    {/* Commission Deal Option */}
                    <label className="flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-dealshark-blue hover:bg-blue-50 group">
                      <input
                        type="radio"
                        name="dealType"
                        value="commission"
                        checked={formData.dealType === 'commission'}
                        onChange={handleInputChange}
                        className="mt-1 h-5 w-5 text-dealshark-blue focus:ring-dealshark-blue border-gray-300"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center mb-2">
                          <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-bold text-gray-900 text-lg">Commission Deal (Recommended)</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          You set a commission referral reward per new customer. Referrers are highly motivated to share your offers.
                        </p>
                        {formData.dealType === 'commission' && (
                          <div className="mt-3 flex items-center text-sm text-green-700 font-semibold">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </div>
                    </label>

                    {/* Non-Commission Option */}
                    <label className="flex items-start p-5 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:border-dealshark-blue hover:bg-blue-50 group">
                      <input
                        type="radio"
                        name="dealType"
                        value="non-commission"
                        checked={formData.dealType === 'non-commission'}
                        onChange={handleInputChange}
                        className="mt-1 h-5 w-5 text-dealshark-blue focus:ring-dealshark-blue border-gray-300"
                      />
                      <div className="ml-4 flex-1">
                        <div className="flex items-center mb-2">
                          <GiftIcon className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-bold text-gray-900 text-lg">Non-Commission Based Incentive</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          Instead of cash, you offer perks for bringing in customers (e.g. free products, discount vouchers).
                        </p>
                        {formData.dealType === 'non-commission' && (
                          <div className="mt-3 flex items-center text-sm text-green-700 font-semibold">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Selected
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                  
                  {errors.dealType && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <XMarkIcon className="h-4 w-4 mr-1" />
                      {errors.dealType}
                    </p>
                  )}
                </div>

                {/* Customer Incentive (for commission deals) */}
                {formData.dealType === 'commission' && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
                    <label htmlFor="customerIncentive" className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
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
                      className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 ${
                        errors.customerIncentive ? 'border-red-500' : 'border-gray-200'
                      }`}
                      required
                    />
                    <p className="text-xs text-gray-600 mt-2 flex items-center">
                      <SparklesIcon className="h-4 w-4 mr-1 text-green-600" />
                      Commission percentage that referrers will earn for each successful referral
                    </p>
                    {errors.customerIncentive && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <XMarkIcon className="h-4 w-4 mr-1" />
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
                        <span>Updating Deal...</span>
                      </>
                    ) : (
                      <>
                        <CheckIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                        <span>Update Deal</span>
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

export default UpdateDealPage;

