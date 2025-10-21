import React from 'react';

const HowItWorksHeader = ({ title = "HOW IT WORKS?" }) => {
  return (
    <div className="max-w-7xl mx-auto text-left mb-4 sm:mb-6 md:mb-8 pl-4 sm:px-0">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 md:mb-6 uppercase tracking-tight">
        {title}
      </h2>
    </div>
  );
};

export default HowItWorksHeader;
