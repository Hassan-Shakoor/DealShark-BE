import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  HomeIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    // Extract payment details from URL parameters
    const urlParams = new URLSearchParams(location.search);
    const paymentIntentId = urlParams.get('payment_intent');
    const amount = urlParams.get('amount');
    const referralCode = urlParams.get('referral_code');
    
    if (paymentIntentId) {
      setPaymentDetails({
        payment_intent: paymentIntentId,
        amount: amount,
        referral_code: referralCode
      });
    }
  }, [location]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewDeals = () => {
    navigate('/deals');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-dealshark-blue to-blue-600 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100">
              Your payment has been processed successfully
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Payment Details */}
            {paymentDetails && (
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                  <CreditCardIcon className="h-4 w-4 mr-2 text-green-600" />
                  Payment Details
                </h3>
                <div className="space-y-2 text-sm">
                  {paymentDetails.amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold text-gray-900">
                        ${parseFloat(paymentDetails.amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {paymentDetails.referral_code && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Referral:</span>
                      <span className="font-mono text-xs bg-gray-200 px-2 py-1 rounded">
                        {paymentDetails.referral_code}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Completed
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Success Message */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Thank You!
              </h2>
              <p className="text-gray-600 text-sm">
                Your transaction has been completed successfully. You will receive a confirmation email shortly.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGoHome}
                className="w-full bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <HomeIcon className="h-5 w-5" />
                <span>Go Home</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <button
                onClick={handleViewDeals}
                className="w-full border-2 border-dealshark-blue text-dealshark-blue hover:bg-dealshark-blue hover:text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                View More Deals
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

export default PaymentSuccessPage;
