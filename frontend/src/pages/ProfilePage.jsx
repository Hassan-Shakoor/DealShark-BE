import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService, referralsService, uploadService } from '../services';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CameraIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  KeyIcon,
  ShieldCheckIcon,
  CalendarIcon,
  StarIcon,
  CreditCardIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import StripeConnectModal from '../components/common/StripeConnectModal';

const ProfilePage = () => {
  const { user, business, userType, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Stripe Connect states
  const [onboardingStatus, setOnboardingStatus] = useState(null);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [stripeLoading, setStripeLoading] = useState(false);

  // Profile form data
  const [formData, setFormData] = useState({
    // User fields
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    profile_picture: '',

    // Business fields
    business_name: '',
    business_email: '',
    business_phone: '',
    website: '',
    registration_no: '',
    business_address: '',
    business_city: '',
    business_state: '',
    business_country: '',
    business_industry: '',
    business_logo_url: '',
    business_cover_url: '',
    description: ''
  });

  // Password change form
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  useEffect(() => {
    // Initialize form data with current user/business data
    if (user) {
      setFormData(prev => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        profile_picture: user.profile_picture || ''
      }));
      // Clear preview when user data loads
      setImagePreview(null);
    }

    if (business) {
      setFormData(prev => ({
        ...prev,
        business_name: business.business_name || '',
        business_email: business.business_email || business.email || '',
        business_phone: business.business_phone || business.phone_number || '',
        website: business.website || '',
        registration_no: business.registration_no || '',
        business_address: business.business_address || '',
        business_city: business.business_city || '',
        business_state: business.business_state || '',
        business_country: business.business_country || '',
        business_industry: business.business_industry || '',
        business_logo_url: business.business_logo_url || '',
        business_cover_url: business.business_cover_url || '',
        description: business.description || ''
      }));
    }

    // Fetch Stripe onboarding status
    fetchOnboardingStatus();
  }, [user, business]);

  const fetchOnboardingStatus = async () => {
    try {
      setStripeLoading(true);
      const result = await referralsService.getOnboardingStatus();

      if (result.success) {
        setOnboardingStatus(result.status);
      } else {
        console.error('Failed to fetch onboarding status:', result.error);
      }
    } catch (error) {
      console.error('Error fetching onboarding status:', error);
    } finally {
      setStripeLoading(false);
    }
  };

  const handleStripeModalClose = () => {
    setShowStripeModal(false);
    // Refresh onboarding status after modal closes
    fetchOnboardingStatus();
  };

  const handleStripeSuccess = () => {
    setShowStripeModal(false);
    // Refresh onboarding status after successful connection
    fetchOnboardingStatus();
    toast.success('Stripe account connected successfully!');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field]
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let result;
      if (userType === 'business') {
        const updateBusinessProfile = {
          business_name: formData.business_name,
          business_email: formData.business_email,
          business_phone: formData.business_phone,
          website: formData.website,
          registration_no: formData.registration_no,
        }
        if (formData.business_address) {
          updateBusinessProfile.business_address = formData.business_address;
        }
        if (formData.business_city) {
          updateBusinessProfile.business_city = formData.business_city;
        }
        if (formData.business_state) {
          updateBusinessProfile.business_state = formData.business_state;
        }
        if (formData.business_country) {
          updateBusinessProfile.business_country = formData.business_country;
        }
        if (formData.business_industry) {
          updateBusinessProfile.industry = formData.business_industry;
        }
        if (formData.business_logo_url) {
          updateBusinessProfile.business_logo_url = formData.business_logo_url;
        }
        if (formData.business_cover_url) {
          updateBusinessProfile.business_cover_url = formData.business_cover_url;
        }
        if (formData.description) {
          updateBusinessProfile.description = formData.description;
        }
        result = await authService.updateBusiness(business.id, updateBusinessProfile);
      } else {
        const updatedUserProfile = {}
        if (formData.profile_picture) {
          updatedUserProfile.profile_picture = formData.profile_picture;
        }
        if (formData.first_name) {
          updatedUserProfile.first_name = formData.first_name;
        }
        if (formData.last_name) {
          updatedUserProfile.last_name = formData.last_name;
        }
        if (formData.email) {
          updatedUserProfile.email = formData.email;
        }
        if (formData.phone_number) {
          result = await authService.updateUser(updatedUserProfile);
        }
      }

      if (result.success) {
        setSuccess('Profile updated successfully!');
        updateUser(result.data);
        setIsEditing(false);
        setImagePreview(null);
        toast.success('Profile updated successfully!');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords
    if (passwordData.new_password !== passwordData.confirm_password) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordData.new_password.length < 8) {
      setError('New password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await authService.changePassword(passwordData);

      if (result.success) {
        setSuccess('Password changed successfully!');
        setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
        setIsChangingPassword(false);
        toast.success('Password changed successfully!');
      } else {
        setError(result.error || 'Failed to change password');
      }
    } catch (error) {
      setError('Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      // Validate file type and size
      const validation = uploadService.validateFile(file, {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      });

      if (!validation.isValid) {
        toast.error(validation.errors.join(', '));
        return;
      }

      // Show preview immediately for profile_picture
      if (field === 'profile_picture') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
        setIsUploadingImage(true);
      }

      // Upload file based on field type
      let result;
      if (field === 'profile_picture') {
        result = await uploadService.uploadProfilePicture(file);
      } else if (field === 'business_logo_url') {
        result = await uploadService.uploadBusinessLogo(file, business?.id);
      } else if (field === 'business_cover_url') {
        result = await uploadService.uploadBusinessCover(file, business?.id);
      } else {
        result = await uploadService.uploadFile(file);
      }

      if (result.success) {
        // Update form data with the uploaded URL
        setFormData(prev => ({
          ...prev,
          [field]: result.url
        }));

        toast.success('File uploaded successfully!');
      } else {
        toast.error(result.error || 'Failed to upload file');
        if (field === 'profile_picture') {
          setImagePreview(null); // Clear preview on error
        }
      }
    } catch (error) {
      console.error('File upload error:', error);
      toast.error('Failed to upload file');
      if (field === 'profile_picture') {
        setImagePreview(null); // Clear preview on error
      }
    } finally {
      if (field === 'profile_picture') {
        setIsUploadingImage(false);
      }
    }
  };

  const getUserInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
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

  const passwordStrength = getPasswordStrength(passwordData.new_password);
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">

          {/* Profile Header */}
          <div className="profile-header auth-card mb-6 sm:mb-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center space-x-3 sm:space-x-4 md:space-x-6 flex-1">
                {/* Profile Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 bg-gradient-to-br ${imagePreview || user?.profile_picture || user?.business_profile?.business_logo_url
                      ? 'bg-white border-2 border-gray-300'
                      : 'from-dealshark-blue to-blue-600'
                    } rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${isUploadingImage ? 'border-dealshark-blue' : ''
                    }`}>
                    {isUploadingImage ? (
                      // Loading State
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 border-4 border-dealshark-blue border-t-transparent rounded-full animate-spin mb-1"></div>
                        <span className="text-xs text-dealshark-blue font-semibold">Uploading...</span>
                      </div>
                    ) : (imagePreview || user?.profile_picture || user?.business_profile?.business_logo_url) ? (
                      // Image Preview or Uploaded Image
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview || user.profile_picture || user?.business_profile?.business_logo_url}
                          alt="Profile"
                          className="w-full h-full rounded-lg sm:rounded-xl object-contain"
                        />
                        {imagePreview && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                            <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                          </div>
                        )}
                      </div>
                    ) : (
                      // Initials
                      <span className="text-white font-bold text-xl sm:text-2xl">
                        {getUserInitials()}
                      </span>
                    )}
                  </div>
                  {isEditing && (
                    <label className={`absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-dealshark-yellow text-gray-900 p-1.5 sm:p-2 rounded-full cursor-pointer hover:bg-yellow-400 transition-all duration-300 shadow-lg ${isUploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}>
                      <CameraIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'profile_picture')}
                        className="hidden"
                        disabled={isUploadingImage}
                      />
                    </label>
                  )}
                </div>

                {/* Profile Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
                    {userType === 'business'
                      ? (business?.business_name || 'Business Profile')
                      : `${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'User Profile'
                    }
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-gray-600">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                      <EnvelopeIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-xs sm:text-sm truncate">{user?.email}</span>
                    </div>
                    {userType === 'business' && (
                      <>
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          <GlobeAltIcon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                          <span className="text-xs sm:text-sm">{business?.industry || 'Business'}</span>
                        </div>
                        {business?.is_verified && (
                          <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            <StarIcon className="h-2 w-2 sm:h-3 sm:w-3" />
                            <span className="text-xs font-medium">Verified</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full lg:w-auto">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center justify-center space-x-2 animate-fade-in-up text-sm sm:text-base py-2.5 sm:py-3"
                  >
                    <PencilIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Edit Profile</span>
                  </button>
                ) : (
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full lg:w-auto">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setImagePreview(null);
                      }}
                      className="btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base py-2.5 sm:py-3"
                    >
                      <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={handleProfileUpdate}
                      disabled={loading}
                      className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base py-2.5 sm:py-3"
                    >
                      {loading ? (
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                      )}
                      <span>Save Changes</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stripe Connect Section */}
          <div className="stripe-connect-section auth-card mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <CreditCardIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-dealshark-blue flex-shrink-0" />
              <span>Payment Account</span>
            </h2>

            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-0">
                <div className="flex items-center space-x-3 sm:space-x-4 flex-1">
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ${onboardingStatus?.details_submitted
                    ? 'bg-green-500'
                    : 'bg-gradient-to-br from-purple-500 to-indigo-600'
                    }`}>
                    {onboardingStatus?.details_submitted ? (
                      <CheckCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    ) : (
                      <CreditCardIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 break-words">
                      {onboardingStatus?.details_submitted ? 'Stripe Account Connected' : 'Connect Stripe Account'}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {onboardingStatus?.details_submitted
                        ? 'Your payment account is ready to receive payments'
                        : 'Connect your Stripe account to receive payments and commissions'
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full lg:w-auto">
                  {onboardingStatus?.details_submitted ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-600 font-medium text-xs sm:text-sm">Connected</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowStripeModal(true)}
                      disabled={stripeLoading}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg sm:rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2 w-full lg:w-auto justify-center"
                    >
                      {stripeLoading ? (
                        <>
                          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading...</span>
                        </>
                      ) : (
                        <>
                          <CreditCardIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span>Connect Now</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Status Details */}
              {onboardingStatus && (
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-purple-200">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${onboardingStatus.payouts_enabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      <span className="text-xs sm:text-sm text-gray-600">
                        Payouts: {onboardingStatus.payouts_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${onboardingStatus.charges_enabled ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      <span className="text-xs sm:text-sm text-gray-600">
                        Charges: {onboardingStatus.charges_enabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${onboardingStatus.details_submitted ? 'bg-green-500' : 'bg-gray-300'
                        }`}></div>
                      <span className="text-xs sm:text-sm text-gray-600">
                        Details: {onboardingStatus.details_submitted ? 'Submitted' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error/Success Messages */}
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

          {/* Profile Information */}
          <div className="profile-info auth-card mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Profile Information</h2>

            <form onSubmit={handleProfileUpdate} className="space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div className="personal-info-section">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-dealshark-blue flex-shrink-0" />
                  <span>Personal Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="form-group">
                    <label className="form-label uppercase text-xs sm:text-sm">FIRST NAME*</label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="custom-input text-sm sm:text-base"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label uppercase text-xs sm:text-sm">LAST NAME*</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="custom-input text-sm sm:text-base"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label uppercase text-xs sm:text-sm">EMAIL ADDRESS*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="custom-input text-sm sm:text-base"
                      disabled={!isEditing}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label uppercase text-xs sm:text-sm">PHONE NUMBER</label>
                    <input
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleInputChange}
                      className="custom-input text-sm sm:text-base"
                      disabled={!isEditing}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
              </div>

              {/* Business Information (for business users) */}
              {userType === 'business' && (
                <div className="business-info-section">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                    <BuildingOfficeIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-dealshark-blue flex-shrink-0" />
                    <span>Business Information</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">BUSINESS NAME*</label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">BUSINESS EMAIL</label>
                      <input
                        type="email"
                        name="business_email"
                        value={formData.business_email}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="Enter business email"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">BUSINESS PHONE</label>
                      <input
                        type="tel"
                        name="business_phone"
                        value={formData.business_phone}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="Enter business phone"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">WEBSITE</label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">REGISTRATION NUMBER</label>
                      <input
                        type="text"
                        name="registration_no"
                        value={formData.registration_no}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="Enter registration number"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">INDUSTRY</label>
                      <select
                        name="business_industry"
                        value={formData.business_industry}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                      >
                        <option value="">Select Industry</option>
                        <option value="Food">Food</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Fitness">Fitness</option>
                        <option value="Travel">Travel</option>
                        <option value="Home">Home</option>
                        <option value="Books">Books</option>
                        <option value="Crafting">Crafting</option>
                        <option value="Automotive">Automotive</option>
                        <option value="Sports">Sports</option>
                        <option value="Health">Health</option>
                        <option value="Education">Education</option>
                        <option value="Entertainment">Entertainment</option>
                      </select>
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label uppercase text-xs sm:text-sm">BUSINESS ADDRESS</label>
                      <input
                        type="text"
                        name="business_address"
                        value={formData.business_address}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="Enter business address"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">CITY</label>
                      <input
                        type="text"
                        name="business_city"
                        value={formData.business_city}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="Enter city"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">STATE</label>
                      <input
                        type="text"
                        name="business_state"
                        value={formData.business_state}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="Enter state"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label uppercase text-xs sm:text-sm">COUNTRY</label>
                      <input
                        type="text"
                        name="business_country"
                        value={formData.business_country}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="Enter country"
                      />
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label uppercase text-xs sm:text-sm">DESCRIPTION</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="custom-input text-sm sm:text-base"
                        disabled={!isEditing}
                        placeholder="Describe your business"
                        rows="3"
                      />
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Security Settings */}
          <div className="security-settings auth-card">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
              <ShieldCheckIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-dealshark-blue flex-shrink-0" />
              <span>Security Settings</span>
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Change Password Section */}
              <div className="password-section">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                    <KeyIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-dealshark-blue flex-shrink-0" />
                    <span>Change Password</span>
                  </h3>
                  {!isChangingPassword && (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="btn-secondary text-xs sm:text-sm py-2 px-4 w-full sm:w-auto"
                    >
                      Change Password
                    </button>
                  )}
                </div>

                {isChangingPassword && (
                  <form onSubmit={handlePasswordUpdate} className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="form-group">
                        <label className="form-label uppercase text-xs sm:text-sm">CURRENT PASSWORD*</label>
                        <div className="relative">
                          <input
                            type={showPasswords.current ? 'text' : 'password'}
                            name="current_password"
                            value={passwordData.current_password}
                            onChange={handlePasswordChange}
                            className="custom-input pr-10 sm:pr-12 text-sm sm:text-base"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('current')}
                            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                          >
                            {showPasswords.current ? (
                              <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label uppercase text-xs sm:text-sm">NEW PASSWORD*</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? 'text' : 'password'}
                            name="new_password"
                            value={passwordData.new_password}
                            onChange={handlePasswordChange}
                            className="custom-input pr-10 sm:pr-12 text-sm sm:text-base"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('new')}
                            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                          >
                            {showPasswords.new ? (
                              <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </button>
                        </div>

                        {/* Password Strength Indicator */}
                        {passwordData.new_password && (
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

                      <div className="form-group md:col-span-2">
                        <label className="form-label uppercase text-xs sm:text-sm">CONFIRM NEW PASSWORD*</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            name="confirm_password"
                            value={passwordData.confirm_password}
                            onChange={handlePasswordChange}
                            className="custom-input pr-10 sm:pr-12 text-sm sm:text-base"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility('confirm')}
                            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-dealshark-blue transition-colors duration-300"
                          >
                            {showPasswords.confirm ? (
                              <EyeSlashIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            ) : (
                              <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                            )}
                          </button>
                        </div>
                        {passwordData.confirm_password && passwordData.new_password === passwordData.confirm_password && (
                          <div className="mt-2 flex items-center text-green-600 animate-fade-in-up">
                            <CheckIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            <span className="text-xs sm:text-sm font-medium">Passwords match</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                      <button
                        type="button"
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
                        }}
                        className="btn-secondary text-sm sm:text-base py-2.5 px-4"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary text-sm sm:text-base py-2.5 px-4"
                      >
                        {loading ? (
                          <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          'Update Password'
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Account Information */}
              <div className="account-info-section">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                  <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-dealshark-blue flex-shrink-0" />
                  <span>Account Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="detail-item">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <UserIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base text-gray-900">User Type</span>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base capitalize">{userType}</p>
                  </div>

                  <div className="detail-item">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base text-gray-900">Member Since</span>
                    </div>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div className="detail-item">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <ShieldCheckIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base text-gray-900">Account Status</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                    </p>
                  </div>

                  <div className="detail-item">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2">
                      <EnvelopeIcon className="h-4 w-4 sm:h-5 sm:w-5 text-dealshark-blue flex-shrink-0" />
                      <span className="font-medium text-sm sm:text-base text-gray-900">Email Verified</span>
                    </div>
                    <p className="text-gray-600">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Verified
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Stripe Connect Modal */}
      <StripeConnectModal
        isOpen={showStripeModal}
        onClose={handleStripeModalClose}
        userType={userType}
        onSuccess={handleStripeSuccess}
      />
    </div>
  );
};

export default ProfilePage;