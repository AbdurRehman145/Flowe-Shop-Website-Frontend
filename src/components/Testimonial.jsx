import { useState } from "react";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function TestimonialSection() {
  // Define array of testimonials
  const testimonials = [
    {
      id: 1,
      text: "When a beautiful design is combined with powerful technology, it truly is an artwork. I love how my website operates and looks with this theme. Thank you for the awesome product.",
      name: "Samia Robiul",
      image: "profile1" // This would be the image path in a real implementation
    },
    {
      id: 2,
      text: "The attention to detail in this design is remarkable. My customers have consistently commented on how professional and intuitive my new website feels. Worth every penny!",
      name: "Michael Chen",
      image: "profile2"
    },
    {
      id: 3,
      text: "I've tried many website themes before, but this one stands out for its unique blend of aesthetics and functionality. The support team has been incredibly helpful throughout the setup process.",
      name: "Elena Rodriguez",
      image: "profile3"
    }
  ];

  // State to track current testimonial index and hover state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Function to handle dot click
  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Navigation functions
  const nextTestimonial = () => {
    const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const prevTestimonial = () => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  return (
    <div 
      className="relative w-full bg-pink-400 flex flex-col md:flex-row items-center overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Left side - Image container */}
      <div className="w-full md:w-1/2 p-8 flex justify-center items-center">
        <div className="relative w-64 h-64 md:w-80 md:h-96 bg-pink-300 rounded-lg shadow-lg overflow-hidden flex items-center justify-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 rounded-br-full"></div>
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-pink-200 opacity-50 rounded-tl-full"></div>
          
          {/* Placeholder text - would be replaced with actual image in production */}
          <div className="text-center text-white">
            <div className="mb-4">
              <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
              </svg>
            </div>
            <p className="font-medium">{testimonials[currentIndex].name}</p>
            <p className="text-sm mt-2 px-4">Customer {currentIndex + 1}</p>
          </div>
          
          {/* Decorative elements - Flowers */}
          <div className="absolute -bottom-2 -left-2 w-16 h-16 bg-pink-200 rounded-full opacity-50"></div>
          <div className="absolute top-4 right-4 w-8 h-8 bg-pink-200 rounded-full opacity-70"></div>
        </div>
      </div>
      
      {/* Right side - Testimonial content */}
      <div className="w-full md:w-1/2 p-6 md:p-12 text-white">
        {/* Testimonial text with fade transition */}
        <div className="mb-8" key={testimonials[currentIndex].id}>
          <p className="text-center italic mb-6">
            {testimonials[currentIndex].text}
          </p>
        </div>
        
        {/* Customer name */}
        <div className="text-center mb-8">
          <h3 className="text-xl font-semibold">{testimonials[currentIndex].name}</h3>
        </div>
        
        {/* Indicator dots */}
        <div className="flex justify-center space-x-2">
          {testimonials.map((_, index) => (
            <div 
              key={index} 
              onClick={() => handleDotClick(index)}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                currentIndex === index ? "w-8 bg-white" : "w-2 bg-white opacity-60 hover:opacity-80"
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons with fade animation */}
      <button 
        onClick={prevTestimonial}
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-300 ease-in-out
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 pointer-events-none'}`}
        aria-label="Previous testimonial"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700" />
      </button>
      
      <button 
        onClick={nextTestimonial}
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white hover:bg-gray-100 rounded-full p-2 shadow-md transition-all duration-300 ease-in-out
          ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'}`}
        aria-label="Next testimonial"
      >
        <ChevronRight className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
}