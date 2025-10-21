import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    CheckCircleIcon,
    CurrencyDollarIcon,
    GiftIcon,
    StarIcon,
    UsersIcon,
    ArrowRightIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    SparklesIcon,
    BuildingOfficeIcon,
    UserIcon,
    CalendarIcon,
    MapPinIcon,
    GlobeAltIcon,
    PhoneIcon,
    EnvelopeIcon
} from '@heroicons/react/24/outline';

import toast from 'react-hot-toast';
import { referralsService } from '../services';

const ReferralPage = () => {
    const { refId } = useParams();
    const navigate = useNavigate();
    const [referralData, setReferralData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [billableAmount, setBillableAmount] = useState('');
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    useEffect(() => {
        if (refId) {
            fetchReferralData();
        }
    }, [refId]);

    const fetchReferralData = async () => {
        try {
            setLoading(true);
            const result = await referralsService.verifyReferral(refId);

            if (result.success) {
                setReferralData(result.referral);
            } else {
                setError(result.error || 'Failed to load referral data');
            }
        } catch (err) {
            console.error('Error fetching referral data:', err);
            setError('Failed to load referral data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!billableAmount || parseFloat(billableAmount) <= 0) {
            toast.error('Please enter a valid billable amount');
            return;
        }

        setIsProcessingPayment(true);

        try {
            const result = await referralsService.createPayment(refId, parseFloat(billableAmount));

            if (result.success && result.payment?.checkout_url) {
                // Redirect to Stripe Checkout using the provided checkout URL
                window.location.href = result.payment.checkout_url;
            } else {
                throw new Error(result.error || 'Failed to create payment');
            }
        } catch (err) {
            console.error('Payment error:', err);
            toast.error(err.message || 'Failed to process payment. Please try again.');
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const getDealIcon = (industry) => {
        const icons = {
            'Food': '🍽️',
            'Electronics': '📱',
            'Fashion': '👗',
            'Beauty': '💄',
            'Fitness': '💪',
            'Travel': '✈️',
            'Home': '🏠',
            'Books': '📚',
            'Crafting': '🎨',
            'Automotive': '🚗',
            'Sports': '⚽',
            'Health': '🏥',
            'Education': '📚',
            'Entertainment': '🎬'
        };
        return icons[industry] || '🛍️';
    };

    const getRewardDisplay = (deal) => {
        if (deal.reward_type === 'commission') {
            return `${deal.customer_incentive}% Commission`;
        } else if (deal.reward_type === 'no_reward') {
            return 'Special Offer';
        } else {
            return 'Reward Available';
        }
    };

    const getRewardColor = (deal) => {
        if (deal.reward_type === 'commission') {
            return 'from-green-500 to-emerald-500';
        } else if (deal.reward_type === 'no_reward') {
            return 'from-blue-500 to-indigo-500';
        } else {
            return 'from-purple-500 to-pink-500';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-dealshark-blue via-blue-600 to-dealshark-blue-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading referral details...</p>
                </div>
            </div>
        );
    }

    if (error || !referralData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-dealshark-blue via-blue-600 to-dealshark-blue-dark flex items-center justify-center">
                <div className="text-center text-white max-w-md mx-auto px-4">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">❌</span>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Referral Not Found</h2>
                    <p className="text-blue-100 mb-6">{error || 'This referral link is invalid or has expired.'}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-dealshark-yellow text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-yellow-400 transition-colors"
                    >
                        Go to Homepage
                    </button>
                </div>
            </div>
        );
    }

    const { deal, business, referrer } = referralData;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-600 to-dealshark-blue pt-8">
            {/* Header */}
            <div className="flex justify-center">
                <div className='max-w-7xl px-4 sm:px-6 lg:px-8 w-full'>
                    <div className="px-4 sm:px-6 lg:px-8 py-6 bg-white rounded-xl w-full">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl flex items-center justify-center">
                                    <SparklesIcon className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">DealShark</h1>
                                    <p className="text-sm text-gray-600">Referral Link</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-green-100 rounded-xl px-4 py-2">
                                <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                                <span>Secure Payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Deal Card */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-8">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-16 h-16 ${business.business_logo_url ? 'bg-white border border-gray-300' : 'bg-gradient-to-br from-dealshark-blue to-blue-600'} rounded-2xl flex items-center justify-center shadow-lg`}>
                                            {business.business_logo_url ? (
                                                <img
                                                    src={business.business_logo_url}
                                                    alt={business.business_name}
                                                    className="w-12 h-12 rounded-xl object-contain"
                                                />
                                            ) : (
                                                <span className="text-white text-2xl">
                                                    {getDealIcon(business.industry)}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 mb-1">{business.business_name}</h2>
                                            <div className="flex items-center space-x-2">
                                                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full font-medium">
                                                    {business.industry}
                                                </span>
                                                {deal.is_featured && (
                                                    <span className="px-3 py-1 bg-dealshark-yellow text-gray-900 text-sm rounded-full font-bold flex items-center">
                                                        <StarIcon className="h-3 w-3 mr-1 fill-current" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`inline-flex items-center px-4 py-2 rounded-xl text-white text-sm font-bold bg-gradient-to-r ${getRewardColor(deal)} shadow-lg`}>
                                        {deal.reward_type === 'commission' ? (
                                            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                                        ) : (
                                            <GiftIcon className="h-4 w-4 mr-2" />
                                        )}
                                        {getRewardDisplay(deal)}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{deal.deal_name}</h3>
                                    <p className="text-gray-600 leading-relaxed">{deal.deal_description}</p>
                                </div>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center">
                                            <UsersIcon className="h-4 w-4 mr-1" />
                                            <span>{deal.subscribers_count} subscribers</span>
                                        </div>
                                        <div className="flex items-center">
                                            <CalendarIcon className="h-4 w-4 mr-1" />
                                            <span>Created {new Date(deal.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${deal.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {deal.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Business Information */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <BuildingOfficeIcon className="h-6 w-6 mr-2 text-dealshark-blue" />
                                    Business Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="font-medium text-gray-900">{business.business_email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-medium text-gray-900">{business.business_phone}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <MapPinIcon className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-500">Location</p>
                                                <p className="font-medium text-gray-900">
                                                    {business.business_city}, {business.business_state}
                                                </p>
                                            </div>
                                        </div>
                                        {business.website && (
                                            <div className="flex items-center space-x-3">
                                                <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Website</p>
                                                    <a
                                                        href={business.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="font-medium text-dealshark-blue hover:text-blue-700"
                                                    >
                                                        {business.website}
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {business.description && (
                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <p className="text-gray-600 leading-relaxed">{business.description}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Referrer Information */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <UserIcon className="h-6 w-6 mr-2 text-dealshark-blue" />
                                    Referred by
                                </h3>

                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                                        <span className="text-white text-xl font-bold">
                                            {referrer.first_name?.[0]}{referrer.last_name?.[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-gray-900">
                                            {referrer.first_name} {referrer.last_name}
                                        </h4>
                                        <p className="text-gray-600">@{referrer.username}</p>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                            <span className="text-sm text-green-600">Verified User</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-8">
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <CreditCardIcon className="h-6 w-6 mr-2 text-dealshark-blue" />
                                    Complete Purchase
                                </h3>

                                <div className="space-y-6">
                                    {/* Deal Summary */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Deal Summary</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Business:</span>
                                                <span className="font-medium">{business.business_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Deal:</span>
                                                <span className="font-medium">{deal.deal_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Reward:</span>
                                                <span className="font-medium text-green-600">{getRewardDisplay(deal)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Form */}
                                    <div>
                                        <label htmlFor="billableAmount" className="block text-sm font-semibold text-gray-900 mb-2">
                                            Enter Billable Amount
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                id="billableAmount"
                                                value={billableAmount}
                                                onChange={(e) => setBillableAmount(e.target.value)}
                                                placeholder="0.00"
                                                min="0"
                                                step="0.01"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-dealshark-blue focus:border-transparent"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Enter the amount you want to pay for this deal</p>
                                    </div>

                                    {/* Pay Button */}
                                    <button
                                        onClick={handlePayment}
                                        disabled={!billableAmount || parseFloat(billableAmount) <= 0 || isProcessingPayment}
                                        className="w-full bg-gradient-to-r from-dealshark-blue to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
                                    >
                                        {isProcessingPayment ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <CreditCardIcon className="h-6 w-6" />
                                                <span>Pay Now</span>
                                                <ArrowRightIcon className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>

                                    {/* Security Notice */}
                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex items-center space-x-3">
                                            <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                                            <div>
                                                <p className="font-semibold text-green-900 text-sm">Secure Payment</p>
                                                <p className="text-xs text-green-700">
                                                    Powered by Stripe - your payment information is encrypted and secure
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReferralPage;
