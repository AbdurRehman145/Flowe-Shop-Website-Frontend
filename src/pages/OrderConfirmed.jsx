import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, Phone } from 'lucide-react';
import product3 from "./../assets/product3.jpg"
import { useCheckout } from '../context/CheckoutContext';

export default function OrderConfirmedPage() {
  const navigate = useNavigate();
  const { 
    currentOrder, 
    completeOrder, 
    getFormattedAddress,
    clearCheckoutData 
  } = useCheckout();

  useEffect(() => {
    // If there's no current order, redirect to cart
    if (!currentOrder) {
      navigate('/home');
      return;
    }

    // Complete the order (move to order history) after component mounts
    const timer = setTimeout(() => {
      completeOrder();
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentOrder, completeOrder, navigate]);

  const handleTrackOrder = () => {
    if (currentOrder) {
      // In a real app, this would navigate to a tracking page
      alert(`Tracking order: ${currentOrder.orderNumber}`);
    }
  };

  const handleContinueShopping = () => {
    clearCheckoutData();
    navigate('/shop');
  };

  // If no current order, show loading or redirect
  if (!currentOrder) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Loading...</h2>
          <p className="text-gray-600">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  const formattedAddress = getFormattedAddress(currentOrder.deliveryInfo);

  return (
    <div className="flex flex-col md:flex-row max-w-6xl mx-auto p-4 gap-8">
      {/* Left Column - Order Details */}
      <div className="w-full md:w-7/12">
        {/* Confirmation Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-medium mb-2">Thank you for your order!</h1>
          <p className="text-gray-600">Your order has been confirmed and will be shipped soon.</p>
        </div>

        {/* Order Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Order Information</h2>
          <div className="border border-gray-300 rounded p-4">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Order number</span>
              <span className="font-medium">{currentOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Order date</span>
              <span className="font-medium">{currentOrder.orderDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Estimated delivery</span>
              <span className="font-medium">{currentOrder.estimatedDelivery}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Shipping Address</h2>
          <div className="border border-gray-300 rounded p-4">
            {formattedAddress.map((line, index) => (
              <p key={index} className={`${index === 0 ? 'font-medium mb-1' : 'text-sm text-gray-600'}`}>
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Payment Method</h2>
          <div className="border border-rose-500 rounded p-4">
            <div className="flex items-center">
              <Package className="w-5 h-5 text-rose-500 mr-2" />
              <span>Cash on Delivery (COD)</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              You will pay ${currentOrder.total.toFixed(2)} when your order arrives.
            </p>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Order Status</h2>
          <div className="border border-gray-300 rounded p-4">
            <div className="flex items-center space-x-4">
              {currentOrder.trackingSteps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={`ml-2 text-sm ${
                    step.completed ? 'text-black' : 'text-gray-500'
                  }`}>
                    {step.step}
                  </span>
                  {index < currentOrder.trackingSteps.length - 1 && (
                    <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Need Help?</h2>
          <div className="border border-gray-300 rounded p-4">
            <div className="flex items-center mb-3">
              <Mail className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm">support@flowershop.com</span>
            </div>
            <div className="flex items-center">
              <Phone className="w-4 h-4 text-gray-500 mr-2" />
              <span className="text-sm">+92 300 123 4567</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button 
            onClick={handleTrackOrder}
            className="flex-1 bg-rose-500 text-white py-3 rounded font-medium hover:bg-rose-600 transition-colors"
          >
            Track Order
          </button>
          <button 
            onClick={handleContinueShopping}
            className="flex-1 border border-rose-500 text-rose-500 py-3 rounded font-medium hover:bg-rose-50 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="w-full md:w-5/12 mt-8 md:mt-0">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="text-lg font-medium mb-4">Order Summary</h3>
          
          {/* Order Items */}
          <div className="border-b border-gray-200 pb-4 mb-4">
            {currentOrder.items.map((item) => (
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
                <span className="font-medium">${item.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          {/* Price Breakdown */}
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal · {currentOrder.items.reduce((total, item) => total + item.quantity, 0)} items</span>
              <span>${currentOrder.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${currentOrder.shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <div className="text-right">
                <span className="text-xs text-gray-500">USD</span> <span>${currentOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center mb-2">
              <Truck className="w-4 h-4 text-rose-500 mr-2" />
              <span className="text-sm font-medium">Estimated Delivery</span>
            </div>
            <p className="text-sm text-gray-600">{currentOrder.estimatedDelivery}</p>
            <p className="text-xs text-gray-500 mt-1">International Shipping</p>
          </div>
        </div>
      </div>
    </div>
  );
}