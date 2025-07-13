import { X, CheckCircle } from 'lucide-react';

const AddToCartModal = ({ isOpen, onClose, product, quantity, onCartClick, onContinueShopping }) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Modal content */}
        <div className="p-8 text-center">
          {/* Success icon */}
          <div className="mb-6">
            <CheckCircle size={64} className="text-green-500 mx-auto" />
          </div>

          {/* Success message */}
          <h2 className="text-2xl font-serif text-gray-800 mb-2">
            Added to Cart!
          </h2>
          <p className="text-gray-600 mb-6">
            {quantity} × {product.name} has been successfully added to your cart.
          </p>

          {/* Product summary */}
          <div className="flex items-center justify-center mb-8 p-4 rounded">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded mr-4"
            />
            <div className="text-left">
              <h3 className="font-medium text-gray-800 text-sm mb-1">
                {product.name}
              </h3>
              <p className="text-gray-600 text-sm">
                Quantity: {quantity}
              </p>
              <p className="text-rose-500 font-semibold text-sm">
                ${(product.price * quantity).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onContinueShopping}
              className="flex-1 px-6 py-3 rounded-lg border border-rose-500  text-gray-700 hover:bg-rose-500 hover:text-white transition-all duration-250 uppercase tracking-wide text-sm font-medium whitespace-nowrap"
            >
              Continue Shopping
            </button>
            <button
              onClick={onCartClick}
              className="flex-1 px-6 py-3 rounded-md bg-pink-500 text-white border hover:bg-white hover:text-gray-700 hover:border-pink-500 transition-all duration-250 uppercase tracking-wide text-sm font-medium"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;