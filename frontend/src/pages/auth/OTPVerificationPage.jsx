import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  CheckCircleIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  ArrowPathIcon,
  EnvelopeIcon,
  KeyIcon
} from '@heroicons/react/24/outline';
import StripeConnectModal from '../../components/common/StripeConnectModal';

const OTPVerificationPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [userType, setUserType] = useState('customer');
  const { verifyOTP, resendOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const email = location.state?.email || 'user@example.com';

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-submit when all fields are filled
    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleSubmit();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const result = await verifyOTP(email, otpString, 'email');
      
      if (result.success) {
        setSuccess('Email verified successfully! Welcome to DealShark!');
        
        // Determine user type from the verification result
        const verifiedUserType = result.user?.user_type || result.business ? 'business' : 'customer';
        setUserType(verifiedUserType);
        
        // Show Stripe Connect modal after a short delay
        setTimeout(() => {
          setShowStripeModal(true);
        }, 1500);
      } else {
        setError(result.error || 'Verification failed. Please try again.');
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setError('');
    setSuccess('');
    
    try {
      const result = await resendOTP(email, 'email');
      
      if (result.success) {
        setSuccess('Verification code sent successfully!');
        
        // Reset countdown
        setCountdown(60);
        setCanResend(false);
        
        // Start countdown
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              setCanResend(true);
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.error || 'Failed to resend code. Please try again.');
      }
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    }
  };

  const handleStripeModalClose = () => {
    setShowStripeModal(false);
    // Navigate to appropriate dashboard after closing modal
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  const handleStripeSuccess = () => {
    setShowStripeModal(false);
    // Navigate to appropriate dashboard after successful Stripe connection
    setTimeout(() => {
      navigate('/');
    }, 500);
  };

  // Start countdown on component mount
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-dealshark-blue">
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-8rem)]">
            
            {/* Left Side - Welcome Section */}
            <div className="otp-welcome animate-fade-in-left">
              <div className="welcome-content text-white">
                <h2 className="welcome-title text-5xl font-bold mb-6 leading-tight">
                  Verify Your <span className="text-dealshark-yellow">Email</span>
                </h2>
                <p className="welcome-subtitle text-xl text-purple-100 mb-12 leading-relaxed">
                  We've sent a verification code to your email address. Enter the code below to complete your account setup and start earning.
                </p>
                
                {/* Mascot above benefits */}
                <div className="mascot-container mb-12 animate-float">
                  <div className="w-32 h-32 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-6xl shadow-yellow">
                    📧
                  </div>
                </div>
                
                <div className="welcome-benefits space-y-8">
                  <div className="benefit-item flex items-center space-x-6 group hover-lift animate-fade-in-left delay-200">
                    <div className="benefit-icon w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-2xl group-hover:animate-pulse-gentle transition-all duration-300">
                      🔒
                    </div>
                    <div className="benefit-text">
                      <h4 className="text-xl font-semibold mb-2">Secure Verification</h4>
                      <p className="text-purple-100">Your account is protected with industry-standard security</p>
                    </div>
                  </div>
                  
                  <div className="benefit-item flex items-center space-x-6 group hover-lift animate-fade-in-left delay-400">
                    <div className="benefit-icon w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-2xl group-hover:animate-pulse-gentle transition-all duration-300">
                      ⚡
                    </div>
                    <div className="benefit-text">
                      <h4 className="text-xl font-semibold mb-2">Instant Access</h4>
                      <p className="text-purple-100">Get immediate access to all DealShark features</p>
                    </div>
                  </div>
                  
                  <div className="benefit-item flex items-center space-x-6 group hover-lift animate-fade-in-left delay-600">
                    <div className="benefit-icon w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center text-2xl group-hover:animate-pulse-gentle transition-all duration-300">
                      ✅
                    </div>
                    <div className="benefit-text">
                      <h4 className="text-xl font-semibold mb-2">Verified Account</h4>
                      <p className="text-purple-100">Join our community of verified users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - OTP Form */}
            <div className="otp-form-container animate-fade-in-right">
              <div className="otp-form-wrapper auth-card">
                <h1 className="otp-title text-3xl font-bold text-gray-900 mb-8 text-center">
                  Email Verification
                </h1>
                
                <div className="verification-info text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <EnvelopeIcon className="h-10 w-10 text-white" />
                  </div>
                  <p className="text-gray-600 mb-2">
                    We've sent a 6-digit code to
                  </p>
                  <p className="font-semibold text-gray-900 text-lg">{email}</p>
                </div>

                {error && (
                  <div className="error-message mb-6 p-4 bg-red-50 border border-red-200 rounded-xl animate-slide-in-top">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="success-message mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-slide-in-top">
                    <p className="text-green-600 text-sm font-medium">{success}</p>
                  </div>
                )}

                {/* OTP Form */}
                <form className="otp-form space-y-8" onSubmit={handleSubmit}>
                  <div className="otp-inputs flex justify-center space-x-3 animate-fade-in-up delay-200">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-14 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-dealshark-blue focus:border-dealshark-blue transition-all duration-200 hover:border-dealshark-blue"
                        maxLength="1"
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || otp.join('').length !== 6}
                    className="verify-btn w-full btn-secondary flex items-center justify-center space-x-2 animate-fade-in-up delay-400"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Verify Email</span>
                        <CheckCircleIcon className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </form>

                {/* Resend Section */}
                <div className="resend-section mt-8 text-center animate-fade-in-up delay-600">
                  <div className="mb-4">
                    {canResend ? (
                      <button
                        onClick={handleResend}
                        className="resend-btn inline-flex items-center text-dealshark-blue hover:text-blue-700 font-semibold transition-colors duration-300"
                      >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Resend code
                      </button>
                    ) : (
                      <div className="flex items-center justify-center text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-2" />
                        <span className="font-medium">Resend code in {countdown}s</span>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-500 mb-6">
                    Didn't receive the code? Check your spam folder or{' '}
                    <button className="text-dealshark-blue hover:text-blue-700 underline font-medium">
                      contact support
                    </button>
                  </p>
                </div>

                {/* Progress Indicator */}
                <div className="progress-indicator mt-8 animate-fade-in-up delay-800">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-dealshark-blue rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                        1
                      </div>
                      <span className="font-medium">Sign Up</span>
                    </div>
                    <div className="w-8 h-0.5 bg-dealshark-blue"></div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-dealshark-blue rounded-full flex items-center justify-center text-white text-xs font-bold mr-2">
                        2
                      </div>
                      <span className="font-medium">Verify Email</span>
                    </div>
                    <div className="w-8 h-0.5 bg-gray-300"></div>
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-gray-500 text-xs font-bold mr-2">
                        3
                      </div>
                      <span className="font-medium">Complete</span>
                    </div>
                  </div>
                </div>

                {/* Back to Login */}
                <div className="otp-footer mt-8 text-center animate-fade-in-up delay-1000">
                  <p className="text-gray-600 text-responsive-base">
                    Need help?{' '}
                    <button 
                      className="login-link text-dealshark-blue hover:text-blue-700 font-bold transition-colors duration-300 hover:underline"
                      onClick={() => navigate('/login')}
                    >
                      Contact Support
                    </button>
                  </p>
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

export default OTPVerificationPage;