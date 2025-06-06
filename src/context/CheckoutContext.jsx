import { createContext, useContext, useReducer, useState } from 'react';

const CheckoutContext = createContext();

const checkoutReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CONTACT_INFO':
      return {
        ...state,
        contactInfo: { ...state.contactInfo, ...action.payload }
      };
    
    case 'SET_DELIVERY_INFO':
      return {
        ...state,
        deliveryInfo: { ...state.deliveryInfo, ...action.payload }
      };
    
    case 'SET_PAYMENT_METHOD':
      return {
        ...state,
        paymentMethod: action.payload
      };
    
    case 'SET_BILLING_ADDRESS_SAME':
      return {
        ...state,
        billingAddressSame: action.payload
      };
    
    case 'SET_BILLING_ADDRESS':
      return {
        ...state,
        billingAddress: action.payload
      };
    
    case 'SET_CURRENT_ORDER':
      return {
        ...state,
        currentOrder: action.payload
      };
    
    case 'ADD_TO_ORDER_HISTORY':
      return {
        ...state,
        orderHistory: [action.payload, ...state.orderHistory],
        currentOrder: null
      };
    
    case 'CLEAR_CHECKOUT_DATA':
      return {
        ...state,
        contactInfo: {
          email: '',
          phone: '',
          emailNews: false,
        },
        deliveryInfo: {
          country: 'Pakistan',
          firstName: '',
          lastName: '',
          address: '',
          apartment: '',
          city: '',
          postalCode: '',
          saveInfo: false,
        },
        paymentMethod: 'cod',
        billingAddressSame: true,
        billingAddress: null,
        currentOrder: null
      };
    
    default:
      return state;
  }
};

const initialState = {
  contactInfo: {
  email: '',
  phone: '',
  emailNews: false,
  },
  deliveryInfo: {
    country: 'Pakistan',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    saveInfo: false,
  },
  paymentMethod: 'cod',
  billingAddressSame: true,
  billingAddress: null,
  currentOrder: null,
  orderHistory: []
};

export const CheckoutProvider = ({ children }) => {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  const setContactInfo = (contactInfo) => {
    dispatch({
      type: 'SET_CONTACT_INFO',
      payload: contactInfo
    });
  };

  const setDeliveryInfo = (deliveryInfo) => {
    dispatch({
      type: 'SET_DELIVERY_INFO',
      payload: deliveryInfo
    });
  };

  const setPaymentMethod = (method) => {
    dispatch({
      type: 'SET_PAYMENT_METHOD',
      payload: method
    });
  };

  const setBillingAddressSame = (same) => {
    dispatch({
      type: 'SET_BILLING_ADDRESS_SAME',
      payload: same
    });
  };

  const setBillingAddress = (address) => {
    dispatch({
      type: 'SET_BILLING_ADDRESS',
      payload: address
    });
  };

  const generateOrderNumber = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `ORD-${new Date().getFullYear()}-${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  };

  const calculateEstimatedDelivery = () => {
    const now = new Date();
    const deliveryStart = new Date(now);
    const deliveryEnd = new Date(now);
    
    // Add 3-5 business days for delivery
    deliveryStart.setDate(now.getDate() + 3);
    deliveryEnd.setDate(now.getDate() + 5);
    
    const formatDate = (date) => {
      const options = { month: 'long', day: 'numeric' };
      return date.toLocaleDateString('en-US', options);
    };
    
    return `${formatDate(deliveryStart)}-${formatDate(deliveryEnd)}, ${new Date().getFullYear()}`;
  };

   const createOrder = (cartItems, cartSubtotal, appliedCoupon = null, discountAmount = 0, selectedShippingMethod = 'international') => { 
  const shippingCost = selectedShippingMethod === 'free' ? 0.00 : 20.00; 
  const orderNumber = generateOrderNumber();
  const estimatedDelivery = calculateEstimatedDelivery();
  const finalCartTotal = cartSubtotal - discountAmount; // Apply discount to cart total
  
  const order = {
    orderNumber,
    orderDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    estimatedDelivery,
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      total: item.price * item.quantity
    })),
    contactInfo: { ...state.contactInfo },
    deliveryInfo: { ...state.deliveryInfo },
    paymentMethod: state.paymentMethod,
    shippingMethod: selectedShippingMethod, 
    billingAddress: state.billingAddressSame ? null : state.billingAddress,
    subtotal: cartSubtotal,
    appliedCoupon: appliedCoupon,
    discountAmount: discountAmount,
    shippingCost,
    total: finalCartTotal + shippingCost, // Use discounted cart total + shipping
    status: 'confirmed',
    trackingSteps: [
      { step: 'Order Confirmed', completed: true, date: new Date() },
      { step: 'Processing', completed: false, date: null },
      { step: 'Shipped', completed: false, date: null },
      { step: 'Delivered', completed: false, date: null }
    ]
  };

  dispatch({
    type: 'SET_CURRENT_ORDER',
    payload: order
  });

  return order;
};

  const completeOrder = () => {
    if (state.currentOrder) {
      dispatch({
        type: 'ADD_TO_ORDER_HISTORY',
        payload: state.currentOrder
      });
    }
  };

  const clearCheckoutData = () => {
    dispatch({ type: 'CLEAR_CHECKOUT_DATA' });
  };

  const getOrderById = (orderNumber) => {
    return state.orderHistory.find(order => order.orderNumber === orderNumber);
  };

  const updateOrderStatus = (orderNumber, statusIndex) => {
    const orderIndex = state.orderHistory.findIndex(order => order.orderNumber === orderNumber);
    if (orderIndex !== -1) {
      const updatedHistory = [...state.orderHistory];
      const order = { ...updatedHistory[orderIndex] };
      
      // Update tracking steps
      for (let i = 0; i <= statusIndex; i++) {
        order.trackingSteps[i].completed = true;
        if (!order.trackingSteps[i].date) {
          order.trackingSteps[i].date = new Date();
        }
      }
      
      updatedHistory[orderIndex] = order;
      // Note: In a real app, you'd dispatch an action here
      // For simplicity, we're just returning the updated order
      return order;
    }
    return null;
  };

  const isCheckoutValid = () => {
    const { contactInfo, deliveryInfo } = state;
    
    return (
      contactInfo.email.trim() !== '' &&
      deliveryInfo.firstName.trim() !== '' &&
      deliveryInfo.lastName.trim() !== '' &&
      deliveryInfo.address.trim() !== '' &&
      deliveryInfo.city.trim() !== ''
    );
  };

  const getFormattedAddress = (address = state.deliveryInfo) => {
    const parts = [
      address.firstName && address.lastName ? `${address.firstName} ${address.lastName}` : '',
      address.address,
      address.apartment,
      address.city && address.postalCode ? `${address.city}, ${address.postalCode}` : address.city,
      address.country
    ].filter(Boolean);
    
    return parts;
  };

  return (
    <CheckoutContext.Provider value={{
      // State
      contactInfo: state.contactInfo,
      deliveryInfo: state.deliveryInfo,
      paymentMethod: state.paymentMethod,
      billingAddressSame: state.billingAddressSame,
      billingAddress: state.billingAddress,
      currentOrder: state.currentOrder,
      orderHistory: state.orderHistory,
      
      // Actions
      setContactInfo,
      setDeliveryInfo,
      setPaymentMethod,
      setBillingAddressSame,
      setBillingAddress,
      createOrder,
      completeOrder,
      clearCheckoutData,
      
      // Helpers
      getOrderById,
      updateOrderStatus,
      isCheckoutValid,
      getFormattedAddress,
      generateOrderNumber,
      calculateEstimatedDelivery
    }}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};