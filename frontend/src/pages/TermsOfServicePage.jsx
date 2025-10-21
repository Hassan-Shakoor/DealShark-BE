const TermsOfServicePage = () => {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        {
          text: "By accessing or using DealShark, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. These terms apply to all users, including customers and businesses."
        }
      ]
    },
    {
      title: "2. User Accounts",
      subsections: [
        {
          subtitle: "Account Creation",
          text: "To use certain features of DealShark, you must create an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete."
        },
        {
          subtitle: "Account Security",
          text: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account."
        },
        {
          subtitle: "Age Requirement",
          text: "You must be at least 18 years old to use DealShark. By creating an account, you represent and warrant that you meet this age requirement."
        },
        {
          subtitle: "Account Termination",
          text: "We reserve the right to suspend or terminate your account at any time for violations of these terms, fraudulent activity, or any other reason we deem necessary to protect our platform and users."
        }
      ]
    },
    {
      title: "3. User Conduct and Responsibilities",
      subsections: [
        {
          subtitle: "Prohibited Activities",
          text: "You agree not to: (a) use the platform for any illegal purposes; (b) attempt to gain unauthorized access to any part of the platform; (c) transmit viruses, malware, or any harmful code; (d) harass, abuse, or harm other users; (e) engage in fraudulent referral activity; (f) scrape, data mine, or use automated tools to access the platform; (g) impersonate any person or entity."
        },
        {
          subtitle: "Content Standards",
          text: "All content you post on DealShark must be accurate, not misleading, and comply with all applicable laws. You may not post content that is defamatory, obscene, offensive, or infringes on intellectual property rights."
        },
        {
          subtitle: "Referral Integrity",
          text: "All referrals must be genuine. Self-referrals, fake accounts, fraudulent transactions, or any form of referral manipulation is strictly prohibited and may result in account termination and forfeiture of commissions."
        }
      ]
    },
    {
      title: "4. For Customers",
      subsections: [
        {
          subtitle: "Referral Links",
          text: "When you subscribe to a deal, you receive a unique referral link. You are responsible for how you share this link. Spam, unsolicited communications, or deceptive practices are prohibited."
        },
        {
          subtitle: "Commission Earnings",
          text: "Commission rates and payment terms are set by individual businesses. We facilitate payments but are not responsible for payment disputes between customers and businesses. Commissions are subject to the terms of each specific deal."
        },
        {
          subtitle: "Payment Processing",
          text: "To receive commission payments, you must connect a valid payment account (Stripe). You are responsible for any fees or taxes associated with your earnings."
        }
      ]
    },
    {
      title: "5. For Businesses",
      subsections: [
        {
          subtitle: "Business Verification",
          text: "You represent that you are authorized to bind the business entity you represent. You must provide accurate business information and maintain an active, legitimate business."
        },
        {
          subtitle: "Deal Creation",
          text: "You are solely responsible for the terms, legality, and fulfillment of your deals. You must honor all commitments made in your deal descriptions, including commission payments and special offers."
        },
        {
          subtitle: "Commission Payments",
          text: "You agree to pay referral commissions as specified in your deals. Payments must be made through the platform using your connected Stripe account. Failure to pay commissions may result in account suspension."
        },
        {
          subtitle: "Compliance",
          text: "Your deals must comply with all applicable laws, including consumer protection, advertising, and disclosure requirements. You are responsible for obtaining any necessary licenses or permits for your business."
        }
      ]
    },
    {
      title: "6. Payment Terms",
      subsections: [
        {
          subtitle: "Payment Processing",
          text: "All payments are processed through Stripe. By using DealShark, you agree to Stripe's terms of service. We do not store your payment information."
        },
        {
          subtitle: "Fees",
          text: "DealShark may charge platform fees or transaction fees. Any applicable fees will be clearly disclosed before you complete a transaction. Standard Stripe processing fees apply to all transactions."
        },
        {
          subtitle: "Refunds and Disputes",
          text: "Refund policies are set by individual businesses for their products or services. Commission disputes should be addressed through our support team. We reserve the right to withhold payments during investigations."
        }
      ]
    },
    {
      title: "7. Intellectual Property",
      subsections: [
        {
          subtitle: "Platform Content",
          text: "The DealShark platform, including its design, features, text, graphics, logos, and software, is owned by DealShark and protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works without our express written permission."
        },
        {
          subtitle: "User Content",
          text: "You retain ownership of content you post on DealShark. However, by posting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and display your content in connection with operating the platform."
        },
        {
          subtitle: "Trademarks",
          text: "DealShark, its logo, and other marks are trademarks of DealShark. You may not use our trademarks without prior written permission."
        }
      ]
    },
    {
      title: "8. Disclaimers and Limitations of Liability",
      subsections: [
        {
          subtitle: "Platform Availability",
          text: "DealShark is provided 'as is' and 'as available' without warranties of any kind. We do not guarantee that the platform will be uninterrupted, secure, or error-free."
        },
        {
          subtitle: "Third-Party Relationships",
          text: "DealShark facilitates connections between customers and businesses but is not a party to transactions between them. We are not responsible for the quality, safety, legality, or delivery of products or services offered through the platform."
        },
        {
          subtitle: "Limitation of Liability",
          text: "To the maximum extent permitted by law, DealShark shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption. Our total liability shall not exceed the amount you paid to DealShark in the past 12 months, or $100, whichever is greater."
        }
      ]
    },
    {
      title: "9. Indemnification",
      subsections: [
        {
          subtitle: "Your Responsibility",
          text: "You agree to indemnify, defend, and hold harmless DealShark, its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from: (a) your use of the platform; (b) your violation of these terms; (c) your violation of any rights of another party; (d) your content or deals posted on the platform."
        }
      ]
    },
    {
      title: "10. Modifications to Terms",
      subsections: [
        {
          subtitle: "Changes",
          text: "We reserve the right to modify these Terms of Service at any time. We will notify you of material changes via email or platform notification. Your continued use of DealShark after changes are posted constitutes acceptance of the modified terms."
        }
      ]
    },
    {
      title: "11. Termination",
      subsections: [
        {
          subtitle: "By You",
          text: "You may terminate your account at any time through your account settings. Upon termination, you will no longer have access to your account and data."
        },
        {
          subtitle: "By Us",
          text: "We may suspend or terminate your account immediately, without prior notice, for conduct that we believe violates these terms, is harmful to other users, or is harmful to our business interests."
        },
        {
          subtitle: "Effect of Termination",
          text: "Upon termination, your right to use the platform ceases immediately. Provisions of these terms that by their nature should survive termination will survive, including ownership provisions, warranty disclaimers, and limitations of liability."
        }
      ]
    },
    {
      title: "12. Governing Law and Dispute Resolution",
      subsections: [
        {
          subtitle: "Governing Law",
          text: "These terms are governed by and construed in accordance with the laws of the jurisdiction in which DealShark operates, without regard to conflict of law principles."
        },
        {
          subtitle: "Dispute Resolution",
          text: "Any disputes arising from these terms or your use of DealShark shall first be attempted to be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved through binding arbitration in accordance with applicable arbitration rules."
        }
      ]
    },
    {
      title: "13. General Provisions",
      subsections: [
        {
          subtitle: "Entire Agreement",
          text: "These terms constitute the entire agreement between you and DealShark regarding the use of the platform and supersede all prior agreements."
        },
        {
          subtitle: "Severability",
          text: "If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect."
        },
        {
          subtitle: "Waiver",
          text: "No waiver of any term shall be deemed a further or continuing waiver of such term or any other term."
        },
        {
          subtitle: "Assignment",
          text: "You may not assign or transfer these terms or your account without our prior written consent. We may assign or transfer these terms without restriction."
        }
      ]
    },
    {
      title: "14. Contact Information",
      subsections: [
        {
          subtitle: "Questions",
          text: "If you have any questions about these Terms of Service, please contact us at legal@dealshark.com or through our contact page."
        }
      ]
    }
  ];

  const lastUpdated = "January 1, 2024";

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
            Terms of <span className="text-dealshark-yellow">Service</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto px-4 mb-4">
            Please read these terms carefully before using DealShark. By using our platform, you agree to these terms.
          </p>
          <p className="text-sm sm:text-base text-blue-200 px-4">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 mb-8 sm:mb-10 border border-gray-100">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4">
              Welcome to DealShark. These Terms of Service ("Terms") govern your access to and use of the DealShark platform, services, and features. Please read them carefully.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              By accessing or using DealShark, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, please do not use our services.
            </p>
          </div>

          {/* Terms Sections */}
          <div className="space-y-6 sm:space-y-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-100"
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.content && section.content.map((item, itemIndex) => (
                    <p key={itemIndex} className="text-base text-gray-600 leading-relaxed">
                      {item.text}
                    </p>
                  ))}
                  {section.subsections && section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex}>
                      <h3 className="text-lg sm:text-xl font-semibold text-dealshark-blue mb-3">
                        {subsection.subtitle}
                      </h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        {subsection.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 sm:mt-16 bg-gradient-to-br from-dealshark-blue to-blue-700 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-xl">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
              Questions About These Terms?
            </h3>
            <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              If you have any questions or concerns about our Terms of Service, please contact our legal team.
            </p>
            <a
              href="mailto:legal@dealshark.com"
              className="inline-block bg-dealshark-yellow text-gray-900 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Legal Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsOfServicePage;

