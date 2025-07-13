// pages/Cart.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, Tag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';

export default function Cart() {
  const navigate = useNavigate();
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    getCartSubtotal,
    getCartTotal,
    getDiscountAmount,
    appliedCoupon,
    couponDescription,
    applyCoupon,
    removeCoupon 
  } = useCart();
  const { clearCheckoutData } = useCheckout();
  const [promoCode, setPromoCode] = useState("");
  const [couponMessage, setCouponMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleContinueShopping = () => {
    navigate('/shop');
  };

  const handleProceedToCheckout = () => {
    if (cart.length > 0) {
      // Clear any previous checkout data when starting a new checkout
      clearCheckoutData();
      navigate('/checkout');
    }
  };

  const handleApplyCoupon = () => {
    if (promoCode.trim()) {
      const result = applyCoupon(promoCode);
      setCouponMessage(result.message);
      setMessageType(result.success ? 'success' : 'error');
      
      if (result.success) {
        setPromoCode("");
      }
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setCouponMessage("");
        setMessageType("");
      }, 5000);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage("Coupon removed");
    setMessageType("success");
    setTimeout(() => {
      setCouponMessage("");
      setMessageType("");
    }, 3000);
  };

  const subtotal = getCartSubtotal();
  const discountAmount = getDiscountAmount();
  const total = getCartTotal();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="mb-8">
              <ShoppingBag className="w-24 h-24 text-pink-300 mx-auto mb-6" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-12 text-lg max-w-md mx-auto leading-relaxed">
              Discover our amazing products and start building your perfect collection.
            </p>
            <button 
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-semibold border border-pink-600 hover:bg-white hover:text-gray-600 hover:bg-none hover:border-pink-600 transition-all duration-300 transition-colors duration-150"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2 text-pink-500" />
                  Your Items ({cart.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cart.map(item => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-center gap-6">
                      {/* Product Image */}
                      <div className="w-24 h-24 flex-shrink-0 bg-white border border-gray-200 overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-contain p-2" 
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h3>
                        <p className="text-pink-600 font-medium">${item.price.toFixed(2)}</p>
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-gray-100 overflow-hidden">
                        <button 
                          className="px-3 py-2  transition-colors duration-200"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={16} className="text-gray-600" />
                        </button>
                        <span className="px-4 py-2 font-medium text-gray-800 bg-white border-l border-r border-gray-200">
                          {item.quantity}
                        </span>
                        <button 
                          className="px-3 py-2  transition-colors duration-200"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>
                      
                      {/* Total Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      
                      {/* Remove Button */}
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Cart Actions */}
              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                  <button 
                    className="w-full sm:w-auto px-6 py-3 rounded-md bg-rose-500 text-white font-medium hover:bg-white hover:text-gray-600 transition-all duration-300 border border-rose-500"
                    onClick={handleContinueShopping}
                  >
                    Continue Shopping
                  </button>
                  <button 
                    className="flex items-center justify-center px-4 py-3 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300"
                    onClick={clearCart}
                  >
                    <Trash2 size={18} className="mr-2" />
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-0 border border-gray-200">
            {/* Promo Code Card */}
            <div className="bg-white">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                  <Tag className="w-5 h-5 mr-2 text-pink-500" />
                  Promo Code
                </h3>
              </div>
              
              <div className="p-6">
                <input 
                  type="text" 
                  className="w-full border border-gray-300 px-4 py-3 mb-4 focus:outline-none focus:ring-1 focus:ring-pink-600 focus:border-transparent transition-all duration-200" 
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                />
                
                {/* Message display */}
                {(couponMessage || (appliedCoupon && couponDescription)) && (
                  <div className={`mb-4 p-3 text-sm flex justify-between items-center ${
                    couponMessage && messageType === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : couponMessage && messageType === 'error'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-green-50 text-green-700 border border-green-200'
                  }`}>
                    <span className="font-medium">
                      {couponMessage || `${couponDescription}`}
                    </span>
                    {appliedCoupon && (
                      <button 
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 text-sm font-medium underline ml-2"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
                
                <button 
                  className="w-full bg-pink-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-white hover:text-gray-600 hover:border-pink-500 border border-transparent transition-all duration-250 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
                  onClick={handleApplyCoupon}
                  disabled={!promoCode.trim()}
                >
                  Apply Promo Code
                </button>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white border-t border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Order Summary</h3>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {/* Show discount if applied */}
                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="font-medium">Discount ({appliedCoupon})</span>
                      <span className="font-semibold">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">Total</span>
                      <span className="text-lg font-bold text-pink-600">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                 <button 
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 text-white py-3 px-6 rounded-xl font-semibold border border-pink-600 hover:bg-white hover:text-gray-600 hover:bg-none hover:border-pink-600 transition-all duration-300 transition-colors duration-150 mt-6"
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}