// pages/Cart.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Minus, Plus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../context/CheckoutContext';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useCart();
  const { clearCheckoutData } = useCheckout();
  const [promoCode, setPromoCode] = useState("");

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

  const subtotal = getCartTotal();
  const total = subtotal;

  if (cart.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <button 
            onClick={handleContinueShopping}
            className="bg-pink-500 text-white px-8 py-3 rounded hover:bg-pink-600"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="flex flex-col">
        {cart.map(item => (
          <div key={item.id} className="flex items-center border-b py-4">
            <div className="w-32 h-32 bg-gray-100 flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-grow ml-8">
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <h3 className="text-lg font-medium">{item.name}</h3>
                  <p className="text-gray-600">Product ID: {item.id}</p>
                </div>
                <div className="flex items-center space-x-8">
                  <span className="text-lg font-medium">${item.price.toFixed(2)}</span>
                  <div className="flex items-center border border-gray-300">
                    <button 
                      className="px-3 py-1"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-1 border-l border-r border-gray-300">{item.quantity}</span>
                    <button 
                      className="px-3 py-1"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-lg font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  <button onClick={() => removeFromCart(item.id)}>
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <div className="w-5/12">
          <div className="flex flex-col space-y-4">
            <div className="mb-4">
              <h3 className="text-xl font-bold mb-4">Promo Code</h3>
              <div className="border border-gray-300 p-4">
                <input 
                  type="text" 
                  className="w-full border border-gray-300 p-2 mb-4" 
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button className="bg-pink-500 text-white px-6 py-3 w-full">
                  Apply Promo Code
                </button>
              </div>
            </div>
            <div className="flex space-x-4">
              <button 
                className="bg-pink-500 text-white px-6 py-3 text-sm md:text-base flex-1"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
              <button 
                className="bg-pink-500 text-white px-6 py-3 text-sm md:text-base flex-1"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        <div className="w-5/12">
          <h3 className="text-xl font-bold mb-4">Cart Totals</h3>
          <div className="border border-gray-300">
            <div className="flex justify-between p-4 border-b border-gray-300">
              <span className="font-medium">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-4">
              <span className="font-medium">Total</span>
              <span className="font-medium">${total.toFixed(2)}</span>
            </div>
          </div>
          <button 
            className="bg-pink-500 text-white w-full py-4 mt-4"
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}