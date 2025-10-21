import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  UsersIcon,
  PlusIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import './Header.css';

import dealSharkLogo from "../../assets/images/deal-shark-logo.webp"

const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/deals?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const closeMenus = () => {
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const getUserDisplayName = () => {
    return user?.firstName || user?.first_name || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:pl-3">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-18">

            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group ring-0 focus:ring-0 focus:outline-none focus-visible:outline-0" onClick={closeMenus}>
                {/* <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <span className="text-white font-bold text-lg lg:text-xl">🦈</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg lg:text-xl xl:text-2xl font-bold leading-tight">
                      <span className="text-dealshark-blue">Deal</span>
                      <span className="text-dealshark-yellow">Shark</span>
                    </span>
                    <span className="text-xs text-gray-500 hidden sm:block">Referral Platform</span>
                  </div>
                </div> */}
                <img src={dealSharkLogo} alt="DealShark Logo" className="h-7 sm:h-8 md:h-9" />
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4 lg:mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''
                  }`}>
                  <input
                    type="text"
                    placeholder="Search brands, stores, and deals..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-3 md:pl-4 pr-20 md:pr-24 py-2 md:py-3 border-2 border-gray-200 rounded-xl md:rounded-2xl text-sm md:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:border-dealshark-blue focus:ring-4 focus:ring-dealshark-blue/10 transition-all duration-300 bg-gray-50 focus:bg-white"
                  />
                  {/* Clear Button - Shows when there's text */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-12 md:right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-all duration-300"
                    >
                      <XMarkIcon className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  )}
                  {/* Search Button */}
                  <button
                    type="submit"
                    className="absolute right-1.5 md:right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 md:w-8 md:h-8 bg-gradient-to-r from-dealshark-blue to-blue-600 rounded-lg md:rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <MagnifyingGlassIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
                  </button>
                </div>
              </form>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {!isAuthenticated ? (
                <div className="flex items-center space-x-2 lg:space-x-3">
                  <Link
                    to="/login"
                    className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base text-gray-700 font-semibold hover:text-dealshark-blue transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 lg:px-6 py-2 lg:py-2.5 text-sm lg:text-base bg-gradient-to-r from-dealshark-blue to-blue-600 text-white rounded-xl lg:rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  {/* Business User Navigation */}
                  {user?.user_type === 'business' && (
                    <>
                      <Link
                        to="/create-deal"
                        className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-dealshark-blue hover:bg-gray-50 rounded-xl transition-all duration-300"
                      >
                        <PlusIcon className="h-4 w-4" />
                        <span className="font-medium">Create Deal</span>
                      </Link>
                      <Link
                        to="/business/deals"
                        className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-dealshark-blue hover:bg-gray-50 rounded-xl transition-all duration-300"
                      >
                        <ChartBarIcon className="h-4 w-4" />
                        <span className="font-medium">My Deals</span>
                      </Link>
                      <Link
                        to="/my-subscribers"
                        className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-dealshark-blue hover:bg-gray-50 rounded-xl transition-all duration-300"
                      >
                        <UsersIcon className="h-4 w-4" />
                        <span className="font-medium">Subscribers</span>
                      </Link>
                    </>
                  )}

                  {/* Customer User Navigation */}
                  {user?.user_type !== 'business' && (
                    <Link
                      to="/my-subscriptions"
                      className="flex items-center space-x-2 px-4 py-2.5 text-gray-700 hover:text-dealshark-blue hover:bg-gray-50 rounded-xl transition-all duration-300"
                    >
                      <UsersIcon className="h-4 w-4" />
                      <span className="font-medium">My Subscriptions</span>
                    </Link>
                  )}

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg lg:rounded-xl transition-all duration-300"
                    >
                      <div className="w-7 h-7 lg:w-8 lg:h-8 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                        <span className="text-white font-semibold text-xs lg:text-sm">
                          {getUserInitials()}
                        </span>
                      </div>
                      <div className="hidden xl:flex flex-col items-start">
                        <span className="text-sm font-semibold text-gray-900">
                          {getUserDisplayName()}
                        </span>
                        <span className="text-xs text-gray-500 capitalize">
                          {user?.user_type || 'User'}
                        </span>
                      </div>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''
                        }`} />
                    </button>

                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 min-w-56 lg:min-w-64 max-w-80 bg-white rounded-xl lg:rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-3 lg:px-4 py-2 lg:py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-2 lg:space-x-3">
                            <div className="min-w-8 w-8 h-8 lg:min-w-10 lg:w-10 lg:h-10 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-semibold text-xs lg:text-sm">
                                {getUserInitials()}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm lg:text-base text-gray-900 truncate">{getUserDisplayName()}</p>
                              <p className="text-xs lg:text-sm text-gray-500 truncate">{user?.email}</p>
                            </div>
                          </div>
                        </div>

                        <div className="py-2">
                          <Link
                            to="/profile"
                            className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={closeMenus}
                          >
                            <UserCircleIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                            <span>My Profile</span>
                          </Link>

                          {user?.user_type === 'business' && (
                            <>
                              <Link
                                to="/create-deal"
                                className="flex items-center md:hidden space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={closeMenus}
                              >
                                <PlusIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                <span>Create Deal</span>
                              </Link>
                              <Link
                                to="/business/deals"
                                className="flex items-center md:hidden space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={closeMenus}
                              >
                                <ChartBarIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                <span>My Business Deals</span>
                              </Link>
                              <Link
                                to="/my-subscribers"
                                className="flex items-center md:hidden space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                onClick={closeMenus}
                              >
                                <UsersIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                                <span>My Subscribers</span>
                              </Link>
                            </>
                          )}

                          {user?.user_type !== 'business' && (
                            <Link
                              to="/my-subscriptions"
                              className="flex items-center md:hidden space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base text-gray-700 hover:bg-gray-50 transition-colors"
                              onClick={closeMenus}
                            >
                              <UsersIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                              <span>My Subscriptions</span>
                            </Link>
                          )}
                        </div>

                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2 lg:py-2.5 text-sm lg:text-base text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <XMarkIcon className="h-4 w-4 lg:h-5 lg:w-5 flex-shrink-0" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 sm:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg sm:rounded-xl transition-colors"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Bars3Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-md">
            <div className="px-3 sm:px-4 py-3 sm:py-4 space-y-3 sm:space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search brands and stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 sm:pl-4 pr-16 sm:pr-20 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-dealshark-blue focus:ring-4 focus:ring-dealshark-blue/10 transition-all duration-300"
                />
                {/* Clear Button - Shows when there's text */}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-11 sm:right-13 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-all duration-300"
                  >
                    <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                )}
                {/* Search Button */}
                <button
                  type="submit"
                  className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-dealshark-blue to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center"
                >
                  <MagnifyingGlassIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                </button>
              </form>

              {/* Mobile Navigation */}
              {!isAuthenticated ? (
                <div className="space-y-2 sm:space-y-3">
                  <Link
                    to="/login"
                    className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-center text-gray-700 font-semibold border border-gray-200 rounded-xl sm:rounded-2xl hover:bg-gray-50 transition-colors"
                    onClick={closeMenus}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-center bg-gradient-to-r from-dealshark-blue to-blue-600 text-white rounded-xl sm:rounded-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                    onClick={closeMenus}
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* User Info */}
                  <div className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 bg-gray-50 rounded-xl sm:rounded-2xl">


                    {user?.profile_picture || user?.business_profile?.business_logo_url ? (
                      <img src={user?.user_type === "business" ? user?.business_profile?.business_logo_url : user?.profile_picture} alt="Profile" 
                      className="w-9 h-9 sm:w-10 sm:h-10 rounded-md sm:rounded-xl flex-shrink-0 object-contain shadow-md" />
                    ) : (
                      <div className="min-w-8 w-8 h-8 sm:min-w-10 sm:w-10 sm:h-10 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold text-xs sm:text-sm">
                          {getUserInitials()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-sm sm:text-base text-gray-900 truncate">{getUserDisplayName()}</p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors"
                      onClick={closeMenus}
                    >
                      <UserCircleIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span>My Profile</span>
                    </Link>

                    {user?.user_type === 'business' && (
                      <>
                        <Link
                          to="/create-deal"
                          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors"
                          onClick={closeMenus}
                        >
                          <PlusIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span>Create Deal</span>
                        </Link>
                        <Link
                          to="/business/deals"
                          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors"
                          onClick={closeMenus}
                        >
                          <ChartBarIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span>My Business Deals</span>
                        </Link>
                        <Link
                          to="/my-subscribers"
                          className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors"
                          onClick={closeMenus}
                        >
                          <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                          <span>My Subscribers</span>
                        </Link>
                      </>
                    )}

                    {user?.user_type !== 'business' && (
                      <Link
                        to="/my-subscriptions"
                        className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors"
                        onClick={closeMenus}
                      >
                        <UsersIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                        <span>My Subscriptions</span>
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors w-full text-left"
                    >
                      <XMarkIcon className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Backdrop for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={closeMenus}
        />
      )}
    </>
  );
};

export default Header;