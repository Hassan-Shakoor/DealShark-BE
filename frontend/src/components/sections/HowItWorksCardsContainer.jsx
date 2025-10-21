import React, { useRef, useState, useEffect } from 'react';
import HowItWorksCard from './HowItWorksCard';
// Import mascot images
import launchYourDealMascot from '../../assets/images/shark-with-rocket-mascot.webp';
import customerServiceMascot from '../../assets/images/customer-service-maskot.webp';
import promotionalMascot from '../../assets/images/promotional-mascot.webp';
import getReferralsMascot from '../../assets/images/get-referrals-mascot.webp';
import subscribeEarnMascot from '../../assets/images/subscribe-earn-mascot.webp';


const HowItWorksCardsContainer = () => {
  const scrollContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsData = [
    {
      id: 1,
      title: "Launch Your Deal",
      description: "Businesses create compelling offers, set competitive commission rates, and activate their referral campaigns to drive customer acquisition.",
      mascotSrc: launchYourDealMascot,
      mascotAlt: "DealShark Car Mascot",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-700"
    },
    {
      id: 2,
      title: "Share & Refer",
      description: "Our community of referrers promotes deals through their networks, earning substantial commissions for every successful customer conversion.",
      mascotSrc: getReferralsMascot,
      mascotAlt: "DealShark Customer Service Mascot",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-700"
    },
    {
      id: 3,
      title: "Subscribe & Earn",
      description: "Customers access exclusive discounts while referrers build sustainable income streams through strategic deal promotion.",
      mascotSrc: subscribeEarnMascot,
      mascotAlt: "DealShark Promotional Mascot",
      gradientFrom: "from-blue-500",
      gradientTo: "to-blue-700"
    }
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Auto-slide functionality with infinite loop
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging && scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        
        // Get dynamic card width based on viewport
        const firstCard = container.querySelector('div');
        const cardWidth = firstCard ? firstCard.offsetWidth : 620;
        const gap = 20; // Gap between cards (gap-5 = 1.25rem ≈ 20px)
        const currentScroll = container.scrollLeft;
        
        // Calculate total width of original cards
        const singleSetWidth = cardsData.length * (cardWidth + gap);
        
        // Check if we've scrolled past the first set of cards
        if (currentScroll >= singleSetWidth - (cardWidth / 2)) {
          // Jump back to the beginning without animation
          container.scrollTo({
            left: 0,
            behavior: 'auto' // Instant jump, no animation
          });
          setCurrentIndex(0);
        } else {
          // Normal scroll by full card width for better mobile experience
          const scrollAmount = cardWidth + gap;
          const newScrollPosition = currentScroll + scrollAmount;
          
          container.scrollTo({
            left: newScrollPosition,
            behavior: 'smooth'
          });
          
          // Update index
          const newIndex = Math.floor(newScrollPosition / (cardWidth + gap)) % cardsData.length;
          setCurrentIndex(newIndex);
        }
      }
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, [isDragging, cardsData.length]);

  // Update current index on manual scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isDragging) return; // Don't update during drag
      
      const firstCard = container.querySelector('div');
      const cardWidth = firstCard ? firstCard.offsetWidth : 620;
      const gap = 20;
      const scrollPos = container.scrollLeft;
      const calculatedIndex = Math.round(scrollPos / (cardWidth + gap));
      
      if (calculatedIndex !== currentIndex && calculatedIndex >= 0 && calculatedIndex < cardsData.length) {
        setCurrentIndex(calculatedIndex);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isDragging, currentIndex, cardsData.length]);

  return (
    <div className="relative overflow-hidden">
      {/* Scrollable container with grab cursor */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className={`flex gap-5 sm:gap-4 md:gap-5 overflow-x-auto scrollbar-hide scroll-smooth select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          paddingLeft: 'max(1rem, calc((100vw - 1280px) / 2))',
          paddingRight: '1rem',
          scrollSnapType: 'x mandatory',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {/* Render cards twice for infinite loop effect */}
        {[...cardsData, ...cardsData].map((card, index) => (
          <div 
            key={`${card.id}-${index}`} 
            className="flex-shrink-0 w-[100%] sm:w-[75vw] md:w-[65vw] lg:w-[620px] scroll-snap-align-start"
          >
            <HowItWorksCard
              title={card.title}
              description={card.description}
              mascotSrc={card.mascotSrc}
              mascotAlt={card.mascotAlt}
              gradientFrom={card.gradientFrom}
              gradientTo={card.gradientTo}
            />
          </div>
        ))}
        <div className="hidden lg:flex min-w-[320px]"></div>

        {/* Pagination Dots */}
        {/* <div className="flex justify-center gap-2 mt-6 absolute bottom-0 left-1/2 transform -translate-x-1/2">
          {cardsData.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                const container = scrollContainerRef.current;
                const cardWidth = 620;
                const gap = 20;
                const scrollPosition = index * (cardWidth + gap);
                container.scrollTo({
                  left: scrollPosition,
                  behavior: 'smooth'
                });
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'w-8 bg-dealshark-blue' 
                  : 'w-2 bg-blue-300 hover:bg-blue-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div> */}
      </div>
    </div>
  );
};

export default HowItWorksCardsContainer;
