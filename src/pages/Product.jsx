// pages/Product.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import AddToCartModal from '../components/AddtoCartModal';
const Product = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedThumbnail, setSelectedThumbnail] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [showModal, setShowModal] = useState(false);
  // Fetch product details when id changes
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:5000/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const productData = await response.json();
        setProduct(productData);
        setSelectedThumbnail(0); // Reset thumbnail selection
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowModal(true);
    }
  };

  const handleGoBack = () => {
    navigate('/shop');
  };

  const handleModalCartClick = () => {
  navigate('/cart');
  setShowModal(false);
  };

  const handleModalContinueShopping = () => {
  setShowModal(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-2">Error loading product</p>
            <p className="text-gray-600">{error}</p>
            <div className="mt-4 space-x-4">
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Retry
              </button>
              <button 
                onClick={handleGoBack}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-gray-600 text-lg mb-4">Product not found</p>
            <button 
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [product.image, product.image, product.image, product.image];
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={handleGoBack}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-800"
      >
        <span className="mr-2">←</span> Back to Products
      </button>

      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="md:w-1/2 flex">
          <div className="hidden md:flex flex-col gap-2 mr-4">
            {productImages.map((image, index) => (
              <div 
                key={index}
                className={`w-20 h-20 cursor-pointer border ${selectedThumbnail === index ? 'border-gray-500' : 'border-gray-200'}`}
                onClick={() => setSelectedThumbnail(index)}
              >
                <img 
                  src={image} 
                  alt={`${product.name} thumbnail ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="flex-grow">
            <div className="relative">
              {product.isNew && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 text-sm font-medium">
                  New
                </div>
              )}
              <img 
                src={productImages[selectedThumbnail]} 
                alt={product.name} 
                className="w-full aspect-square object-contain bg-gray-50"
              />
            </div>
          </div>
        </div>
        
        <div className="md:w-1/2">
          <h1 className="text-4xl font-serif mb-2">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-6">
            <p className="text-xl text-red-500 font-semibold">${product.price?.toFixed(2)}</p>
            {product.salePrice && product.salePrice > product.price && (
              <p className="text-xl text-gray-400 line-through">${product.salePrice.toFixed(2)}</p>
            )}
          </div>
          
          <div className="prose prose-sm text-gray-600 mb-8">
            <p>
              {product.description || "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris in erat justo. Nullam ac urna eu felis dapibus condimentum sit amet a augue. Sed non neque elit. Sed ut imperdiet nisi. Proin condimentum fermentum nunc."}
            </p>
          </div>

          <div className="flex items-center mb-8">
            <div className="mr-4">
              <span className="text-gray-700">Quantity</span>
            </div>
            <div className="flex items-center border border-gray-300">
              <button 
                onClick={decreaseQuantity}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                <span className="font-medium">−</span>
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button 
                onClick={increaseQuantity}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
              >
                <span className="font-medium">+</span>
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="ml-4 bg-black text-white px-8 py-3 uppercase tracking-wide text-sm font-medium hover:bg-gray-800"
            >
              ADD TO CART
            </button>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <div className="mb-2">
              <span className="font-medium text-gray-700">SKU:</span>{" "}
              <span className="text-gray-600">{product.sku || product.id}</span>
            </div>
            <div className="mb-2">
              <span className="font-medium text-gray-700">Categories:</span>{" "}
              <span className="text-gray-600">{product.category || "Various"}</span>
            </div>
            {product.tags && (
              <div className="mb-2">
                <span className="font-medium text-gray-700">Tags:</span>{" "}
                <span className="text-gray-600">{product.tags}</span>
              </div>
            )}
            <div className="mb-2">
              <span className="font-medium text-gray-700">Availability:</span>{" "}
              <span className={`text-sm ${product.in_stock !== false ? 'text-green-600' : 'text-red-600'}`}>
                {product.in_stock !== false ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <div className="flex -mb-px">
            <button 
              className={`py-4 px-8 font-medium ${activeTab === 'description' 
                ? 'text-white bg-red-500' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('description')}
            >
              DESCRIPTION
            </button>
            <button 
              className={`py-4 px-8 font-medium ${activeTab === 'additional-information' 
                ? 'text-white bg-red-500' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('additional-information')}
            >
              ADDITIONAL INFORMATION
            </button>
            <button 
              className={`py-4 px-8 font-medium ${activeTab === 'reviews' 
                ? 'text-white bg-red-500' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('reviews')}
            >
              REVIEWS ({product.reviewCount || 2})
            </button>
          </div>
        </div>
        
        <div className="py-8">
          {activeTab === 'description' && (
            <div>
              <h2 className="text-3xl font-serif text-gray-800 mb-6">
                {product.name} - Product Details
              </h2>
              <p className="text-gray-600">
                {product.longDescription || product.description || "Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem. Maecenas nec odio et ante"}
              </p>
            </div>
          )}
          
          {activeTab === 'additional-information' && (
            <div>
              <div className="grid grid-cols-3 gap-4 max-w-lg">
                {product.weight && (
                  <>
                    <div className="font-medium text-gray-700">Weight:</div>
                    <div className="col-span-2 text-gray-600">{product.weight}</div>
                  </>
                )}
                
                {product.dimensions && (
                  <>
                    <div className="font-medium text-gray-700">Dimensions:</div>
                    <div className="col-span-2 text-gray-600">{product.dimensions}</div>
                  </>
                )}
                
                {!product.weight && !product.dimensions && (
                  <>
                    <div className="font-medium text-gray-700">Weight:</div>
                    <div className="col-span-2 text-gray-600">1 kg</div>
                    <div className="font-medium text-gray-700">Dimensions:</div>
                    <div className="col-span-2 text-gray-600">30 × 30 × 50 cm</div>
                  </>
                )}
              </div>
            </div>
          )}
          
          {activeTab === 'reviews' && (
            <div>
              {product.reviews && product.reviews.length > 0 ? (
                <>
                  {product.reviews.map((review, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                      <div className="flex items-center mb-2">
                        <div className="font-medium mr-2">{review.author || `Customer ${index + 1}`}</div>
                        <div className="text-yellow-400 text-sm">
                          {'★'.repeat(review.rating || 5)}{'☆'.repeat(5 - (review.rating || 5))}
                        </div>
                        <div className="text-gray-400 text-sm ml-2">{review.date || 'May 15, 2025'}</div>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="border-b border-gray-200 pb-4 mb-4">
                    <div className="flex items-center mb-2">
                      <div className="font-medium mr-2">Jane Doe</div>
                      <div className="text-yellow-400 text-sm">★★★★★</div>
                      <div className="text-gray-400 text-sm ml-2">May 15, 2025</div>
                    </div>
                    <p className="text-gray-600">Beautiful product! It arrived in perfect condition and looks exactly like the pictures.</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-center mb-2">
                      <div className="font-medium mr-2">John Smith</div>
                      <div className="text-yellow-400 text-sm">★★★★☆</div>
                      <div className="text-gray-400 text-sm ml-2">May 10, 2025</div>
                    </div>
                    <p className="text-gray-600">Great product, very happy with my purchase. Fast delivery too!</p>
                  </div>
                </>
              )}
              
              <button className="bg-gray-800 text-white px-6 py-2 text-sm hover:bg-gray-700">
                WRITE A REVIEW
              </button>
            </div>
          )}
        </div>
      </div>

      <AddToCartModal
      isOpen={showModal}
      onClose={() => setShowModal(false)}
      product={product}
      quantity={quantity}
      onCartClick={handleModalCartClick}
      onContinueShopping={handleModalContinueShopping}
    />
    </div>
  );
};

export default Product;