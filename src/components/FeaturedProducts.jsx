import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeaturedProducts() {
  // State
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [startIndex, setStartIndex] = useState(0);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/products');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const products = await response.json();
        setAllProducts(products);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  
  // Filter products based on category
  const filteredProducts = activeCategory === "All" 
    ? allProducts 
    : allProducts.filter(product => product.category === activeCategory);
  
  // Number of products to display at once
  const displayCount = 4;
  
  // Get current visible products
  const visibleProducts = filteredProducts.slice(startIndex, startIndex + displayCount);
  
  // Handle navigation
  const handlePrev = () => {
    setStartIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    const maxStartIndex = Math.max(0, filteredProducts.length - displayCount);
    setStartIndex(prev => Math.min(maxStartIndex, prev + 1));
  };
  
  // Check if navigation buttons should be disabled
  const isPrevDisabled = startIndex === 0;
  const isNextDisabled = startIndex >= filteredProducts.length - displayCount;
  
  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setStartIndex(0); // Reset to first page when changing category
  };

  // Get unique categories from products
  const categories = [...new Set(allProducts.map(product => product.category))];

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-2">Error loading products</p>
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No products state
  if (allProducts.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Featured Products</h2>
        
        <div className="flex items-center">
          <div className="hidden sm:flex items-center space-x-6 mr-4">
            <button 
              onClick={() => handleCategoryChange("All")}
              className={`text-sm font-medium ${activeCategory === "All" ? "text-red-500" : "text-gray-700 hover:text-red-500"}`}
            >
              All
            </button>
            {categories.map(category => (
              <button 
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`text-sm font-medium ${activeCategory === category ? "text-red-500" : "text-gray-700 hover:text-red-500"}`}
              >
                {category}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-2">
            <button 
              onClick={handlePrev}
              className={`p-2 rounded-md bg-gray-100 ${isPrevDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-pink-500'}`}
              disabled={isPrevDisabled}
              aria-label="Previous products"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={handleNext}
              className={`p-2 rounded-md bg-gray-100 ${isNextDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-200'}`}
              disabled={isNextDisabled}
              aria-label="Next products"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {visibleProducts.map((product) => (
      <div
            key={product.id}
            className="bg-white p-5 rounded-2xl flex flex-col items-center"
      >
          <div className="aspect-square w-full mb-4 overflow-hidden bg-gray-50 rounded-lg flex items-center justify-center">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-4/5 h-4/5 object-contain"
              />
            </div>
            <h3 className="text-center text-gray-800 font-semibold text-base mb-1">{product.name}</h3>
            <div className="flex justify-center items-center space-x-2 mt-1">
              <span className="text-gray-900 font-medium">${product.price?.toFixed(2)}</span>
              {product.salePrice && (
                <span className="text-red-500 line-through text-sm">${product.salePrice.toFixed(2)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}