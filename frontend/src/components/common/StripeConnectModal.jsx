import React, { useState } from 'react';
import { 
  CreditCardIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  XMarkIcon,
  SparklesIcon,
  BanknotesIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { referralsService } from '../../services';

const StripeConnectModal = ({ 
  isOpen, 
  onClose, 
  userType = 'customer',
  onSuccess 
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  const handleStripeConnect = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      // Call the API to create onboarding link
      const result = await referralsService.createOnboardingLink();
      
      if (result.success && result.link?.onboarding_url) {
        // Redirect to Stripe onboarding URL
        window.location.href = result.link.onboarding_url;
      } else {
        throw new Error(result.error || 'Failed to create Stripe onboarding link');
      }
    } catch (err) {
      console.error('Stripe connect error:', err);
      setError(err.message || 'Failed to connect with Stripe. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const benefits = userType === 'business' ? [
    {
      icon: '💰',
      title: 'Receive Payments',
      description: 'Get paid for commissions and referrals instantly'
    },
    {
      icon: '🛡️',
      title: 'Secure Processing',
      description: 'Bank-level security with Stripe\'s trusted platform'
    },
    {
      icon: '📊',
      title: 'Track Earnings',
      description: 'Monitor your revenue and payment history'
    },
    {
      icon: '⚡',
      title: 'Instant Transfers',
      description: 'Fast and reliable payment processing'
    }
  ] : [
    {
      icon: '💳',
      title: 'Receive Commissions',
      description: 'Get paid for successful referrals instantly'
    },
    {
      icon: '🛡️',
      title: 'Secure & Safe',
      description: 'Your financial data is protected with Stripe'
    },
    {
      icon: '📈',
      title: 'Track Earnings',
      description: 'Monitor your referral commissions easily'
    },
    {
      icon: '⚡',
      title: 'Quick Payouts',
      description: 'Fast and reliable commission payments'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#00000044] backdrop-blur-xs bg-opacity-50 transition-opacity" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full mx-auto transform transition-all duration-500 scale-100">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-300"
          >
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>

          <div className="flex flex-col lg:flex-row min-h-[600px]">
            {/* Left Side - Benefits */}
            <div className="lg:w-1/2 bg-gradient-to-br from-dealshark-blue via-blue-600 to-dealshark-blue-dark p-8 lg:p-12 rounded-l-3xl text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-20 h-20 bg-dealshark-yellow rounded-full"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-dealshark-yellow rounded-full"></div>
                <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                <div className="mb-8">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-dealshark-yellow rounded-2xl flex items-center justify-center">
                      <SparklesIcon className="h-6 w-6 text-gray-900" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Connect with Stripe</h2>
                      <p className="text-blue-100">Secure payment processing</p>
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-4">
                    {userType === 'business' ? 'Start Receiving Payments' : 'Start Earning Commissions'}
                  </h3>
                  <p className="text-xl text-blue-100 leading-relaxed">
                    {userType === 'business' 
                      ? 'Connect your Stripe account to receive payments from referrals and manage your business finances securely.'
                      : 'Connect your payment method to receive commissions from successful referrals instantly.'
                    }
                  </p>
                </div>

                <div className="space-y-6">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-4 group hover-lift">
                      <div className="w-12 h-12 bg-dealshark-yellow rounded-xl flex items-center justify-center text-xl group-hover:animate-pulse-gentle transition-all duration-300">
                        {benefit.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1">{benefit.title}</h4>
                        <p className="text-blue-100 text-sm">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Connect Form */}
            <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <CreditCardIcon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Connect Your Account
                </h3>
                <p className="text-gray-600 text-lg">
                  {userType === 'business' 
                    ? 'Set up your Stripe account to start receiving payments'
                    : 'Connect your payment method to receive commissions'
                  }
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Security Badge */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Bank-Level Security</p>
                      <p className="text-sm text-green-700">
                        Powered by Stripe - trusted by millions of businesses worldwide
                      </p>
                    </div>
                  </div>
                </div>

                {/* Connect Button */}
                <button
                  onClick={handleStripeConnect}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-4 px-8 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting to Stripe...</span>
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="h-6 w-6" />
                      <span>Connect with Stripe</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </button>

                {/* Skip Button */}
                <button
                  onClick={handleSkip}
                  className="w-full text-gray-600 hover:text-gray-800 py-3 px-6 rounded-xl font-medium transition-colors duration-300"
                >
                  Skip for now
                </button>

                {/* Additional Info */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    You can always connect your payment method later in your account settings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeConnectModal;
