import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  XCircleIcon, 
  ExclamationTriangleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ArrowPathIcon,
  CreditCardIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

const PaymentFailurePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Extract payment details from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const amount = urlParams.get('amount');
    const referralCode = urlParams.get('referral_code');
    const error = urlParams.get('error');
    
    if (paymentIntentId) {
      setPaymentDetails({
        payment_intent: paymentIntentId,
        amount: amount,
        referral_code: referralCode
      });
    }

    // Set error message
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    } else {
      setErrorMessage('Payment could not be processed. Please try again.');
    }
  }, [location]);

  const handleRetryPayment = () => {
    // Navigate back to the referral page or payment page
    if (paymentDetails?.referral_code) {
      navigate(`/ref/${paymentDetails.referral_code}`);
    } else {
      navigate('/deals');
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  const getErrorIcon = () => {
    if (errorMessage.toLowerCase().includes('card')) {
      return <CreditCardIcon className="h-12 w-12 text-red-500" />;
    } else if (errorMessage.toLowerCase().includes('insufficient')) {
      return <ExclamationTriangleIcon className="h-12 w-12 text-red-500" />;
    } else {
      return <XCircleIcon className="h-12 w-12 text-red-500" />;
    }
  };

  const getErrorTitle = () => {
    if (errorMessage.toLowerCase().includes('card')) {
      return 'Card Payment Failed';
    } else if (errorMessage.toLowerCase().includes('insufficient')) {
      return 'Insufficient Funds';
    } else if (errorMessage.toLowerCase().includes('declined')) {
      return 'Payment Declined';
    } else {
      return 'Payment Failed';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dealshark-blue to-blue-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Failure Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              {getErrorIcon()}
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{getErrorTitle()}</h1>
            <p className="text-red-100">
              We couldn't process your payment
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <h3 className="text-sm font-semibold text-red-900 mb-3 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-2 text-red-600" />
                Error Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-start">
                  <span className="text-red-700 font-medium">Error:</span>
                  <span className="text-red-800 text-right max-w-xs text-xs">
                    {errorMessage}
                  </span>
                </div>
                {paymentDetails?.amount && (
                  <div className="flex justify-between items-center">
                    <span className="text-red-700">Amount:</span>
                    <span className="font-semibold text-red-900">
                      ${parseFloat(paymentDetails.amount).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-red-700">Status:</span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <XCircleIcon className="h-3 w-3 mr-1" />
                    Failed
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Don't Worry
              </h2>
              <p className="text-gray-600 text-sm">
                Payment failures can happen for various reasons. Please try again or contact support if the issue persists.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleRetryPayment}
                className="w-full bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Try Again</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <button
                onClick={handleGoHome}
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <HomeIcon className="h-5 w-5" />
                <span>Go Home</span>
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
