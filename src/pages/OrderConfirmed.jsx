import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package, Truck, Mail, Phone } from 'lucide-react';
import product3 from "./../assets/product3.jpg";
import { useCheckout } from '../context/CheckoutContext';
import { useCart } from '../context/CartContext';

export default function OrderConfirmedPage() {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [isOrderSaved, setIsOrderSaved] = useState(false);
  const submittedRef = useRef(false); // Prevent double submission

  const { 
    currentOrder, 
    completeOrder, 
    getFormattedAddress,
    clearCheckoutData 
  } = useCheckout();

  const handleOrderSubmit = async (order) => {
    const payload = {
      customer: {
        name: `${order.deliveryInfo.firstName} ${order.deliveryInfo.lastName}`.trim(),
        email: order.contactInfo.email,
        phone: order.contactInfo.phone,
        address: [
          order.deliveryInfo.address,
          order.deliveryInfo.apartment,
          order.deliveryInfo.city,
          order.deliveryInfo.postalCode,
          order.deliveryInfo.country
        ].filter(Boolean).join(', ')
      },
      order: {
        total_amount: order.total,
        payment_method: order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Cash',
        shipping_method: order.shippingMethod === 'free' ? 'Free Shipping' : 'International Shipping',
        status: 'Pending',
        order_number: order.orderNumber,
        estimated_delivery: order.estimatedDelivery,
        shipping_cost: order.shippingCost,
        subtotal: order.subtotal
      },
      items: order.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        product_name: item.name
      }))
    };

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      const response = await fetch('http://localhost:5000/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Invalid response from server: ${text}`);
      }

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to submit order');

      setIsOrderSaved(true);
      clearCart();
      return true;
    } catch (err) {
      setSubmitError(err.message || 'Network error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!currentOrder) {
      navigate('/');
      return;
    }

    if (!submittedRef.current && !isOrderSaved && !isSubmitting) {
      submittedRef.current = true;
      handleOrderSubmit(currentOrder).then((success) => {
        if (success) {
          setTimeout(() => {
            completeOrder();
          }, 10000000);
        } else {
          submittedRef.current = false; // Allow retry
        }
      });
    }
  }, [currentOrder, isOrderSaved, isSubmitting, completeOrder, navigate]);

  const handleRetrySubmission = async () => {
    if (currentOrder && !isSubmitting) {
      submittedRef.current = true;
      const success = await handleOrderSubmit(currentOrder);
      if (success) {
        setTimeout(() => {
          completeOrder();
        }, 1000000);
      } else {
        submittedRef.current = false;
      }
    }
  };

  const handleSkipToSuccess = () => {
    setSubmitError(null);
    setIsOrderSaved(true);
    clearCart();
    setTimeout(() => {
      completeOrder();
    }, 10000000);
  };

  const handleTrackOrder = () => {
    alert(`Tracking order: ${currentOrder?.orderNumber}`);
  };

  const handleContinueShopping = () => {
    clearCheckoutData();
    navigate('/shop');
  };

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
            {isSubmitting ? (
              <div className="w-16 h-16 border-4 border-gray-300 border-t-rose-500 rounded-full animate-spin"></div>
            ) : submitError ? (
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-500 text-2xl">⚠</span>
              </div>
            ) : (
              <CheckCircle className="w-16 h-16 text-green-500" />
            )}
          </div>
          
          {isSubmitting ? (
            <>
              <h1 className="text-2xl font-medium mb-2">Processing your order...</h1>
              <p className="text-gray-600">Please wait while we save your order details.</p>
            </>
          ) : submitError ? (
            <>
              <h1 className="text-2xl font-medium mb-2 text-red-600">Order Processing Error</h1>
              <div className="bg-red-50 border border-red-200 rounded p-4 mb-4">
                <p className="text-red-700 text-sm mb-3">{submitError}</p>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={handleRetrySubmission}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                  >
                    Retry Submission
                  </button>
                  <button 
                    onClick={handleSkipToSuccess}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors text-sm"
                  >
                    Continue Without Saving
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-medium mb-2">Thank you for your order!</h1>
              <p className="text-gray-600">
                {isOrderSaved 
                  ? "Your order has been confirmed and saved to our system." 
                  : "Your order has been confirmed and will be processed soon."
                }
              </p>
            </>
          )}
        </div>

        {/* Show success status */}
        {isOrderSaved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-800 font-medium">Order successfully processed</span>
            </div>
          </div>
        )}

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

        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Contact Information</h2>
          <div className="border border-gray-300 rounded p-4">
            <p className="font-medium mb-1">{currentOrder.contactInfo.email}</p>
            <p className="text-sm text-gray-600">{currentOrder.contactInfo.phone}</p>
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

        {/* Company Contact Information */}
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
            className="flex-1 bg-rose-500 text-white py-3 rounded font-medium hover:bg-rose-600 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            Track Order
          </button>
          <button 
            onClick={handleContinueShopping}
            className="flex-1 border border-rose-500 text-rose-500 py-3 rounded font-medium hover:bg-rose-50 transition-colors disabled:opacity-50"
            disabled={isSubmitting}
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