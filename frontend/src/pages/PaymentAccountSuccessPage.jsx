import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';

const PaymentAccountSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshProfile } = useAuth();

  useEffect(() => {
    // Refresh profile to update business details_submitted status
    setTimeout(() => {
        refreshProfile();
    }, 500);
  }, []);

  const accountId = searchParams.get('account_id');

  const handleGoHome = () => {
    navigate('/');
  };

  const handleViewDeals = () => {
    navigate('/business/deals');
  };

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 to-dealshark-blue flex items-center justify-center px-4">
      <div className="max-w-md w-full pt-10">
        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircleIcon className="h-12 w-12 text-green-500" />
            </div>
            
            <h1 className="text-3xl font-bold mb-2">Payment Account Connected!</h1>
            <p className="text-green-100">
              Your payment account has been successfully connected
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Account Details */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <BanknotesIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">All Set!</h3>
                  <p className="text-sm text-gray-600">Your deals are now active</p>
                </div>
              </div>
              
              {accountId && (
                <div className="bg-white rounded-lg p-3 mt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CreditCardIcon className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm text-gray-600">Account ID:</span>
                    </div>
                    <span className="font-mono text-xs bg-gray-100 px-3 py-1 rounded">
                      {accountId.substring(0, 20)}...
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Success Message */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
              <h2 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                What's Next?
              </h2>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Your deals are now active and visible to customers</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>You can now receive referral payments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Start tracking your subscribers and earnings</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleViewDeals}
                className="w-full bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <BanknotesIcon className="h-5 w-5" />
                <span>View My Deals</span>
                <ArrowRightIcon className="h-4 w-4" />
              </button>

              <button
                onClick={handleGoToProfile}
                className="w-full border-2 border-dealshark-blue text-dealshark-blue hover:bg-dealshark-blue hover:text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Go to Profile
              </button>

              <button
                onClick={handleGoHome}
                className="w-full text-gray-600 hover:text-dealshark-blue py-2 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <HomeIcon className="h-4 w-4" />
                <span>Go Home</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-white/90 mb-2">
            🎉 Congratulations on setting up your payment account!
          </p>
          <p className="text-xs text-white/70">
            Need help? Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentAccountSuccessPage;

