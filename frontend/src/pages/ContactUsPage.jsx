import React, { useState } from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

// Import mascot images
import customerServiceMascot from '../assets/images/customer-service-maskot.webp';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    inquiry_type: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        inquiry_type: 'general'
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: EnvelopeIcon,
      title: 'Email Us',
      content: 'support@dealshark.com',
      subtext: 'We reply within 24 hours',
      color: 'from-blue-500 to-indigo-500',
      link: 'mailto:support@dealshark.com'
    },
    // {
    //   icon: PhoneIcon,
    //   title: 'Call Us',
    //   content: '+1 (555) 123-4567',
    //   subtext: 'Mon-Fri, 9AM - 6PM EST',
    //   color: 'from-green-500 to-emerald-500',
    //   link: 'tel:+15551234567'
    // },
    // {
    //   icon: MapPinIcon,
    //   title: 'Visit Us',
    //   content: '123 Business Street',
    //   subtext: 'New York, NY 10001',
    //   color: 'from-purple-500 to-pink-500'
    // },
    {
      icon: ClockIcon,
      title: 'Business Hours',
      content: 'Mon - Fri: 9AM - 6PM',
      subtext: 'Weekend: Closed',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const inquiryTypes = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'business', label: 'Business Partnership' },
    { value: 'support', label: 'Technical Support' },
    { value: 'feedback', label: 'Feedback' }
  ];

  const faqs = [
    {
      icon: QuestionMarkCircleIcon,
      question: 'How do I get started?',
      answer: 'Simply sign up for free and start exploring deals or list your business!',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: HeartIcon,
      question: 'Is DealShark free to use?',
      answer: 'Yes! Joining DealShark is completely free for both customers and businesses.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      question: 'How can I contact support?',
      answer: 'You can reach us via email, phone, or use the contact form on this page.',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dealshark-blue via-blue-700 to-indigo-800 py-16 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-dealshark-yellow rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Get in <span className="text-dealshark-yellow">Touch</span> With Us
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Have questions? We're here to help! Reach out to our friendly team 
                and we'll get back to you as soon as possible.
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-2 text-white">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg font-semibold">We typically respond within 2 hours</span>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={customerServiceMascot} 
                  alt="Customer Service" 
                  className="w-64 lg:w-80 h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div 
                key={index}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-14 h-14 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <info.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                {info.link ? (
                  <a 
                    href={info.link}
                    className="text-dealshark-blue font-semibold hover:underline block mb-1"
                  >
                    {info.content}
                  </a>
                ) : (
                  <p className="text-gray-900 font-semibold mb-1">{info.content}</p>
                )}
                <p className="text-sm text-gray-600">{info.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQs */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-gradient-to-br from-dealshark-blue to-blue-700 rounded-3xl p-8 lg:p-10 shadow-2xl">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-dealshark-yellow rounded-xl flex items-center justify-center mr-4">
                    <PaperAirplaneIcon className="h-6 w-6 text-gray-900" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-white">Send Us a Message</h2>
                    <p className="text-blue-100 text-sm">Fill out the form and we'll respond soon</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-white font-semibold mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:border-dealshark-yellow focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-white font-semibold mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:border-dealshark-yellow focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                      placeholder="john@example.com"
                    />
                  </div>

                  {/* Phone */}
                  {/* <div>
                    <label htmlFor="phone" className="block text-white font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:border-dealshark-yellow focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div> */}

                  {/* Inquiry Type */}
                  <div>
                    <label htmlFor="inquiry_type" className="block text-white font-semibold mb-2">
                      Inquiry Type
                    </label>
                    <select
                      id="inquiry_type"
                      name="inquiry_type"
                      value={formData.inquiry_type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white focus:outline-none focus:border-dealshark-yellow focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                    >
                      {inquiryTypes.map(type => (
                        <option key={type.value} value={type.value} className="bg-dealshark-blue text-white">
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label htmlFor="subject" className="block text-white font-semibold mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:border-dealshark-yellow focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300"
                      placeholder="How can we help?"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-white font-semibold mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-3 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-blue-200 focus:outline-none focus:border-dealshark-yellow focus:ring-4 focus:ring-yellow-400/20 transition-all duration-300 resize-none"
                      placeholder="Tell us more about your inquiry..."
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-dealshark-yellow hover:bg-yellow-400 text-gray-900 font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* FAQs & Additional Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Frequently Asked <span className="text-dealshark-blue">Questions</span>
                </h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-10 h-10 bg-gradient-to-r ${faq.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <faq.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gradient-to-br from-dealshark-yellow via-yellow-300 to-dealshark-yellow rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Need Immediate Help?</h3>
                <p className="text-gray-700 mb-6">
                  Check out our help center for instant answers to common questions.
                </p>
                <div className="space-y-3">
                  <a 
                    href="/deals"
                    className="block bg-white hover:bg-gray-50 text-dealshark-blue font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md text-center"
                  >
                    Browse Deals
                  </a>
                  <a 
                    href="/about"
                    className="block bg-white hover:bg-gray-50 text-dealshark-blue font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md text-center"
                  >
                    Learn More About Us
                  </a>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-dealshark-blue rounded-full border-2 border-white"></div>
                    <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white"></div>
                    <div className="w-10 h-10 bg-green-400 rounded-full border-2 border-white"></div>
                    <div className="w-10 h-10 bg-purple-400 rounded-full border-2 border-white"></div>
                  </div>
                </div>
                <p className="text-center text-gray-700 font-medium">
                  Join <span className="text-dealshark-blue font-bold">10,000+</span> happy users
                </p>
                <p className="text-center text-sm text-gray-600 mt-1">
                  Average response time: <span className="font-semibold">2 hours</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      {/* <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Visit Our <span className="text-dealshark-blue">Location</span>
            </h2>
            <p className="text-gray-600">Find us on the map</p>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158858.182370726!2d-0.10159865000000001!3d51.52864165!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2s!4v1760868178883!5m2!1sen!2s" 
              width="100%" 
              height="450" 
              style={{border: 0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="DealShark Location Map"
            ></iframe>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default ContactUsPage;

