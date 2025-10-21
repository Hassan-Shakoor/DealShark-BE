import { Link } from 'react-router-dom';
import {
  HeartIcon,
  GlobeAltIcon,
  ArrowUpIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  LifebuoyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Import mascot image
import dealSharkLogo from "../../assets/images/deal-shark-logo.webp"
import dealsharkDotNet from "../../assets/images/dealshark-dot-net.webp"

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Deals', href: '/deals' },
    ],
    support: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Help Center', href: '/help' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
    ],
    resources: [
      { name: 'For Businesses', href: '/business' },
      { name: 'For Customers', href: '/customers' },
      { name: 'API Documentation', href: '/api-docs' },
      { name: 'Partner Program', href: '/partners' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', href: '#', icon: '📘', color: 'hover:text-blue-400' },
    { name: 'Twitter', href: '#', icon: '🐦', color: 'hover:text-blue-300' },
    { name: 'Instagram', href: '#', icon: '📷', color: 'hover:text-pink-400' },
    { name: 'LinkedIn', href: '#', icon: '💼', color: 'hover:text-blue-500' },
  ];

  const contactInfo = [
    { icon: EnvelopeIcon, text: 'hello@dealshark.com', href: 'mailto:hello@dealshark.com' },
    { icon: PhoneIcon, text: '+1 (555) 123-4567', href: 'tel:+15551234567' },
    { icon: MapPinIcon, text: '123 Deal Street, Business City', href: '#' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 text-white overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-dealshark-yellow rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 bg-blue-400 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-dealshark-yellow rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 right-1/3 w-16 h-16 bg-purple-400 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      {/* Top Wave Decoration */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-dealshark-yellow via-blue-400 to-purple-400"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          {/* Company Info - Enhanced */}
          <div className="lg:col-span-5 md:col-span-2">
            {/* Logo Section */}
            <div className="mb-6 flex items-center gap-4">
              {/* Mascot Image */}
              <div className="block">
                <img
                  src={dealsharkDotNet}
                  alt="DealShark Dot Net"
                  className="w-18 h-auto opacity-80 hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              <Link to="/" className="inline-block group">
                <img src={dealSharkLogo} alt="DealShark Logo" className="h-10 transition-transform duration-300 group-hover:scale-105" />
              </Link>
            </div>

            {/* Brand Description */}
            <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-md">
              Connect customers and businesses through our innovative referral platform.
              Earn commissions, track deals, and grow together with our community.
            </p>


            {/* Contact Information - Card Style */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <h4 className="text-dealshark-yellow font-semibold text-sm mb-3 flex items-center">
                <SparklesIcon className="h-4 w-4 mr-2" />
                Get in Touch
              </h4>
              <div className="space-y-2.5">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className="flex items-center space-x-2.5 text-gray-300 hover:text-dealshark-yellow transition-all duration-300 group text-sm"
                  >
                    <div className="w-8 h-8 bg-dealshark-yellow/10 rounded-lg flex items-center justify-center group-hover:bg-dealshark-yellow/20 transition-colors">
                      <contact.icon className="h-4 w-4 text-dealshark-yellow" />
                    </div>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{contact.text}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="lg:col-span-7 md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {/* Company Links */}
              <div>
                <div className="flex items-center mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-dealshark-yellow to-yellow-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <BuildingOfficeIcon className="h-5 w-5 text-gray-900" />
                  </div>
                  <h3 className="text-white font-bold text-base">Company</h3>
                </div>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-all duration-300 text-sm flex items-center group relative"
                      >
                        <span className="absolute left-0 w-0 h-0.5 bg-dealshark-yellow group-hover:w-4 transition-all duration-300"></span>
                        <span className="group-hover:translate-x-5 transition-transform duration-300">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <div className="flex items-center mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <LifebuoyIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-white font-bold text-base">Support</h3>
                </div>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-400 hover:text-white transition-all duration-300 text-sm flex items-center group relative"
                      >
                        <span className="absolute left-0 w-0 h-0.5 bg-dealshark-yellow group-hover:w-4 transition-all duration-300"></span>
                        <span className="group-hover:translate-x-5 transition-transform duration-300">{link.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Newsletter / CTA Section */}
              <div className="col-span-2 md:col-span-1">
                <div className="bg-gradient-to-br from-dealshark-yellow to-yellow-500 rounded-2xl p-5 shadow-xl">
                  <h3 className="text-gray-900 font-bold text-base mb-2">Stay Updated</h3>
                  <p className="text-gray-800 text-xs mb-4">Get the latest deals and updates!</p>
                  <Link
                    to="/deals"
                    className="inline-block bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-md w-full text-center"
                  >
                    Browse Deals
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8"></div>

        {/* Bottom Section - Enhanced */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Left Side - Copyright & Love */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {currentYear} <span className="text-white font-semibold">DealShark</span>. All rights reserved.
            </p>
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Made with</span>
              <HeartIcon className="h-4 w-4 text-red-500 animate-pulse" />
              <span className="text-gray-400">for deals</span>
            </div>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
              <GlobeAltIcon className="h-4 w-4 text-dealshark-yellow" />
              <span className="text-gray-300 text-sm">English</span>
            </div>

            {/* Back to Top Button - Enhanced */}
            <button
              onClick={scrollToTop}
              className="group flex items-center space-x-2 bg-gradient-to-r from-dealshark-yellow to-yellow-400 text-gray-900 px-5 py-2.5 rounded-xl text-sm font-bold hover:from-yellow-400 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
            >
              <ArrowUpIcon className="h-4 w-4 group-hover:-translate-y-1 transition-transform duration-300" />
              <span>Top</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
