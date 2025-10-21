import React from 'react';
import { Link } from 'react-router-dom';
import { XMarkIcon, ArrowRightIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const SignInModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCircleIcon className="h-8 w-8 text-white" />
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Sign In Required
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-6">
            Please sign in to view deal details and subscribe to amazing offers. Join DealShark today to start earning commissions!
          </p>

          {/* Buttons */}
          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Sign In</span>
              <ArrowRightIcon className="h-5 w-5" />
            </Link>

            <Link
              to="/signup"
              className="w-full border-2 border-dealshark-blue text-dealshark-blue hover:bg-dealshark-blue hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Create Account</span>
            </Link>

            <button
              onClick={onClose}
              className="w-full text-gray-600 hover:text-gray-900 px-6 py-2 font-medium transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
