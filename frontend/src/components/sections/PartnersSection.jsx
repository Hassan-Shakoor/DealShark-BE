import React from 'react';

const PartnersSection = () => {
  const partnersData = [
    {
      id: 1,
      name: "UltraTune",
      logo: "UltraTune",
      bgColor: "bg-white",
      textColor: "text-black",
      borderColor: "border-gray-200"
    },
    {
      id: 2,
      name: "Elite Supplements",
      logo: "ELITE SUPPLEMENTS",
      bgColor: "bg-gradient-to-r from-purple-600 to-purple-700",
      textColor: "text-white",
      borderColor: "border-purple-300"
    },
    {
      id: 3,
      name: "The Wheel Shop",
      logo: "THE WHEEL SHOP",
      bgColor: "bg-gradient-to-r from-yellow-300 to-yellow-400",
      textColor: "text-black",
      borderColor: "border-yellow-200"
    },
    {
      id: 4,
      name: "AdventurEV",
      logo: "AdventurEV",
      bgColor: "bg-white",
      textColor: "text-orange-600",
      borderColor: "border-gray-200"
    },
    {
      id: 5,
      name: "Nautek Marine",
      logo: "NAUTEK MARINE",
      bgColor: "bg-gradient-to-r from-blue-800 to-blue-900",
      textColor: "text-white",
      borderColor: "border-blue-300"
    },
    {
      id: 6,
      name: "Classical Elegance",
      logo: "Classical Elegance",
      bgColor: "bg-gradient-to-r from-gray-100 to-white",
      textColor: "text-black",
      borderColor: "border-gray-200"
    },
    {
      id: 7,
      name: "Haus of Autocare",
      logo: "HAUS OF AUTOCARE",
      bgColor: "bg-gradient-to-r from-teal-600 to-teal-700",
      textColor: "text-white",
      borderColor: "border-teal-300"
    },
    {
      id: 8,
      name: "Interior Secrets",
      logo: "INTERIOR SECRETS",
      bgColor: "bg-gradient-to-r from-gray-700 to-gray-800",
      textColor: "text-white",
      borderColor: "border-gray-400"
    },
    {
      id: 9,
      name: "Flip Side",
      logo: "FLIP SIDE",
      bgColor: "bg-gradient-to-r from-yellow-400 to-yellow-500",
      textColor: "text-black",
      borderColor: "border-yellow-300"
    },
    {
      id: 10,
      name: "UltraTune",
      logo: "UltraTune",
      bgColor: "bg-white",
      textColor: "text-black",
      borderColor: "border-gray-200"
    },
    {
      id: 11,
      name: "Elite Supplements",
      logo: "ELITE SUPPLEMENTS",
      bgColor: "bg-gradient-to-r from-purple-600 to-purple-700",
      textColor: "text-white",
      borderColor: "border-purple-300"
    },
    {
      id: 12,
      name: "The Wheel Shop",
      logo: "THE WHEEL SHOP",
      bgColor: "bg-gradient-to-r from-yellow-300 to-yellow-400",
      textColor: "text-black",
      borderColor: "border-yellow-200"
    },
    {
      id: 13,
      name: "AdventurEV",
      logo: "AdventurEV",
      bgColor: "bg-white",
      textColor: "text-orange-600",
      borderColor: "border-gray-200"
    },
    {
      id: 14,
      name: "Nautek Marine",
      logo: "NAUTEK MARINE",
      bgColor: "bg-gradient-to-r from-blue-800 to-blue-900",
      textColor: "text-white",
      borderColor: "border-blue-300"
    },
    {
      id: 15,
      name: "Classical Elegance",
      logo: "Classical Elegance",
      bgColor: "bg-gradient-to-r from-gray-100 to-white",
      textColor: "text-black",
      borderColor: "border-gray-200"
    },
    {
      id: 16,
      name: "Haus of Autocare",
      logo: "HAUS OF AUTOCARE",
      bgColor: "bg-gradient-to-r from-teal-600 to-teal-700",
      textColor: "text-white",
      borderColor: "border-teal-300"
    },
    {
      id: 17,
      name: "Interior Secrets",
      logo: "INTERIOR SECRETS",
      bgColor: "bg-gradient-to-r from-gray-700 to-gray-800",
      textColor: "text-white",
      borderColor: "border-gray-400"
    },
    {
      id: 18,
      name: "Flip Side",
      logo: "FLIP SIDE",
      bgColor: "bg-gradient-to-r from-yellow-400 to-yellow-500",
      textColor: "text-black",
      borderColor: "border-yellow-300"
    }
  ];

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 bg-blue-50 relative overflow-hidden">
      <div className="mx-auto">
        {/* Section Header */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12 pl-4 sm:px-0">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 md:mb-6 uppercase tracking-tight text-left">
            OUR PARTNERS & DISCOUNTS
          </h2>
        </div>

        {/* Partners Logos Container */}
        <div className="relative">
          {/* Top Row - Moving Right to Left */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-right">
              {/* Double logos for perfect infinite loop - animation moves by 50% */}
              {[...partnersData, ...partnersData].map((partner, index) => (
                <div
                  key={`top-${partner.id}-${index}`}
                  className={`flex-shrink-0 w-32 h-24 sm:w-40 sm:h-28 md:w-48 md:h-32 lg:w-56 lg:h-36 xl:w-64 xl:h-40 ${partner.bgColor} ${partner.borderColor} flex items-center justify-center shadow-sm sm:shadow-md hover:shadow-lg transition-shadow duration-300`}
                >
                  <span className={`text-[10px] sm:text-xs md:text-sm font-bold text-center px-1 sm:px-2 ${partner.textColor} leading-tight`}>
                    {partner.logo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Row - Moving Left to Right */}
          <div className="overflow-hidden">
            <div className="flex animate-scroll-left">
              {/* Double logos for perfect infinite loop - animation moves by 50% */}
              {[...partnersData, ...partnersData].map((partner, index) => (
                <div
                  key={`bottom-${partner.id}-${index}`}
                  className={`flex-shrink-0 w-32 h-24 sm:w-40 sm:h-28 md:w-48 md:h-32 lg:w-56 lg:h-36 xl:w-64 xl:h-40 ${partner.bgColor} ${partner.borderColor} flex items-center justify-center shadow-sm sm:shadow-md hover:shadow-lg transition-shadow duration-300`}
                >
                  <span className={`text-[10px] sm:text-xs md:text-sm font-bold text-center px-1 sm:px-2 md:px-3 ${partner.textColor} leading-tight`}>
                    {partner.logo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
