import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Search, X } from 'lucide-react';

// CollapsibleSection component
const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <div className="border-b border-gray-200 pb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left font-medium py-2"
      >
        {title}
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={16} className="ml-1" />
        </span>
      </button>
      {isOpen && (
        <div className="mt-2 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
};

const Shop = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    inStock: false,
    outOfStock: false,
    minPrice: '',
    maxPrice: '',
    productTypes: [],
    brands: [],
    colors: []
  });
  const [filteredProducts, setFilteredProducts] = useState([]);

  const handleAvailabilityChange = (type) => {
    setFilters(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handlePriceChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      productTypes: prev.productTypes.includes(type)
        ? prev.productTypes.filter(t => t !== type)
        : [...prev.productTypes, type]
    }));
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const clearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query)
      );
    }

    // Availability filter
    if (filters.inStock && !filters.outOfStock) {
      filtered = filtered.filter(p => p.in_stock !== false);
    } else if (filters.outOfStock && !filters.inStock) {
      filtered = filtered.filter(p => p.in_stock === false);
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(p => p.price >= parseFloat(filters.minPrice));
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(p => p.price <= parseFloat(filters.maxPrice));
    }

    // Product type filter
    if (filters.productTypes.length > 0) {
      filtered = filtered.filter(p => 
        filters.productTypes.some(type => 
          p.category?.toLowerCase().includes(type.toLowerCase()) ||
          p.name?.toLowerCase().includes(type.toLowerCase())
        )
      );
    }

    setFilteredProducts(filtered);
  };

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

  useEffect(() => {
    applyFilters();
  }, [filters, allProducts, searchQuery]);

  const handleProductClick = (productId) => {
    navigate(`/products/${productId}`);
  };

  const productsToShow = filteredProducts.length > 0 || Object.values(filters).some(f => f !== false && f !== '' && f.length !== 0) || searchQuery.trim() ? filteredProducts : allProducts;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productsToShow.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(productsToShow.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatPrice = (price) => {
    return price?.toFixed(2) || '0.00';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
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

  if (allProducts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600 text-lg">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-8xl ml-0">
      <div className="flex flex-col md:flex-row gap-8 md:items-start">
        <aside className="w-56 shrink-0 space-y-4">
          {/* Search Section */}
          <CollapsibleSection title="Search">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                {searchQuery ? (
                  <button
                    onClick={clearSearch}
                    className="text-gray-400 hover:text-gray-600 p-1"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <Search size={14} className="text-gray-400" />
                )}
              </div>
            </div>
            {searchQuery && (
              <div className="text-xs text-gray-500 mt-1">
                {productsToShow.length} result{productsToShow.length !== 1 ? 's' : ''} for "{searchQuery}"
              </div>
            )}
          </CollapsibleSection>

          <CollapsibleSection title="Availability">
            <label className="block text-sm">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={filters.inStock}
                onChange={() => handleAvailabilityChange('inStock')}
              /> In stock ({allProducts.filter(p => p.in_stock !== false).length})
            </label>
            <label className="block text-sm">
              <input 
                type="checkbox" 
                className="mr-2" 
                checked={filters.outOfStock}
                onChange={() => handleAvailabilityChange('outOfStock')}
              /> Out of stock ({allProducts.filter(p => p.in_stock === false).length})
            </label>
          </CollapsibleSection>

          <CollapsibleSection title="Price">
            <div className="flex space-x-2 mb-2">
              <input 
                type="number" 
                className="w-1/2 border px-2 py-1 rounded" 
                placeholder="Min" 
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              />
              <input 
                type="number" 
                className="w-1/2 border px-2 py-1 rounded" 
                placeholder="Max" 
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              />
            </div>
            <button 
              className="bg-black text-white px-3 py-1 rounded text-sm"
              onClick={applyFilters}
            >
              Filter
            </button>
          </CollapsibleSection>

          <CollapsibleSection title="Product type">
            {["Bouqet", "Potted Plant"].map(type => (
              <label key={type} className="block text-sm">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  checked={filters.productTypes.includes(type)}
                  onChange={() => handleProductTypeChange(type)}
                /> {type}
              </label>
            ))}
          </CollapsibleSection>
        </aside>

        <div className="flex-1">


          {productsToShow.length === 0 ? (
            <div className="text-center py-12">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? `No products match "${searchQuery}". Try adjusting your search or filters.`
                  : 'No products match your current filters. Try adjusting your selection.'
                }
              </p>
              {(searchQuery || Object.values(filters).some(f => f !== false && f !== '' && f.length !== 0)) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({
                      inStock: false,
                      outOfStock: false,
                      minPrice: '',
                      maxPrice: '',
                      productTypes: [],
                      brands: [],
                      colors: []
                    });
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <div 
                  key={product.id} 
                  className="flex flex-col bg-gray-50 rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover px-10"
                    />
                  </div>
                  
                  <div className="p-4 text-center flex-grow">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">{product.name}</h3>
                    <div className="flex justify-center items-center space-x-2">
                      <span className="text-red-500 font-semibold">${formatPrice(product.price)}</span>
                      {product.salePrice && product.salePrice > product.price && (
                        <span className="text-gray-400 text-sm line-through">${formatPrice(product.salePrice)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {productsToShow.length > 0 && (
        <div className="mt-8 flex flex-col items-center">
          <div className="flex space-x-1 mb-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              &lt;
            </button>

            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => paginate(index + 1)}
                className={`w-8 h-8 flex items-center justify-center rounded ${
                  currentPage === index + 1
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              &gt;
            </button>
          </div>

          <div className="text-sm text-gray-600">
            Showing {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, productsToShow.length)} of {productsToShow.length} results
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;