import React from 'react';

const HowItWorksCard = ({ 
  title, 
  description, 
  mascotSrc, 
  mascotAlt, 
  gradientFrom = 'from-blue-600', 
  gradientTo = 'to-blue-700' 
}) => {
  return (
    <div className={`group relative bg-gradient-to-b ${gradientFrom} ${gradientTo} rounded-xl sm:rounded-2xl md:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-300 transform border border-white/20 overflow-hidden`}>
      <div className="flex min-h-[180px] sm:min-h-[220px] md:min-h-[250px] h-full w-3/4">
        {/* Left Side - Text Content */}
        <div className="pr-2 sm:pr-4 md:pr-6">
          {/* Title */}
          <h3 className="text-[22px] sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4 uppercase tracking-[-1px] break-words sm:whitespace-nowrap">
            {title}
          </h3>
          
          {/* Description */}
          <p className="text-white text-xs sm:text-sm md:text-base leading-snug sm:leading-normal font-stretch-extra-condensed whitespace-normal">
            {description}
          </p>
        </div>
        
        {/* Right Side - Mascot */}
        <div className="flex-shrink-0 flex items-end absolute -right-2 sm:-right-3 -bottom-1 sm:-bottom-2 pointer-events-none">
          <div className="transform transition-transform duration-300 group-hover:scale-105 sm:group-hover:scale-110 origin-bottom-right">
            <img
              src={mascotSrc}
              alt={mascotAlt}
              className="w-40 lg:w-48 xl:w-56 h-auto"
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksCard;
