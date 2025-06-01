import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import product3 from "./../assets/product3.jpg"
import { useCheckout } from '../context/CheckoutContext';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, getCartTotal } = useCart();
  const {
    contactInfo,
    deliveryInfo,
    paymentMethod,
    billingAddressSame,
    setContactInfo,
    setDeliveryInfo,
    setPaymentMethod,
    setBillingAddressSame,
    createOrder,
    isCheckoutValid
  } = useCheckout();

  // Local state for form validation
  const [errors, setErrors] = useState({});

  const handleContactChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedContactInfo = {
      ...contactInfo,
      [name]: type === 'checkbox' ? checked : value
    };
    setContactInfo(updatedContactInfo);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleDeliveryChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updatedDeliveryInfo = {
      ...deliveryInfo,
      [name]: type === 'checkbox' ? checked : value
    };
    setDeliveryInfo(updatedDeliveryInfo);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!contactInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactInfo.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!deliveryInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!deliveryInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!deliveryInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    
    if (!deliveryInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCompleteOrder = () => {
    if (!validateForm()) {
      return;
    }

    // Create the order FIRST
    const order = createOrder(cart, getCartTotal());
    
    // Navigate to order confirmation BEFORE clearing cart
    navigate('/order-confirmed');
    
    // Clear the cart AFTER navigation
  
  };

  const subtotal = getCartTotal();
  const shippingCost = 20.00;
  const total = subtotal + shippingCost;

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-4 gap-8">
      {/* Left Column - Form */}
      <div className="w-full md:w-7/12">
        {/* Contact Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Contact</h2>
            <a href="#" className="text-sm text-rose-500">Log in</a>
          </div>
          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={contactInfo.email}
              onChange={handleContactChange}
              placeholder="Email or mobile phone number"
              className={`w-full border rounded px-3 py-2 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNews"
              name="emailNews"
              checked={contactInfo.emailNews}
              onChange={handleContactChange}
              className="mr-2"
            />
            <label htmlFor="emailNews" className="text-sm">Email me with news and offers</label>
          </div>
        </div>

        {/* Delivery Section */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Delivery</h2>
          <div className="mb-4">
            <div className="relative">
              <select
                name="country"
                value={deliveryInfo.country}
                onChange={handleDeliveryChange}
                className="w-full border border-gray-300 rounded px-3 py-2 appearance-none"
              >
                <option value="Pakistan">Pakistan</option>
                <option value="Other">Other Countries</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <input
                type="text"
                name="firstName"
                value={deliveryInfo.firstName}
                onChange={handleDeliveryChange}
                placeholder="First name"
                className={`w-full border rounded px-3 py-2 ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div className="w-1/2">
              <input
                type="text"
                name="lastName"
                value={deliveryInfo.lastName}
                onChange={handleDeliveryChange}
                placeholder="Last name"
                className={`w-full border rounded px-3 py-2 ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              name="address"
              value={deliveryInfo.address}
              onChange={handleDeliveryChange}
              placeholder="Address"
              className={`w-full border rounded px-3 py-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              name="apartment"
              value={deliveryInfo.apartment}
              onChange={handleDeliveryChange}
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <input
                type="text"
                name="city"
                value={deliveryInfo.city}
                onChange={handleDeliveryChange}
                placeholder="City"
                className={`w-full border rounded px-3 py-2 ${
                  errors.city ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
            </div>
            <input
              type="text"
              name="postalCode"
              value={deliveryInfo.postalCode}
              onChange={handleDeliveryChange}
              placeholder="Postal code (optional)"
              className="w-1/2 border border-gray-300 rounded px-3 py-2"
            />
          </div>
          
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="saveInfo"
              name="saveInfo"
              checked={deliveryInfo.saveInfo}
              onChange={handleDeliveryChange}
              className="mr-2"
            />
            <label htmlFor="saveInfo" className="text-sm">Save this information for next time</label>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Shipping method</h2>
          <div className="border border-rose-500 rounded p-3 flex justify-between items-center">
            <span>International Shipping</span>
            <span className="font-medium">${shippingCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-2">Payment</h2>
          <p className="text-sm text-gray-600 mb-4">All transactions are secure and encrypted.</p>
          <div className="border border-rose-500 rounded p-3 mb-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="cod"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                className="mr-2"
              />
              <label htmlFor="cod">Cash on Delivery (COD)</label>
            </div>
          </div>
        </div>

        {/* Billing Address */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Billing address</h2>
          <div className="border border-rose-500 rounded p-3 mb-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="sameAddress"
                name="billingAddress"
                checked={billingAddressSame}
                onChange={() => setBillingAddressSame(true)}
                className="mr-2"
              />
              <label htmlFor="sameAddress">Same as shipping address</label>
            </div>
          </div>
          <div className="border border-gray-300 rounded p-3">
            <div className="flex items-center">
              <input
                type="radio"
                id="differentAddress"
                name="billingAddress"
                checked={!billingAddressSame}
                onChange={() => setBillingAddressSame(false)}
                className="mr-2"
              />
              <label htmlFor="differentAddress">Use a different billing address</label>
            </div>
          </div>
        </div>

        {/* Complete Order Button */}
        <button 
          onClick={handleCompleteOrder}
          className="w-full bg-rose-500 text-white py-3 rounded font-medium hover:bg-rose-600 transition-colors"
        >
          Complete order
        </button>
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full md:w-5/12 mt-8 md:mt-0">
        <div className="bg-gray-50 p-4 rounded">
          {/* Order Items */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            {cart && cart.length > 0 ? (
              cart.map(item => (
                <div key={item.id} className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                        <img src={item.image || product3} alt={item.name} className="max-w-full max-h-full" />
                      </div>
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">ID: {item.id}</p>
                    </div>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>No items in cart</p>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal · {cart ? cart.reduce((total, item) => total + item.quantity, 0) : 0} items</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <div className="text-right">
                <span className="text-xs text-gray-500">USD</span> <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}