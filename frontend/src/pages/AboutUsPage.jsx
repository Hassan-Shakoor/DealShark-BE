import React from 'react';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  UserGroupIcon,
  LightBulbIcon,
  HeartIcon,
  TrophyIcon,
  RocketLaunchIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

// Import mascot images
import businessMascot from '../assets/images/business-mascot.webp';
import carSharkMascot from '../assets/images/car-shark-mascot.webp';
import shoppingMascots from '../assets/images/shopping-mascots.webp';
import promotionalMascot from '../assets/images/promotional-mascot.webp';

const AboutUsPage = () => {
  const values = [
    {
      icon: HeartIcon,
      title: 'Customer First',
      description: 'We prioritize our customers and businesses, ensuring the best experience for everyone.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Trust & Security',
      description: 'Your data and transactions are protected with enterprise-grade security.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'We constantly innovate to bring you the best referral and deals platform.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Community',
      description: 'Building a strong community of businesses and customers who help each other grow.',
      color: 'from-blue-500 to-indigo-500'
    }
  ];

  const milestones = [
    { number: '10K+', label: 'Active Users', icon: UserGroupIcon },
    { number: '500+', label: 'Partner Businesses', icon: TrophyIcon },
    { number: '$50K+', label: 'Earnings Distributed', icon: CurrencyDollarIcon },
    { number: '95%', label: 'Satisfaction Rate', icon: HeartIcon }
  ];

  const team = [
    {
      name: 'Vision',
      role: 'Our Mission',
      description: 'To revolutionize how businesses and customers connect through seamless referral programs.',
      icon: RocketLaunchIcon,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Innovation',
      role: 'Our Approach',
      description: 'Leveraging cutting-edge technology to create win-win opportunities for everyone.',
      icon: SparklesIcon,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Growth',
      role: 'Our Goal',
      description: 'Empowering businesses to grow while helping customers save and earn rewards.',
      icon: TrophyIcon,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dealshark-blue via-blue-700 to-indigo-800 py-20 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-dealshark-yellow rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Left Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
                           
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Connecting <span className="text-dealshark-yellow">Businesses</span> & <span className="text-dealshark-yellow">Customers</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                DealShark is the ultimate platform that bridges the gap between businesses looking to grow 
                through referrals and customers seeking amazing deals and rewards.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/deals"
                  className="inline-flex items-center bg-dealshark-yellow text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Explore Deals
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-dealshark-blue transition-all duration-300"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={carSharkMascot} 
                  alt="DealShark Mascot" 
                  className="w-80 lg:w-96 h-auto drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-dealshark-blue">Story</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-dealshark-blue to-dealshark-yellow mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Founded with a vision to transform the referral industry, DealShark empowers businesses 
              to reach new customers while rewarding those who spread the word.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={businessMascot} 
                  alt="Business Growth" 
                  className="w-full h-auto"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-dealshark-yellow rounded-full opacity-50 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-dealshark-blue rounded-full opacity-30 blur-xl"></div>
            </div>

            {/* Content */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-dealshark-blue to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <RocketLaunchIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Beginning</h3>
                    <p className="text-gray-600">
                      Started as a solution to connect local businesses with customers, DealShark has 
                      grown into a comprehensive referral platform trusted by thousands.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <TrophyIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Today</h3>
                    <p className="text-gray-600">
                      We're proud to serve hundreds of businesses and thousands of customers, 
                      facilitating meaningful connections and rewarding relationships every day.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">The Future</h3>
                    <p className="text-gray-600">
                      We're constantly innovating to bring new features, expand our reach, and create 
                      even more value for our community of businesses and customers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-dealshark-blue">Core Values</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-dealshark-blue to-dealshark-yellow mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape the way we serve our community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-dealshark-yellow via-yellow-300 to-dealshark-yellow relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-gray-900 rounded-full"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative transform hover:scale-105 transition-transform duration-500">
                <img 
                  src={promotionalMascot} 
                  alt="Mission" 
                  className="w-72 lg:w-96 h-auto drop-shadow-2xl"
                />
              </div>
            </div>

            {/* Content */}
            <div className="lg:w-1/2">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Our Mission & Vision
              </h2>
              <div className="space-y-6">
                {team.map((item, index) => (
                  <div 
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{item.role}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-dealshark-blue to-blue-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-blue-100">
              See how we're making a difference in the referral industry
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center transform hover:scale-105 transition-all duration-300 border border-white/20"
              >
                <div className="w-16 h-16 bg-dealshark-yellow rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <milestone.icon className="h-8 w-8 text-gray-900" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {milestone.number}
                </div>
                <div className="text-blue-100 font-semibold">{milestone.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative inline-block mb-8">
            <img 
              src={shoppingMascots} 
              alt="Join Us" 
              className="w-64 h-auto mx-auto"
            />
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Ready to Join the <span className="text-dealshark-blue">DealShark</span> Family?
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Whether you're a business looking to grow or a customer seeking great deals, 
            we've got you covered!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center bg-gradient-to-r from-dealshark-blue to-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl"
            >
              Get Started Free
              <ArrowRightIcon className="h-6 w-6 ml-2" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center border-2 border-dealshark-blue text-dealshark-blue px-10 py-5 rounded-xl font-bold text-xl hover:bg-dealshark-blue hover:text-white transition-all duration-300 shadow-lg"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUsPage;

