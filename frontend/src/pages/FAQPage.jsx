import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is DealShark?",
          answer: "DealShark is a revolutionary referral platform that connects customers with businesses through exclusive deals and commissions. Users can discover amazing discounts while earning commissions by referring others to businesses they love."
        },
        {
          question: "How does DealShark work?",
          answer: "Businesses create deals and offer commissions or special incentives. Customers subscribe to deals they're interested in, share their unique referral links, and earn rewards when others use their links. It's a win-win for everyone!"
        },
        {
          question: "Is DealShark free to use?",
          answer: "Yes! DealShark is completely free for customers to join and use. You can browse deals, subscribe to offers, and start earning commissions without any upfront costs."
        },
        {
          question: "How do I get started?",
          answer: "Simply sign up for a free account, browse available deals, subscribe to the ones you like, and start sharing your referral links with friends and family. It's that easy!"
        }
      ]
    },
    {
      category: "For Customers",
      questions: [
        {
          question: "How do I earn commissions?",
          answer: "After subscribing to a deal, you'll receive a unique referral link. Share this link with your network through social media, email, or messaging. When someone makes a purchase using your link, you earn a commission based on the business's offer."
        },
        {
          question: "How do I receive my earnings?",
          answer: "You can connect your Stripe account in your profile settings. Once connected, your earnings will be automatically transferred to your account based on the business's payout schedule."
        },
        {
          question: "Can I subscribe to multiple deals?",
          answer: "Absolutely! You can subscribe to as many deals as you like. The more deals you subscribe to and share, the more opportunities you have to earn commissions."
        },
        {
          question: "How do I track my referrals?",
          answer: "Your dashboard provides detailed analytics showing your active subscriptions, total referrals, earnings, and performance metrics. You can monitor everything in real-time."
        },
        {
          question: "What's the difference between commission and special offer deals?",
          answer: "Commission deals pay you a percentage of each sale made through your referral link. Special offer deals provide unique discounts or incentives to people who use your referral link, which can make them more attractive to share."
        }
      ]
    },
    {
      category: "For Businesses",
      questions: [
        {
          question: "How can my business join DealShark?",
          answer: "Click on 'List Your Business' and complete the onboarding process. You'll need to provide your business information, connect your Stripe account, and create your first deal. Our team reviews applications to ensure quality."
        },
        {
          question: "What types of deals can I create?",
          answer: "You can create commission-based deals where you pay referrers a percentage of sales, or special offer deals where you provide exclusive discounts or incentives. Choose what works best for your business model."
        },
        {
          question: "How much does it cost?",
          answer: "DealShark operates on a performance-based model. You only pay commissions when sales are made through referrals, or when you honor special offers. There are no upfront fees or monthly subscriptions for basic features."
        },
        {
          question: "How do I pay referrers?",
          answer: "Connect your Stripe account during onboarding. When referrals result in sales, DealShark facilitates the commission payments automatically through Stripe. You maintain full control over your payout schedule and terms."
        },
        {
          question: "Can I edit or pause my deals?",
          answer: "Yes! You have full control over your deals. You can edit details, pause deals temporarily, or end them at any time through your business dashboard."
        },
        {
          question: "How do I track my subscribers and referrals?",
          answer: "Your business dashboard provides comprehensive analytics including subscriber counts, referral conversions, sales generated, and ROI metrics. You can track performance in real-time."
        }
      ]
    },
    {
      category: "Payments & Security",
      questions: [
        {
          question: "Is my payment information secure?",
          answer: "Yes! We use Stripe, a leading payment processor trusted by millions of businesses worldwide. All payment information is encrypted and securely stored. DealShark never stores your credit card details."
        },
        {
          question: "When will I receive my commission payments?",
          answer: "Commission payments are processed according to each business's payout schedule. Most businesses process payments weekly or monthly. Check the deal details for specific payout information."
        },
        {
          question: "What if there's a dispute?",
          answer: "If you have any issues with payments or referrals, contact our support team at support@dealshark.com. We'll work with both parties to resolve disputes fairly and quickly."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees! Customers use DealShark completely free. Businesses only pay the commission percentages they set for successful referrals. Standard Stripe processing fees apply to all transactions."
        }
      ]
    },
    {
      category: "Account & Support",
      questions: [
        {
          question: "How do I update my account information?",
          answer: "Go to your Profile page where you can update your personal information, change your password, and manage your payment settings. All changes are saved automatically."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account at any time from your profile settings. Please note that this action is permanent and will remove all your data, including referral history and pending earnings."
        },
        {
          question: "How do I contact support?",
          answer: "You can reach our support team via email at support@dealshark.com or through the contact form on our website. We typically respond within 24 hours during business days."
        },
        {
          question: "Do you have a mobile app?",
          answer: "Our website is fully responsive and works great on mobile devices. A dedicated mobile app is in development and will be available soon for both iOS and Android."
        },
        {
          question: "How can I report a problem or bug?",
          answer: "If you encounter any issues, please email support@dealshark.com with a detailed description of the problem, including screenshots if possible. We appreciate your feedback and work quickly to resolve issues."
        }
      ]
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

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
            Frequently Asked <span className="text-dealshark-yellow">Questions</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto px-4">
            Find answers to common questions about DealShark, how it works, and how you can make the most of our platform.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-10 sm:mb-12 md:mb-16">
              {/* Category Header */}
              <div className="mb-6 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {category.category}
                </h2>
                <div className="w-16 sm:w-20 h-1 bg-gradient-to-r from-dealshark-blue to-blue-600 rounded-full"></div>
              </div>

              {/* Questions */}
              <div className="space-y-3 sm:space-y-4">
                {category.questions.map((faq, faqIndex) => {
                  const globalIndex = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <div
                      key={faqIndex}
                      className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                    >
                      {/* Question Button */}
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="text-base sm:text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </span>
                        <div className="flex-shrink-0">
                          {isOpen ? (
                            <ChevronUpIcon className="h-5 w-5 sm:h-6 sm:w-6 text-dealshark-blue" />
                          ) : (
                            <ChevronDownIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Answer */}
                      <div
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? 'max-h-96' : 'max-h-0'
                        }`}
                      >
                        <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-0">
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Still Have Questions Section */}
          <div className="mt-12 sm:mt-16 md:mt-20 bg-gradient-to-br from-dealshark-blue to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Still Have Questions?
            </h3>
            <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here to help you.
            </p>
            <a
              href="mailto:support@dealshark.com"
              className="inline-block bg-dealshark-yellow text-gray-900 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Support
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;

