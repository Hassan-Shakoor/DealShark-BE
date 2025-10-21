import { Link } from 'react-router-dom';
import {
  QuestionMarkCircleIcon,
  UserCircleIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  ShieldCheckIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const HelpCenterPage = () => {
  const helpCategories = [
    {
      icon: QuestionMarkCircleIcon,
      title: "Getting Started",
      description: "Learn the basics of using DealShark",
      color: "from-blue-500 to-blue-600",
      topics: [
        { title: "How to create an account", link: "#create-account" },
        { title: "Setting up your profile", link: "#setup-profile" },
        { title: "Understanding deals and commissions", link: "#understand-deals" },
        { title: "First steps for customers", link: "#customer-steps" },
        { title: "First steps for businesses", link: "#business-steps" }
      ]
    },
    {
      icon: UserCircleIcon,
      title: "For Customers",
      description: "Everything customers need to know",
      color: "from-green-500 to-green-600",
      topics: [
        { title: "How to find and subscribe to deals", link: "#subscribe-deals" },
        { title: "Sharing your referral links", link: "#share-links" },
        { title: "Tracking your commissions", link: "#track-commissions" },
        { title: "Receiving payments", link: "#receive-payments" },
        { title: "Managing your subscriptions", link: "#manage-subscriptions" }
      ]
    },
    {
      icon: BuildingStorefrontIcon,
      title: "For Businesses",
      description: "Resources for business users",
      color: "from-purple-500 to-purple-600",
      topics: [
        { title: "Creating your first deal", link: "#create-deal" },
        { title: "Managing subscribers", link: "#manage-subscribers" },
        { title: "Setting commission rates", link: "#commission-rates" },
        { title: "Analyzing performance", link: "#analyze-performance" },
        { title: "Updating deals", link: "#update-deals" }
      ]
    },
    {
      icon: CreditCardIcon,
      title: "Payments & Billing",
      description: "Payment processing and financial questions",
      color: "from-yellow-500 to-yellow-600",
      topics: [
        { title: "Connecting your Stripe account", link: "#connect-stripe" },
        { title: "Understanding payment schedules", link: "#payment-schedule" },
        { title: "Payment disputes and issues", link: "#payment-disputes" },
        { title: "Tax information", link: "#tax-info" },
        { title: "Refund policies", link: "#refunds" }
      ]
    },
    {
      icon: ShieldCheckIcon,
      title: "Security & Privacy",
      description: "Keeping your account safe",
      color: "from-red-500 to-red-600",
      topics: [
        { title: "Account security best practices", link: "#security-practices" },
        { title: "Two-factor authentication", link: "#two-factor" },
        { title: "Data privacy and protection", link: "#data-privacy" },
        { title: "Reporting suspicious activity", link: "#report-activity" },
        { title: "GDPR and compliance", link: "#gdpr" }
      ]
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Troubleshooting",
      description: "Solutions to common problems",
      color: "from-orange-500 to-orange-600",
      topics: [
        { title: "Login issues", link: "#login-issues" },
        { title: "Payment not received", link: "#payment-issues" },
        { title: "Referral link not working", link: "#link-issues" },
        { title: "Account verification problems", link: "#verification" },
        { title: "Technical errors", link: "#technical-errors" }
      ]
    }
  ];

  const quickLinks = [
    {
      icon: DocumentTextIcon,
      title: "FAQ",
      description: "Frequently asked questions",
      link: "/faq",
      color: "text-blue-600 bg-blue-50"
    },
    {
      icon: ShieldCheckIcon,
      title: "Privacy Policy",
      description: "How we protect your data",
      link: "/privacy",
      color: "text-purple-600 bg-purple-50"
    },
    {
      icon: DocumentTextIcon,
      title: "Terms of Service",
      description: "Our terms and conditions",
      link: "/terms",
      color: "text-green-600 bg-green-50"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dealshark-blue via-blue-700 to-dealshark-blue py-12 sm:py-16 md:py-20 px-3 sm:px-4 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 sm:w-24 sm:h-24 bg-dealshark-yellow rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 sm:w-16 sm:h-16 bg-dealshark-yellow rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            How Can We <span className="text-dealshark-yellow">Help You?</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto px-4 mb-8 sm:mb-10">
            Find answers, learn how to use DealShark, and get the support you need.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pr-12 sm:pr-14 text-sm sm:text-base rounded-lg sm:rounded-xl bg-white border-2 border-transparent focus:outline-none focus:border-dealshark-yellow focus:ring-1 focus:ring-yellow-400 transition-all duration-300 shadow-lg"
              />
              <button className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 bg-dealshark-yellow text-gray-900 p-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto">
          {/* Help Categories */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
              Browse by <span className="text-dealshark-blue">Category</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {helpCategories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Category Header */}
                  <div className={`bg-gradient-to-r ${category.color} p-6 sm:p-8`}>
                    <category.icon className="h-10 w-10 sm:h-12 sm:w-12 text-white mb-3 sm:mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/90">
                      {category.description}
                    </p>
                  </div>

                  {/* Topics List */}
                  <div className="p-6 sm:p-8">
                    <ul className="space-y-3">
                      {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex}>
                          <a
                            href={topic.link}
                            className="flex items-center text-gray-700 hover:text-dealshark-blue transition-colors duration-200 group"
                          >
                            <span className="w-1.5 h-1.5 bg-dealshark-blue rounded-full mr-3 group-hover:scale-150 transition-transform duration-200"></span>
                            <span className="text-sm sm:text-base">{topic.title}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8 sm:mb-12 text-center">
              Quick <span className="text-dealshark-blue">Links</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.link}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 p-6 sm:p-8 border border-gray-100"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${link.color} mb-4`}>
                    <link.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    {link.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {link.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Support Section */}
          <div className="bg-gradient-to-br from-dealshark-blue to-blue-700 rounded-xl sm:rounded-2xl p-8 sm:p-10 md:p-12 text-center shadow-xl">
            <EnvelopeIcon className="h-16 w-16 sm:h-20 sm:w-20 text-dealshark-yellow mx-auto mb-6" />
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Still Need Help?
            </h2>
            <p className="text-base sm:text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@dealshark.com"
                className="inline-block bg-dealshark-yellow text-gray-900 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Email Support
              </a>
              <Link
                to="/contact"
                className="inline-block border-2 border-white text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-white hover:text-dealshark-blue transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Contact Form
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenterPage;

