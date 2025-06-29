import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import banner from "./../assets/banner.jpg"
import banner2 from "./../assets/banner2.jpg"
import { Link } from 'react-router-dom';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animateText, setAnimateText] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const banners = [
    {
      id: 1,
      title: "New Arrivals",
      subtitle: "For Mother's Day!",
      description: "Exclusive Offer -10% Off This Week",
      buttonText: "SHOP NOW",
      image: banner // Replace with your actual image path
    },
    {
      id: 2,
      title: "New Arrivals",
      subtitle: "For Mother's Day!",
      description: "Exclusive Offer -10% Off This Week",
      buttonText: "SHOP NOW",
      image: banner2 // Replace with your actual image path
    }
  ];

  // Function to handle banner navigation
  const goToSlide = (index) => {
    setAnimateText(false);
    setTimeout(() => {
      setCurrentSlide(index);
      setAnimateText(true);
    }, 300);
  };

  const nextSlide = () => {
    const newIndex = currentSlide === banners.length - 1 ? 0 : currentSlide + 1;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentSlide === 0 ? banners.length - 1 : currentSlide - 1;
    goToSlide(newIndex);
  };

  // Auto-rotate banners (optional)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div 
      className="relative w-full h-96 md:h-[600px] overflow-hidden bg-pink-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Banner Images */}
      {banners.map((banner, index) => (
        <div 
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 
            ${currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          {/* Using a placeholder image for demo - replace with your own */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${banner.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            
          </div>
        </div>
      ))}

      {/* Text Content - Modified to align more to the left */}
      <div className="relative z-20 flex flex-col justify-center h-full w-full px-8">
        <div 
          className={`transition-all duration-500 max-w-lg ml-0 md:ml-16 lg:ml-24
            ${animateText ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}
        >
          <p className="text-red-500 text-2xl md:text-3xl font-medium mb-2">
            {banners[currentSlide].title}
          </p>
          <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-3">
            {banners[currentSlide].subtitle}
          </h2>
          <p className="text-gray-700 mb-6 md:text-lg">
            {banners[currentSlide].description}
          </p>
          <Link to="/shop">
          <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-md transition-colors duration-300">
            {banners[currentSlide].buttonText}
          </button>
          </Link>
        </div>
      </div>

      {/* Navigation Buttons with fade animation */}
      <button 
        onClick={prevSlide}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-300 ease-in-out
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      
      <button 
        onClick={nextSlide}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-300 ease-in-out
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 
              ${currentSlide === index ? 'bg-red-500 w-4' : 'bg-white'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;