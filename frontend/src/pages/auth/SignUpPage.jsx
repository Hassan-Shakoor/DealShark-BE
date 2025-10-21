import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon, ArrowRightIcon, XMarkIcon, CheckCircleIcon, CurrencyDollarIcon, StarIcon, ChartBarIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { uploadService } from '../../services';
import checkMarkMascot from "../../assets/images/check-mark-mascot.webp"
import earnMoneyMascot from "../../assets/images/earn-money-mascot.webp"
import shoppingSharkMascot from "../../assets/images/shopping-shark-mascot.webp"
import growthEarnMascot from "../../assets/images/growth-earn-mascot.webp"


const SignUpPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated, loading } = useAuth();
  const [isBusinessSignup, setIsBusinessSignup] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone_number: '',
    password: '',
    confirm_password: '',
    user_type: 'customer'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file before upload
      const validation = uploadService.validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      });

      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return;
      }

      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload file
      setIsUploading(true);
      const result = await uploadService.uploadProfilePicture(file);

      if (result.success) {
        setFormData({
          ...formData,
          profilePicture: result.url
        });
        setError(''); // Clear any previous errors
      } else {
        setError(result.error || 'File upload failed. Please try again.');
        setImagePreview(null); // Clear preview on error
      }
    } catch (error) {
      console.error('File upload failed:', error);
      setError('File upload failed. Please try again.');
      setImagePreview(null); // Clear preview on error
    } finally {
      setIsUploading(false);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (isBusinessSignup) {
      // Navigate to business onboarding
      navigate('/business-onboarding');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.phone_number,
        formData.password,
        formData.confirm_password,
        formData.user_type,
        formData.profilePicture
      );

      if (result.success) {
        setSuccess('Registration successful! Please check your email for verification.');
        setTimeout(() => {
          navigate('/otp-verification', {
            state: {
              email: formData.email,
              password: formData.password
            }
          });
        }, 2000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const customerBenefits = [
    {
      icon: CurrencyDollarIcon,
      title: 'Earn Up to 15% Commission',
      description: 'Generate substantial income through strategic referrals and customer conversions'
    },
    {
      icon: StarIcon,
      title: 'Premium Access',
      description: 'Unlock exclusive deals and early access to limited-time offers from top brands'
    },
    {
      icon: ChartBarIcon,
      title: 'Advanced Analytics',
      description: 'Leverage comprehensive insights to optimize your referral strategy and maximize earnings'
    }
  ];

  const businessBenefits = [
    {
      icon: StarIcon,
      title: 'Expand Your Reach',
      description: 'Access a vast network of engaged referrers to amplify your brand visibility and customer acquisition'
    },
    {
      icon: ChartBarIcon,
      title: 'Performance Intelligence',
      description: 'Utilize advanced analytics to track conversion rates, customer lifetime value, and ROI optimization'
    },
    {
      icon: CurrencyDollarIcon,
      title: 'Performance-Based Pricing',
      description: 'Pay only for verified conversions, ensuring maximum ROI on your marketing investment'
    }
  ];

  const benefits = isBusinessSignup ? businessBenefits : customerBenefits;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue">

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-6rem)] md:min-h-[calc(100vh-8rem)]">

            {/* Left Side - Welcome Section */}
            <div className="signup-welcome animate-fade-in-left hidden lg:block">
              <div className="welcome-content text-white">
                <h2 className="welcome-title text-3xl xl:text-4xl 2xl:text-5xl font-bold mb-4 xl:mb-6 leading-tight">
                  Join <span className="text-dealshark-yellow">DealShark</span> Today
                </h2>
                <p className="welcome-subtitle text-base xl:text-lg 2xl:text-xl text-purple-100 mb-8 xl:mb-12 leading-relaxed">
                  {isBusinessSignup
                    ? 'Accelerate your business growth through our powerful referral ecosystem. Connect with thousands of engaged customers and scale your revenue exponentially.'
                    : 'Transform your network into a profitable income stream. Earn substantial commissions while helping others discover incredible deals from premium brands.'}
                </p>

                {/* Mascot above benefits */}
                <div className="mascot-container mb-8 xl:mb-12 animate-float">
                  <div className="w-60 h-60 xl:w-72 xl:h-72 2xl:w-80 2xl:h-80 rounded-2xl flex items-center justify-center text-6xl">
                    <img src={checkMarkMascot} alt="Dealshark Mascot" className="w-full h-full object-cover p-2" />
                  </div>
                </div>

                <div className="welcome-benefits space-y-6 xl:space-y-8">
                  {benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="benefit-item flex items-center space-x-4 xl:space-x-6 group hover-lift animate-fade-in-left"
                      style={{ animationDelay: `${(index + 1) * 200}ms` }}
                    >
                      <div className="benefit-icon w-12 h-12 xl:w-16 xl:h-16 bg-dealshark-yellow rounded-xl xl:rounded-2xl flex items-center justify-center group-hover:animate-pulse-gentle transition-all duration-300 flex-shrink-0">
                        <benefit.icon className="w-6 h-6 xl:w-8 xl:h-8 text-gray-900" />
                      </div>
                      <div className="benefit-text">
                        <h4 className="text-base xl:text-lg 2xl:text-xl font-semibold mb-1 xl:mb-2">{benefit.title}</h4>
                        <p className="text-purple-100 text-sm xl:text-base">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Signup Form */}
            <div className="signup-form-container animate-fade-in-right">
              <div className="signup-form-wrapper auth-card">
                <h1 className="signup-title text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
                  Sign up to DealShark
                </h1>
                {/* 
                <div className="signup-type-switch flex bg-gray-100 rounded-xl p-1 mb-8">
                  <button
                    className={`switch-btn flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${!isBusinessSignup
                      ? 'bg-white text-dealshark-blue shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsBusinessSignup(false)}
                  >
                    Personal Account
                  </button>
                  <button
                    className={`switch-btn flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${isBusinessSignup
                      ? 'bg-white text-dealshark-blue shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    onClick={() => setIsBusinessSignup(true)}
                  >
                    Business Account
                  </button>
                </div> */}

                {error && (
                  <div className="error-message mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl animate-slide-in-top">
                    <p className="text-red-600 text-xs sm:text-sm font-medium">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="success-message mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg sm:rounded-xl animate-slide-in-top">
                    <p className="text-green-600 text-xs sm:text-sm font-medium">{success}</p>
                  </div>
                )}

                <form className="signup-form space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                  <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="form-group animate-fade-in-up delay-200">
                      <label htmlFor="firstName" className="form-label uppercase text-xs sm:text-sm">FIRST NAME*</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group animate-fade-in-up delay-300">
                      <label htmlFor="lastName" className="form-label uppercase text-xs sm:text-sm">LAST NAME*</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="form-group animate-fade-in-up delay-400">
                      <label htmlFor="email" className="form-label uppercase text-xs sm:text-sm">EMAIL ADDRESS*</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Email Address"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="form-group animate-fade-in-up delay-500">
                      <label htmlFor="phone_number" className="form-label uppercase text-xs sm:text-sm">PHONE*</label>
                      <input
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        placeholder="Enter Phone Number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="form-row grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="form-group animate-fade-in-up delay-600">
                      <label htmlFor="password" className="form-label uppercase text-xs sm:text-sm">PASSWORD*</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          name="password"
                          placeholder="Enter Password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="custom-input pr-10 sm:pr-12 text-sm sm:text-base"
                          required
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex="-1"
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
                                className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${strengthColors[passwordStrength - 1] || 'bg-gray-200'}`}
                                style={{ width: `${(passwordStrength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                              {strengthLabels[passwordStrength - 1] || 'Very Weak'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group animate-fade-in-up delay-700">
                      <label htmlFor="confirm_password" className="form-label uppercase text-xs sm:text-sm">CONFIRM PASSWORD*</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          id="confirm_password"
                          name="confirm_password"
                          placeholder="Enter Confirm Password"
                          value={formData.confirm_password}
                          onChange={handleInputChange}
                          className="custom-input pr-10 sm:pr-12 text-sm sm:text-base"
                          required
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex="-1"
                          className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                        >
                          {showConfirmPassword ? (
                            <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          ) : (
                            <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          )}
                        </button>
                      </div>
                      {formData.confirm_password && formData.password === formData.confirm_password && (
                        <div className="mt-2 flex items-center text-green-600 animate-fade-in-up">
                          <span className="text-xs sm:text-sm font-medium">✓ Passwords match</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Profile Picture Upload */}
                  <div className="form-group upload-section animate-fade-in-up delay-800">
                    <label className="form-label text-xs sm:text-sm">Upload Profile Picture (Optional)</label>
                    <div className={`upload-area border-2 border-dashed rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center transition-all duration-300 ${imagePreview ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-dealshark-blue'
                      }`}>
                      <div className="upload-content">
                        {isUploading ? (
                          // Loading State
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-dealshark-blue border-t-transparent rounded-full animate-spin mb-3 sm:mb-4"></div>
                            <p className="text-dealshark-blue font-semibold text-sm sm:text-base">Uploading image...</p>
                            <p className="text-gray-500 text-xs sm:text-sm mt-2">Please wait</p>
                          </div>
                        ) : imagePreview ? (
                          // Preview State
                          <div className="flex flex-col items-center">
                            <div className="relative mb-3 sm:mb-4">
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-green-500 shadow-lg"
                              />
                              <div className="absolute -top-2 -right-2 w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                <CheckCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                              </div>
                            </div>
                            <p className="text-green-700 font-semibold mb-2 text-sm sm:text-base">✓ Image uploaded successfully!</p>
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">Your profile picture is ready</p>
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                              <label htmlFor="profilePicture" className="btn-primary cursor-pointer inline-block text-xs sm:text-sm px-3 sm:px-4 py-2 text-center">
                                Change Image
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(null);
                                  setFormData({ ...formData, profilePicture: null });
                                }}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm flex items-center justify-center space-x-1"
                              >
                                <XMarkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </div>
                        ) : (
                          // Initial State
                          <>
                            <div className="upload-icon text-3xl sm:text-4xl mb-3 sm:mb-4">☁️</div>
                            <p className="upload-text text-gray-700 font-medium mb-2 text-sm sm:text-base">Please Upload Image</p>
                            <p className="upload-types text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">Type: jpg, jpeg, png (Max 5MB)</p>
                            <label htmlFor="profilePicture" className="file-label btn-primary cursor-pointer inline-block text-xs sm:text-sm px-4 sm:px-6 py-2 sm:py-3">
                              Choose File
                            </label>
                          </>
                        )}
                        <input
                          type="file"
                          id="profilePicture"
                          name="profilePicture"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="file-input hidden"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="signup-btn w-full btn-secondary flex items-center justify-center space-x-2 animate-fade-in-up delay-900 text-sm sm:text-base py-3 sm:py-4"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Account</span>
                        <ArrowRightIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      </>
                    )}
                  </button>
                </form>

                <div className="signup-footer mt-6 sm:mt-8 text-center animate-fade-in-up delay-1000">
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Already have an account?{' '}
                    <button
                      className="login-link text-dealshark-blue hover:text-blue-700 font-bold transition-colors duration-300 hover:underline"
                      onClick={() => navigate('/login')}
                    >
                      Login
                    </button>
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {/* Business Registration Card */}
                  <Link
                    to="/business-onboarding"
                    className="group block"
                  >
                    <div className="mt-5 relative overflow-hidden bg-gradient-to-r from-dealshark-blue to-blue-700 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center flex-1">
                          <div className="bg-white/20 p-2 sm:p-3 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
                            <BuildingStorefrontIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <div className="text-left flex-1">
                            <h4 className="text-white font-bold text-sm sm:text-base mb-1">
                              Business Owner?
                            </h4>
                            <p className="text-blue-100 text-xs sm:text-sm">
                              Are you looking to promote your products and services?
                            </p>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <div className="bg-dealshark-yellow text-gray-900 px-4 py-2 rounded-lg font-bold text-xs sm:text-sm group-hover:bg-white transition-colors duration-300 shadow-md flex items-center space-x-1">
                            <span>Register</span>
                            <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* <div className="signup-divider mt-8 mb-6 animate-fade-in-up delay-1100">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-gray-100 text-gray-500 font-medium">Or continue with</span>
                    </div>
                  </div>
                </div>

                <div className="social-signup grid grid-cols-2 gap-4 animate-fade-in-up delay-1200">
                  <button className="social-btn google-btn flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover-lift">
                    <span className="mr-2">🔍</span>
                    Google
                  </button>
                  <button className="social-btn facebook-btn flex items-center justify-center px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover-lift">
                    <span className="mr-2">📘</span>
                    Facebook
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* How it Works Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-gradient-to-br from-blue-50 to-purple-50 relative">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 uppercase tracking-tight">
              HOW IT WORKS?
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Transform your shopping habits into a profitable business venture in three strategic steps
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1 */}
            <div className="group relative bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-dealshark-yellow rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 font-bold text-lg sm:text-xl flex-shrink-0">
                    1
                  </div>
                  <img
                    src={shoppingSharkMascot}
                    alt="Browse Deals"
                    className="w-36 sm:w-48 h-auto transform transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                    draggable="false"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                  DISCOVER PREMIUM DEALS
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  Access curated, high-value offers from premium brands across diverse industries and categories
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative bg-gradient-to-b from-purple-600 to-purple-700 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-dealshark-yellow rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 font-bold text-lg sm:text-xl flex-shrink-0">
                    2
                  </div>
                  <img
                    src={earnMoneyMascot}
                    alt="Share & Earn"
                    className="w-24 sm:w-32 h-auto transform transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                    draggable="false"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                  PROMOTE & EARN
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  Leverage your network to promote deals and earn substantial commissions on every successful referral
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative bg-gradient-to-b from-dealshark-blue to-blue-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/20 overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-dealshark-yellow rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-gray-900 font-bold text-lg sm:text-xl flex-shrink-0">
                    3
                  </div>
                  <img
                    src={growthEarnMascot}
                    alt="Track Earnings"
                    className="w-24 sm:w-32 h-auto transform transition-transform duration-300 group-hover:scale-110 pointer-events-none"
                    draggable="false"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 uppercase tracking-tight">
                  OPTIMIZE PERFORMANCE
                </h3>
                <p className="text-white text-sm sm:text-base leading-relaxed">
                  Monitor your referral performance with advanced analytics and optimize your strategy for maximum earnings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SignUpPage;