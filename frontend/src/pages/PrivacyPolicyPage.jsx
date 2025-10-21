const PrivacyPolicyPage = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        {
          subtitle: "Personal Information",
          text: "When you create an account on DealShark, we collect personal information such as your name, email address, phone number, and profile picture. For businesses, we also collect business name, industry, and contact details."
        },
        {
          subtitle: "Payment Information",
          text: "Payment processing is handled securely through Stripe. We do not store your complete credit card information on our servers. Stripe maintains PCI-DSS compliance and handles all payment data securely."
        },
        {
          subtitle: "Usage Information",
          text: "We collect information about how you use our platform, including the deals you view, subscribe to, and share. This helps us improve our service and provide personalized recommendations."
        },
        {
          subtitle: "Device and Log Information",
          text: "We automatically collect information about your device, browser type, IP address, and access times when you use our platform."
        }
      ]
    },
    {
      title: "2. How We Use Your Information",
      content: [
        {
          subtitle: "Service Delivery",
          text: "We use your information to provide, maintain, and improve our referral platform, process transactions, and facilitate connections between customers and businesses."
        },
        {
          subtitle: "Communication",
          text: "We send you service-related emails, updates about deals you're subscribed to, commission notifications, and important platform announcements. You can opt out of promotional emails at any time."
        },
        {
          subtitle: "Analytics and Improvement",
          text: "We analyze usage patterns to improve our platform, develop new features, and enhance user experience. This data is aggregated and anonymized whenever possible."
        },
        {
          subtitle: "Security and Fraud Prevention",
          text: "We use your information to protect against unauthorized access, fraud, and other security threats to our platform and users."
        }
      ]
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: [
        {
          subtitle: "With Other Users",
          text: "When you subscribe to a deal, your name and referral activity may be visible to the business offering the deal. Businesses can see subscriber counts and referral performance."
        },
        {
          subtitle: "With Service Providers",
          text: "We share information with trusted service providers who help us operate our platform, including payment processors (Stripe), email services, and hosting providers. These providers are contractually obligated to protect your data."
        },
        {
          subtitle: "For Legal Reasons",
          text: "We may disclose your information if required by law, court order, or government request, or to protect the rights, property, or safety of DealShark, our users, or others."
        },
        {
          subtitle: "Business Transfers",
          text: "If DealShark is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change."
        }
      ]
    },
    {
      title: "4. Data Security",
      content: [
        {
          subtitle: "Security Measures",
          text: "We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information from unauthorized access, disclosure, or destruction."
        },
        {
          subtitle: "SSL Encryption",
          text: "All data transmitted between your browser and our servers is encrypted using SSL/TLS protocols to ensure secure communication."
        },
        {
          subtitle: "Limited Access",
          text: "Access to personal information is restricted to authorized personnel who need it to perform their job functions. All employees are bound by confidentiality agreements."
        }
      ]
    },
    {
      title: "5. Your Rights and Choices",
      content: [
        {
          subtitle: "Access and Correction",
          text: "You can access and update your personal information at any time through your account settings. If you need assistance, contact our support team."
        },
        {
          subtitle: "Data Deletion",
          text: "You have the right to request deletion of your account and personal data. Some information may be retained for legal or business purposes as required by law."
        },
        {
          subtitle: "Marketing Communications",
          text: "You can opt out of promotional emails by clicking the unsubscribe link in any marketing email or adjusting your notification preferences in your account settings."
        },
        {
          subtitle: "Cookie Management",
          text: "You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our platform."
        }
      ]
    },
    {
      title: "6. Cookies and Tracking Technologies",
      content: [
        {
          subtitle: "What We Use",
          text: "We use cookies and similar technologies to enhance your experience, remember your preferences, and analyze platform usage. This includes session cookies, persistent cookies, and analytics tools."
        },
        {
          subtitle: "Third-Party Cookies",
          text: "Some third-party services we use, such as analytics providers, may also place cookies on your device. We do not control these third-party cookies."
        }
      ]
    },
    {
      title: "7. Children's Privacy",
      content: [
        {
          subtitle: "Age Restriction",
          text: "DealShark is not intended for users under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly."
        }
      ]
    },
    {
      title: "8. International Data Transfers",
      content: [
        {
          subtitle: "Data Processing",
          text: "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy."
        }
      ]
    },
    {
      title: "9. Changes to This Privacy Policy",
      content: [
        {
          subtitle: "Updates",
          text: "We may update this privacy policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes via email or platform notification. Your continued use of DealShark after changes are posted constitutes acceptance of the updated policy."
        }
      ]
    },
    {
      title: "10. Contact Us",
      content: [
        {
          subtitle: "Questions and Concerns",
          text: "If you have questions about this privacy policy or how we handle your personal information, please contact us at privacy@dealshark.com or through our contact page. We will respond to your inquiry within 30 days."
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
            Privacy <span className="text-dealshark-yellow">Policy</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-2xl mx-auto px-4 mb-4">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
              Welcome to DealShark's Privacy Policy. This policy describes how DealShark ("we," "us," or "our") collects, uses, shares, and protects your personal information when you use our referral platform and services.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              By using DealShark, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.
            </p>
          </div>

          {/* Policy Sections */}
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
                  {section.content.map((item, itemIndex) => (
                    <div key={itemIndex}>
                      <h3 className="text-lg sm:text-xl font-semibold text-dealshark-blue mb-3">
                        {item.subtitle}
                      </h3>
                      <p className="text-base text-gray-600 leading-relaxed">
                        {item.text}
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
              Questions About Your Privacy?
            </h3>
            <p className="text-base sm:text-lg text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto">
              If you have any questions or concerns about our privacy practices, please don't hesitate to contact us.
            </p>
            <a
              href="mailto:privacy@dealshark.com"
              className="inline-block bg-dealshark-yellow text-gray-900 px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold text-base sm:text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Contact Privacy Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;

