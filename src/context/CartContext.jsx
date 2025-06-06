import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return {
        ...state,
        cart: [...state.cart, action.payload]
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.id !== action.payload)
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
        appliedCoupon: null,
        discount: 0,
        couponDescription: null
      };

    case 'APPLY_COUPON':
      return {
        ...state,
        appliedCoupon: action.payload.code,
        discount: action.payload.discount,
        couponDescription: action.payload.description
      };

    case 'REMOVE_COUPON':
      return {
        ...state,
        appliedCoupon: null,
        discount: 0,
        couponDescription: null
      };

    // NEW: Action to restore cart from localStorage
    case 'RESTORE_CART':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
};

const AVAILABLE_COUPONS = {
  'SAVE10': { discount: 0.10, description: '10% off your order' },
  'SAVE20': { discount: 0.20, description: '20% off your order' },
  'WELCOME5': { discount: 0.05, description: '5% off for new customers' },
  'FREESHIP': { discount: 0, description: 'Free shipping', type: 'shipping' }
};

const initialState = {
  cart: [],
  appliedCoupon: null,
  discount: 0,
  couponDescription: null
};

// NEW: Helper functions for localStorage
const saveCartToStorage = (cartState) => {
  try {
    const cartData = {
      cart: cartState.cart,
      appliedCoupon: cartState.appliedCoupon,
      discount: cartState.discount,
      couponDescription: cartState.couponDescription
    };
    localStorage.setItem('shopping-cart', JSON.stringify(cartData));
  } catch (error) {
    console.warn('Failed to save cart to localStorage:', error);
  }
};

const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('shopping-cart');
    if (savedCart) {
      return JSON.parse(savedCart);
    }
  } catch (error) {
    console.warn('Failed to load cart from localStorage:', error);
  }
  return null;
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoaded, setIsLoaded] = useState(false);

  // NEW: Load cart from localStorage on component mount
  useEffect(() => {
    const savedCartData = loadCartFromStorage();
    if (savedCartData) {
      dispatch({
        type: 'RESTORE_CART',
        payload: savedCartData
      });
    }
    setIsLoaded(true);
  }, []);

  // NEW: Save cart to localStorage whenever cart state changes (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      saveCartToStorage(state);
    }
  }, [state, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    dispatch({
      type: 'ADD_TO_CART',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      }
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity >= 1) {
      dispatch({
        type: 'UPDATE_QUANTITY',
        payload: { id, quantity }
      });
    }
  };

  const removeFromCart = (id) => {
    dispatch({
      type: 'REMOVE_FROM_CART',
      payload: id
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const applyCoupon = (couponCode) => {
    const upperCaseCode = couponCode.toUpperCase().trim();
    const coupon = AVAILABLE_COUPONS[upperCaseCode];
    
    if (coupon) {
      dispatch({
        type: 'APPLY_COUPON',
        payload: {
          code: upperCaseCode,
          discount: coupon.discount,
          description: coupon.description
        }
      });
      return { success: true, message: `Coupon applied: ${coupon.description}` };
    } else {
      return { success: false, message: 'Invalid coupon code' };
    }
  };

  const removeCoupon = () => {
    dispatch({ type: 'REMOVE_COUPON' });
  };

  const getCartSubtotal = () => {
    return state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getCartSubtotal();
    return subtotal * state.discount;
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discountAmount = getDiscountAmount();
    return subtotal - discountAmount;
  };

  const getCartItemsCount = () => {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart: state.cart,
      appliedCoupon: state.appliedCoupon,
      discount: state.discount,
      couponDescription: state.couponDescription,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      applyCoupon,
      removeCoupon,
      getCartSubtotal,
      getDiscountAmount,
      getCartTotal,
      getCartItemsCount,
      availableCoupons: AVAILABLE_COUPONS
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};