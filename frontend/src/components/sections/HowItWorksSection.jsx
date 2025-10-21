import React from 'react';
import HowItWorksHeader from './HowItWorksHeader';
import HowItWorksCardsContainer from './HowItWorksCardsContainer';

const HowItWorksSection = () => {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-blue-50 relative">
      <div className="mx-auto">
        {/* Section Header */}
        <HowItWorksHeader />

        {/* How it works Cards */}
        <HowItWorksCardsContainer />
      </div>
    </section>
  );
};

export default HowItWorksSection;
