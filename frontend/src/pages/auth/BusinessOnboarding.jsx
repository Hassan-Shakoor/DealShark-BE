import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckIcon, XMarkIcon, SparklesIcon, ArrowRightIcon, EyeIcon, EyeSlashIcon, CurrencyDollarIcon, ShieldCheckIcon, AdjustmentsHorizontalIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { authService, uploadService, dealsService } from '../../services';

import businessOnboardingMascot from "../../assets/images/business-onboarding-mascot.webp"
import createOfferMascot from "../../assets/images/create-offer-mascot.webp"
import growthEarnMascot from "../../assets/images/growth-earn-mascot.webp"
import getReferralsMascot from "../../assets/images/get-referrals-mascot.webp"

const BusinessOnboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [dealPosterOptions, setDealPosterOptions] = useState({
    commission_based: [],
    no_reward_based: []
  });
  const [loadingPosterOptions, setLoadingPosterOptions] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    userDesignation: '',
    businessEmail: '',
    businessPhone: '',
    businessDescription: '',
    businessLogo: null,
    // businessCoverImage: null,

    // Step 2: Legal Info
    registrationNo: '',
    businessWebsite: '',
    businessAddress: '',
    businessState: '',
    businessCity: '',
    businessCountry: '',
    businessIndustry: '',

    // Step 3: Promotion
    createDeal: '',
    dealTitle: '',
    dealDescription: '',
    dealType: '',
    noRewardReason: '',
    customerIncentive: '',
    dealPosterOptions: '',
    noDealReason: '',
    agreeCommunications: false,
    agreeDataProcessing: false
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Update password strength when password changes
    if (name === 'password') {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const passwordStrengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const fieldName = e.target.name;

    if (file) {
      try {
        setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));

        // Validate file before upload
        const validation = uploadService.validateFile(file, {
          maxSize: 5 * 1024 * 1024, // 5MB
          allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
        });

        if (!validation.isValid) {
          setError(validation.errors.join(', '));
          return;
        }

        // Upload file with progress tracking
        const result = await uploadService.uploadFile(file, (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({ ...prev, [fieldName]: progress }));
        });

        if (result.success) {
          setFormData({
            ...formData,
            [fieldName]: result.url
          });
          setUploadProgress(prev => ({ ...prev, [fieldName]: 100 }));
          setError(''); // Clear any previous errors
        } else {
          setError(result.error || 'File upload failed. Please try again.');
          setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));
        }
      } catch (error) {
        console.error('File upload failed:', error);
        setError('File upload failed. Please try again.');
        setUploadProgress(prev => ({ ...prev, [fieldName]: 0 }));
      }
    }
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email &&
          formData.phone_number && formData.businessName && formData.userDesignation &&
          formData.businessEmail && formData.businessPhone && formData.businessDescription &&
          formData.password && formData.confirmPassword &&
          formData.password === formData.confirmPassword && formData.businessLogo;
      case 2:
        return formData.registrationNo && formData.businessWebsite && formData.businessAddress &&
          formData.businessState && formData.businessCity && formData.businessCountry && formData.businessIndustry;
      case 3:
        return formData.createDeal &&
          ((formData.createDeal === 'yes' && formData.dealTitle && formData.dealDescription && formData.dealType && formData.dealPosterOptions &&
            (formData.dealType === 'commission' ? formData.customerIncentive : true)) ||
            (formData.createDeal === 'no' && formData.noDealReason)) &&
          formData.agreeDataProcessing;
      default:
        return true;
    }
  };

  const handleNext = async () => {
    if (currentStep < 3) {
      if (validateStep(currentStep)) {
        setCurrentStep(currentStep + 1);
        setError('');
      } else {
        setError('Please fill in all required fields before proceeding.');
      }
    } else {
      // Handle form submission
      if (validateStep(3)) {
        setIsSubmitting(true);
        setError('');

        try {
          const businessData = {
            email: formData.email,
            phone_number: formData.phone_number,
            password: formData.password,
            first_name: formData.firstName,
            last_name: formData.lastName,
            business_name: formData.businessName,
            business_email: formData.businessEmail,
            business_phone: formData.businessPhone,
            description: formData.businessDescription,
            designation: formData.userDesignation,
            website: formData.businessWebsite,
            registration_no: formData.registrationNo,
            business_address: formData.businessAddress,
            business_city: formData.businessCity,
            business_state: formData.businessState,
            business_country: formData.businessCountry,
            industry: formData.businessIndustry,
            business_logo_url: formData.businessLogo,
            // Deal creation data

          };

          if (formData.createDeal === 'yes') {

            const deal = {
              deal_name: formData.dealTitle,
              deal_description: formData.dealDescription,
              poster_text: formData.dealPosterOptions || null
            }

            if (formData.dealType === 'commission') {
              deal.reward_type = 'commission';
              deal.customer_incentive = parseFloat(formData.customerIncentive);
            } else {
              deal.reward_type = 'no_reward';
              deal.no_reward_reason = formData.noRewardReason;
            }
            businessData.deal = deal;

          } else {
            businessData.no_deal_reason = formData.noDealReason
          }

          // Call the actual API
          const result = await authService.businessRegister(businessData);

          if (result.success) {
            setSuccess('Business registration successful! Please check your email for verification.');
            setTimeout(() => {
              navigate('/otp-verification', {
                state: {
                  email: formData.email,
                  userType: 'business'
                }
              });
            }, 2000);
          } else {
            setError(result.error || 'Registration failed. Please try again.');
          }
        } catch (error) {
          console.error('Registration error:', error);
          setError('Registration failed. Please try again.');
        } finally {
          setIsSubmitting(false);
        }
      } else {
        setError('Please fill in all required fields.');
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { id: 1, title: 'Basic Details', active: currentStep >= 1 },
    { id: 2, title: 'Legal Info', active: currentStep >= 2 },
    { id: 3, title: 'Promotion', active: currentStep >= 3 }
  ];

  const benefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Zero Upfront Investment',
      description: 'Launch your referral campaigns without any initial capital investment or setup fees'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Risk-Free Growth',
      description: 'Pay only for verified customer acquisitions with guaranteed conversion tracking'
    },
    {
      icon: AdjustmentsHorizontalIcon,
      title: 'Flexible Commission Control',
      description: 'Customize your commission structure to optimize profitability and customer acquisition costs'
    },
    {
      icon: ChartBarIcon,
      title: 'Scalable Customer Acquisition',
      description: 'Leverage our network of referrers to exponentially grow your customer base'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dealshark-blue via-blue-600 to-dealshark-blue-dark">
      {/* Left Side - Content */}
      <div className="max-w-7xl max-sm:w-full flex mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 bg-dealshark-yellow rounded-full opacity-20 animate-float"></div>
            <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full opacity-10 animate-float delay-200"></div>
            <div className="absolute bottom-32 left-16 w-20 h-20 bg-dealshark-yellow rounded-full opacity-15 animate-float delay-400"></div>
            <div className="absolute bottom-20 right-20 w-16 h-16 bg-white rounded-full opacity-10 animate-float delay-300"></div>
          </div>


          <div className="relative z-10 flex flex-col pt-12 xl:pt-20 px-8 xl:px-12 text-white">
            <div className="mb-8 xl:mb-12 animate-fade-in-left">
              <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-4 xl:mb-6 leading-tight">
                Grow Your Business with&nbsp;
                <span className="text-dealshark-yellow">DealShark!</span>
              </h1>
              <img src={businessOnboardingMascot} alt="Business Mascot" className="w-48 h-48 xl:w-60 xl:h-60 object-cover" />
              <p className="text-base xl:text-lg 2xl:text-xl text-blue-100 leading-relaxed mt-4 xl:mt-6">
                Join industry leaders who've transformed their customer acquisition strategy. Scale your business with zero upfront investment and performance-based pricing.
              </p>
            </div>

            <div className="space-y-6 xl:space-y-8 animate-fade-in-left delay-200">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4 xl:space-x-6 group hover-lift">
                  <div className="w-12 h-12 xl:w-16 xl:h-16 bg-dealshark-yellow rounded-xl xl:rounded-2xl flex items-center justify-center group-hover:animate-pulse-gentle transition-all duration-300 flex-shrink-0">
                    <benefit.icon className="w-6 h-6 xl:w-8 xl:h-8 text-gray-900" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base xl:text-lg 2xl:text-xl mb-1">{benefit.title}</h3>
                    <p className="text-blue-100 text-xs xl:text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-0 sm:px-4 md:px-8">
          <div className="w-full max-w-2xl">
            {/* Logo */}
            {/* <div className="text-center mb-8 animate-slide-in-top">
              <div className="inline-flex items-center space-x-2 text-3xl font-bold hover-scale transition-bounce">
                <span className="text-white">Deal</span>
                <span className="text-dealshark-yellow">Shark</span>
                <SparklesIcon className="h-8 w-8 text-dealshark-yellow animate-pulse" />
              </div>
            </div> */}

            {/* Progress Indicator */}
            <div className="mb-6 sm:mb-8 animate-fade-in-up delay-200">
              <div className="flex items-center justify-center">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-500 ${step.active
                      ? currentStep === step.id
                        ? 'bg-dealshark-yellow text-gray-900 shadow-yellow'
                        : 'bg-white text-dealshark-blue shadow-lg'
                      : 'bg-white/20 text-white'
                      }`}>
                      {step.active && currentStep !== step.id ? <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : step.id}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 sm:w-12 md:w-16 h-1 mx-2 sm:mx-4 rounded-full transition-all duration-500 ${step.active ? 'bg-dealshark-yellow' : 'bg-white/20'
                        }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center mt-3 sm:mt-4">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                  Step {currentStep}: {steps[currentStep - 1]?.title}
                </h2>
                <p className="text-blue-100 text-xs sm:text-sm">Complete all fields to continue</p>
              </div>
            </div>

            {/* Form */}
            <div className="auth-card animate-fade-in-up delay-300">
              {error && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl animate-slide-in-top">
                  <div className="flex items-center">
                    <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 mr-2 flex-shrink-0" />
                    <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              {success && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl animate-slide-in-top">
                  <div className="flex items-center">
                    <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 mr-2 flex-shrink-0" />
                    <p className="text-green-600 text-xs sm:text-sm font-medium">{success}</p>
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  {/* Name Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="animate-fade-in-up delay-100">
                      <label htmlFor="firstName" className="form-label text-xs sm:text-sm">
                        First Name *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter your first name"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-200">
                      <label htmlFor="lastName" className="form-label text-xs sm:text-sm">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter your last name"
                        required
                      />
                    </div>
                  </div>

                  {/* Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="animate-fade-in-up delay-300">
                      <label htmlFor="email" className="form-label text-xs sm:text-sm">
                        User Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-400">
                      <label htmlFor="phone_number" className="form-label text-xs sm:text-sm">
                        User Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Name and Designation */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="animate-fade-in-up delay-500">
                      <label htmlFor="businessName" className="form-label text-xs sm:text-sm">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter your business name"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-600">
                      <label htmlFor="userDesignation" className="form-label text-xs sm:text-sm">
                        User Designation *
                      </label>
                      <input
                        type="text"
                        id="userDesignation"
                        name="userDesignation"
                        value={formData.userDesignation}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="e.g., CEO, Manager, Owner"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Email and Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="animate-fade-in-up delay-700">
                      <label htmlFor="businessEmail" className="form-label text-xs sm:text-sm">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        id="businessEmail"
                        name="businessEmail"
                        value={formData.businessEmail}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter business email address"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-800">
                      <label htmlFor="businessPhone" className="form-label text-xs sm:text-sm">
                        Business Phone *
                      </label>
                      <input
                        type="tel"
                        id="businessPhone"
                        name="businessPhone"
                        value={formData.businessPhone}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter business phone number"
                        required
                      />
                    </div>
                  </div>

                  {/* Business Description */}
                  <div className="animate-fade-in-up delay-900">
                    <label htmlFor="businessDescription" className="form-label text-xs sm:text-sm">
                      Business Description *
                    </label>
                    <textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      rows="4"
                      className="custom-input resize-none text-sm sm:text-base"
                      placeholder="Describe your business and what you offer"
                      required
                    />
                  </div>

                  {/* Password Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="animate-fade-in-up delay-1000">
                      <label htmlFor="password" className="form-label text-xs sm:text-sm">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="custom-input pr-10 sm:pr-12 text-sm sm:text-base"
                          placeholder="Enter your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                        >
                          {showPassword ? (
                            <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.password && (
                        <div className="mt-2 sm:mt-3">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <div
                                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${passwordStrengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                              {passwordStrengthLabels[passwordStrength - 1] || 'Very Weak'}
                            </span>
                          </div>

                          {/* Password Requirements */}
                          <div className="mt-2 space-y-1">
                            <div className={`flex items-center text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              At least 8 characters
                            </div>
                            <div className={`flex items-center text-xs ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              One uppercase letter
                            </div>
                            <div className={`flex items-center text-xs ${/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              One lowercase letter
                            </div>
                            <div className={`flex items-center text-xs ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              One number
                            </div>
                            <div className={`flex items-center text-xs ${/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-400'}`}>
                              <div className={`w-2 h-2 rounded-full mr-2 ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                              One special character
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="animate-fade-in-up delay-1100">
                      <label htmlFor="confirmPassword" className="form-label text-xs sm:text-sm">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="custom-input pr-10 sm:pr-12 text-sm sm:text-base"
                          placeholder="Confirm your password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Image Upload Sections */}
                  <div className="grid grid-cols-1 gap-4 sm:gap-6">
                    <div className="animate-fade-in-up delay-1200">
                      <label className="form-label text-xs sm:text-sm">
                        Business Logo *
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 hover:border-dealshark-blue transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-dealshark-blue rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                          <div className='flex flex-col gap-3 sm:gap-4 flex-1'>
                            <div className="flex-1">
                              <p className="text-gray-700 text-xs sm:text-sm font-medium">Upload Business Logo</p>
                              <p className="text-gray-500 text-xs">JPG, PNG up to 5MB</p>
                            </div>
                            <div>
                              <input
                                type="file"
                                id="businessLogo"
                                name="businessLogo"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <label htmlFor="businessLogo" className="btn-primary text-xs sm:text-sm cursor-pointer inline-block">
                                Choose File
                              </label>
                            </div>
                          </div>
                        </div>
                        {uploadProgress.businessLogo !== undefined && (
                          <div className="mt-3 sm:mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                              <div
                                className="bg-dealshark-blue h-1.5 sm:h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.businessLogo}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{uploadProgress.businessLogo}% uploaded</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* <div className="animate-fade-in-up delay-1300">
                      <label className="form-label">
                        Business Cover Image (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-dealshark-blue transition-colors duration-300">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-400 rounded-xl flex items-center justify-center mr-4">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 text-sm font-medium">Upload Cover Image</p>
                            <p className="text-gray-500 text-xs">JPG, PNG up to 10MB</p>
                          </div>
                          <input
                            type="file"
                            id="businessCoverImage"
                            name="businessCoverImage"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <label htmlFor="businessCoverImage" className="bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-700 transition-colors">
                            Choose File
                          </label>
                        </div>
                        {uploadProgress.businessCoverImage !== undefined && (
                          <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gray-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress.businessCoverImage}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{uploadProgress.businessCoverImage}% uploaded</p>
                          </div>
                        )}
                      </div>
                    </div> */}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="animate-fade-in-up delay-100">
                    <label htmlFor="registrationNo" className="form-label text-xs sm:text-sm">
                      REGISTRATION NO.*
                    </label>
                    <input
                      type="text"
                      id="registrationNo"
                      name="registrationNo"
                      value={formData.registrationNo}
                      onChange={handleInputChange}
                      className="custom-input text-sm sm:text-base"
                      placeholder="Enter registration no."
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up delay-200">
                    <label htmlFor="businessWebsite" className="form-label text-xs sm:text-sm">
                      BUSINESS WEBSITE*
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-xs sm:text-sm">https://</span>
                      <input
                        type="text"
                        id="businessWebsite"
                        name="businessWebsite"
                        value={formData.businessWebsite}
                        onChange={handleInputChange}
                        className="custom-input pl-14 sm:pl-16 text-sm sm:text-base"
                        placeholder=""
                        required
                      />
                    </div>
                  </div>

                  <div className="animate-fade-in-up delay-300">
                    <label htmlFor="businessAddress" className="form-label text-xs sm:text-sm">
                      BUSINESS ADDRESS*
                    </label>
                    <input
                      type="text"
                      id="businessAddress"
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      className="custom-input text-sm sm:text-base"
                      placeholder="Enter Business Address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="animate-fade-in-up delay-400">
                      <label htmlFor="businessState" className="form-label text-xs sm:text-sm">
                        BUSINESS STATE*
                      </label>
                      <input
                        type="text"
                        id="businessState"
                        name="businessState"
                        value={formData.businessState}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter Business State"
                        required
                      />
                    </div>
                    <div className="animate-fade-in-up delay-500">
                      <label htmlFor="businessCity" className="form-label text-xs sm:text-sm">
                        BUSINESS CITY*
                      </label>
                      <input
                        type="text"
                        id="businessCity"
                        name="businessCity"
                        value={formData.businessCity}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        placeholder="Enter Business City"
                        required
                      />
                    </div>
                  </div>

                  <div className="animate-fade-in-up delay-600">
                    <label htmlFor="businessCountry" className="form-label text-xs sm:text-sm">
                      BUSINESS COUNTRY*
                    </label>
                    <input
                      type="text"
                      id="businessCountry"
                      name="businessCountry"
                      value={formData.businessCountry}
                      onChange={handleInputChange}
                      className="custom-input text-sm sm:text-base"
                      placeholder="Enter Business Country"
                      required
                    />
                  </div>

                  <div className="animate-fade-in-up delay-700">
                    <label htmlFor="businessIndustry" className="form-label text-xs sm:text-sm">
                      BUSINESS INDUSTRY*
                    </label>
                    <input
                      type="text"
                      id="businessIndustry"
                      name="businessIndustry"
                      value={formData.businessIndustry}
                      onChange={handleInputChange}
                      className="custom-input text-sm sm:text-base"
                      placeholder="Enter Business Industry"
                      required
                    />
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="animate-fade-in-up delay-100">
                    <label className="form-label text-xs sm:text-sm">
                      Do you want to Create a Deal?*
                    </label>
                    <div className="flex space-x-4 sm:space-x-6 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="createDeal"
                          value="yes"
                          checked={formData.createDeal === 'yes'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-gray-700 text-sm sm:text-base">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="createDeal"
                          value="no"
                          checked={formData.createDeal === 'no'}
                          onChange={handleInputChange}
                          className="mr-2"
                        />
                        <span className="text-gray-700 text-sm sm:text-base">No</span>
                      </label>
                    </div>
                  </div>

                  {formData.createDeal === 'yes' && (
                    <>
                      <div className="animate-fade-in-up delay-200">
                        <label htmlFor="dealTitle" className="form-label text-xs sm:text-sm">
                          DEAL/OFFER TITLE*
                        </label>
                        <input
                          type="text"
                          id="dealTitle"
                          name="dealTitle"
                          value={formData.dealTitle}
                          onChange={handleInputChange}
                          className="custom-input text-sm sm:text-base"
                          placeholder="Enter Deal/Offer Name"
                          required
                        />
                      </div>

                      <div className="animate-fade-in-up delay-300">
                        <label htmlFor="dealDescription" className="form-label text-xs sm:text-sm">
                          DEAL/OFFER DESCRIPTION*
                        </label>
                        <textarea
                          id="dealDescription"
                          name="dealDescription"
                          value={formData.dealDescription}
                          onChange={handleInputChange}
                          rows="4"
                          className="custom-input resize-none text-sm sm:text-base"
                          placeholder="Enter deal description here..."
                          required
                        />
                      </div>

                      <div className="animate-fade-in-up delay-400">
                        <label className="form-label text-xs sm:text-sm">
                          TYPE OF DEAL/OFFER
                        </label>
                        <div className="space-y-4 mt-2">
                          <label className="flex items-start">
                            <input
                              type="radio"
                              name="dealType"
                              value="commission"
                              checked={formData.dealType === 'commission'}
                              onChange={handleInputChange}
                              className="mr-3 mt-1"
                            />
                            <div>
                              <span className="font-semibold text-gray-900">Commission Deal (Recommended)</span>
                              <p className="text-sm text-gray-600 mt-1">
                                You set a commission referral reward per new customer (e.g. £5-£20). Referrers are highly motivated to share your offers and deals because they earn money - (These deals get priority visibility on our platform, as the businesses gain new customers, the referrers are rewarded for bringing new customers to the business and the customer gets a discount or saving).
                              </p>
                            </div>
                          </label>
                          <label className="flex items-start">
                            <input
                              type="radio"
                              name="dealType"
                              value="non-commission"
                              checked={formData.dealType === 'non-commission'}
                              onChange={handleInputChange}
                              className="mr-3 mt-1"
                            />
                            <div>
                              <span className="font-semibold text-gray-900">Non-Commission Based Incentive</span>
                              <p className="text-sm text-gray-600 mt-1">
                                Instead of cash, you offer perks for bringing in customers (e.g. free products / services, discount vouchers or loyalty credit). This option still gives referrers an incentive to share your deals and offers while being rewarded for their time and effort.
                              </p>
                            </div>
                          </label>
                        </div>
                      </div>

                      {formData.dealType === 'non-commission' && (
                        <div className="animate-fade-in-up delay-500">
                          <label htmlFor="noRewardReason" className="form-label">
                            NO REWARD REASON
                          </label>
                          <select
                            id="noRewardReason"
                            name="noRewardReason"
                            value={formData.noRewardReason}
                            onChange={handleInputChange}
                            className="custom-input"
                          >
                            <option value="">Choose an option...</option>
                            <option value="big_discount">The discount is big enough to share.</option>
                            <option value="exclusive">It's exclusive / limited.</option>
                            <option value="high_demand">It's high-demand (people share it naturally).</option>
                          </select>
                        </div>
                      )}

                      {formData.dealType === 'commission' && (
                        <div className="animate-fade-in-up delay-600">
                          <label htmlFor="customerIncentive" className="form-label">
                            CUSTOMER INCENTIVE *
                          </label>
                          <input
                            type="number"
                            id="customerIncentive"
                            name="customerIncentive"
                            value={formData.customerIncentive}
                            onChange={handleInputChange}
                            className="custom-input"
                            placeholder="Enter commission amount (e.g., 5)"
                            min="0"
                            step="0.01"
                            required
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Amount in dollars that referrers will earn for each successful referral
                          </p>
                        </div>
                      )}

                      <div className="animate-fade-in-up delay-700">
                        <label htmlFor="dealPosterOptions" className="form-label">
                          DEAL POSTER OPTIONS
                        </label>
                        {loadingPosterOptions ? (
                          <div className="custom-input flex items-center justify-center py-3">
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
                                    <label key={index} className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-dealshark-blue hover:bg-blue-50 transition-all duration-300">
                                      <input
                                        type="radio"
                                        name="dealPosterOptions"
                                        value={option}
                                        checked={formData.dealPosterOptions === option}
                                        onChange={handleInputChange}
                                        className="mr-3 mt-1"
                                      />
                                      <div className="flex-1">
                                        <span className="text-sm text-gray-900 font-medium">{option}</span>
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
                                    <label key={index} className="flex items-start cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-dealshark-blue hover:bg-blue-50 transition-all duration-300">
                                      <input
                                        type="radio"
                                        name="dealPosterOptions"
                                        value={option}
                                        checked={formData.dealPosterOptions === option}
                                        onChange={handleInputChange}
                                        className="mr-3 mt-1"
                                      />
                                      <div className="flex-1">
                                        <span className="text-sm text-gray-900 font-medium">{option}</span>
                                        <p className="text-xs text-gray-500 mt-1">
                                          Perfect for deals with big discounts or exclusive offers
                                        </p>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="custom-input flex items-center justify-center py-3 text-gray-500">
                                <span>Please select a deal type first</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  {formData.createDeal === 'no' && (
                    <div className="animate-fade-in-up delay-200">
                      <label htmlFor="noDealReason" className="form-label">
                        Why you do not want to Create a Deal? Give a reason.*
                      </label>
                      <select
                        id="noDealReason"
                        name="noDealReason"
                        value={formData.noDealReason}
                        onChange={handleInputChange}
                        className="custom-input"
                        required
                      >
                        <option value="">Choose an option...</option>
                        <option value="already_discounted">Our products/services are already heavily discounted</option>
                        <option value="exclusive_offering">We offer exclusive/limited services that don't need deals</option>
                        <option value="brand_strategy">We want to maintain premium branding without discounts</option>
                        <option value="organic_demand">We already have high demand and don't need promotions</option>
                        <option value="testing_phase">We're still testing the product/service before launching deals</option>
                        <option value="other">Other reason</option>
                      </select>
                    </div>
                  )}

                  <div className="animate-fade-in-up delay-800">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeCommunications"
                        checked={formData.agreeCommunications}
                        onChange={handleInputChange}
                        className="mr-3 mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to receive other communications from Deal Shark.
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      In order to provide you the content requested, we need to store and process this entered data.
                    </p>
                  </div>

                  <div className="animate-fade-in-up delay-900">
                    <label className="flex items-start">
                      <input
                        type="checkbox"
                        name="agreeDataProcessing"
                        checked={formData.agreeDataProcessing}
                        onChange={handleInputChange}
                        className="mr-3 mt-1"
                      />
                      <span className="text-sm text-gray-700">
                        I agree to allow Deal Shark to store and process the information I have entered.
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-2">
                      Deal Shark is committed to protecting and respecting your privacy, and we'll only use the information provided to administer your account and to provide the products and services you requested from us.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-6 sm:mt-8 pt-4 sm:pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover-lift"
                  >
                    Previous
                  </button>
                )}

                <div className="flex-1"></div>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isSubmitting}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-2.5 sm:py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">Wait...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">{currentStep === 3 ? 'Complete Registration' : 'Next'}</span>
                      <span className="sm:hidden">{currentStep === 3 ? 'Complete' : 'Next'}</span>
                      <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 sm:mt-6 text-center border-t border-gray-200 pt-4 sm:pt-6">
                <p className="text-gray-600 text-xs sm:text-sm">
                  Already have an account?{' '}
                  <button
                    className="text-dealshark-blue hover:text-blue-700 font-semibold transition-colors duration-300 hover:underline"
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </button>
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4 mt-5">
                {/* Share Deals Card */}
                <Link
                  to="/signup"
                  className="group block"
                >
                  <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center flex-1">
                        <div className="bg-white/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                          <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <h4 className="text-white font-bold text-sm sm:text-base mb-1">
                            Earn by Sharing
                          </h4>
                          <p className="text-white text-[13px] sm:text-sm font-medium leading-[1.3]">
                            Share offers and deals, earn commissions on every sale
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="bg-dealshark-yellow text-gray-900 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm group-hover:bg-white transition-colors duration-300 shadow-md flex items-center space-x-1">
                          <span>Join Now</span>
                          <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section for Business */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-tight">
              HOW IT WORKS FOR BUSINESSES?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Accelerate your business growth through our proven referral ecosystem designed for sustainable customer acquisition
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="group relative bg-gradient-to-b from-dealshark-blue to-blue-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-dealshark-yellow rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 font-bold text-lg sm:text-xl flex-shrink-0">
                    1
                  </div>
                  <img
                    src={createOfferMascot}
                    alt="Create Your Deal"
                    className="w-24 sm:w-32 h-auto transform transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                    draggable="false"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                  DESIGN YOUR CAMPAIGN
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  Create compelling offers with strategic commission structures to maximize customer acquisition and profitability
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-gradient-to-b from-indigo-600 to-indigo-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-dealshark-yellow rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 font-bold text-lg sm:text-xl flex-shrink-0">
                    2
                  </div>
                  <img
                    src={getReferralsMascot}
                    alt="Get Referrals"
                    className="w-24 sm:w-32 h-auto transform transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                    draggable="false"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                  AMPLIFY YOUR REACH
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  Leverage our network of skilled referrers to expand your brand visibility and acquire high-quality customers
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-gradient-to-b from-purple-600 to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-dealshark-yellow rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 font-bold text-lg sm:text-xl flex-shrink-0">
                    3
                  </div>
                  <img
                    src={growthEarnMascot}
                    alt="Track & Grow"
                    className="w-24 sm:w-32 h-auto transform transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                    draggable="false"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                  OPTIMIZE & GROW
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  Utilize comprehensive analytics to refine your strategy and scale your customer acquisition exponentially
                </p>
              </div>
            </div>
          </div>

          {/* Additional Benefits */}
          <div className="mt-12 sm:mt-16 text-center">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
              <SparklesIcon className="h-5 w-5 text-dealshark-yellow" />
              <span className="text-gray-900 font-semibold text-sm sm:text-base">
                Zero Setup Costs • Performance-Based Pricing • Risk-Free Platform
              </span>
              <SparklesIcon className="h-5 w-5 text-dealshark-yellow" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessOnboarding;