import React, { useState } from 'react';
import { 
  CreditCardIcon, 
  BanknotesIcon, 
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const PaymentMethodConnect = ({ 
  onConnect, 
  onDisconnect, 
  isConnected = false, 
  paymentMethod = null,
  className = "",
  variant = "default" // "default", "minimal", "card"
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    setIsConnecting(true);
    setError('');
    
    try {
      // Simulate payment method connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onConnect) {
        await onConnect();
      }
    } catch (err) {
      setError('Failed to connect payment method. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (onDisconnect) {
      await onDisconnect();
    }
  };

  // Default variant
  if (variant === "default") {
    return (
      <div className={`bg-white rounded-2xl border-2 border-gray-100 hover:border-dealshark-blue/30 transition-all duration-300 ${className}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl flex items-center justify-center">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Payment Method</h3>
                <p className="text-sm text-gray-600">Connect your payment method to receive commissions</p>
              </div>
            </div>
            
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-green-600">Connected</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600">Not Connected</span>
              </div>
            )}
          </div>

          {/* Content */}
          {isConnected ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <BanknotesIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-green-900">
                        {paymentMethod?.type || 'Credit Card'} •••• {paymentMethod?.last4 || '1234'}
                      </p>
                      <p className="text-sm text-green-700">
                        Connected on {paymentMethod?.connectedDate || 'Dec 15, 2024'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                <span>Your payment information is secure and encrypted</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                      <CreditCardIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">No payment method connected</p>
                      <p className="text-sm text-gray-600">Connect to start receiving commissions</p>
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting...</span>
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-5 w-5" />
                    <span>Connect Payment Method</span>
                    <ArrowRightIcon className="h-4 w-4" />
                  </>
                )}
              </button>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShieldCheckIcon className="h-4 w-4 text-dealshark-blue" />
                <span>Secure payment processing powered by Stripe</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Minimal variant
  if (variant === "minimal") {
    return (
      <div className={`${className}`}>
        {isConnected ? (
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-green-700">
                Payment method connected
              </span>
            </div>
            <button
              onClick={handleDisconnect}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="w-full flex items-center justify-center space-x-2 bg-dealshark-blue hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors disabled:opacity-50"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <CreditCardIcon className="h-4 w-4" />
                <span>Connect Payment Method</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 hover:border-dealshark-blue/30 transition-all duration-300 ${className}`}>
        <div className="p-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <CreditCardIcon className="h-8 w-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Setup</h3>
            <p className="text-gray-600 mb-6">
              Connect your payment method to receive commissions from referrals
            </p>

            {isConnected ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    <span className="font-medium text-green-700">Payment Method Connected</span>
                  </div>
                  <p className="text-sm text-green-600">
                    {paymentMethod?.type || 'Credit Card'} •••• {paymentMethod?.last4 || '1234'}
                  </p>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Disconnect Payment Method
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                <button
                  onClick={handleConnect}
                  disabled={isConnecting}
                  className="w-full bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting Payment Method...</span>
                    </>
                  ) : (
                    <>
                      <CreditCardIcon className="h-6 w-6" />
                      <span>Connect Payment Method</span>
                      <ArrowRightIcon className="h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <ShieldCheckIcon className="h-4 w-4 text-dealshark-blue" />
                  <span>Secure & encrypted payment processing</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default PaymentMethodConnect;
