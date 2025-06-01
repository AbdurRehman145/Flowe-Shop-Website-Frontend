// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { CheckoutProvider } from "./context/CheckoutContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmed from "./pages/OrderConfirmed";

export default function App() {
  return (
    <CartProvider>
      <CheckoutProvider>
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Shop" element={<Shop />} />
              <Route path="/products/:id" element={<Product />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmed" element={<OrderConfirmed />} />
            </Routes>
          </main>
          <Footer />
        </Router>
      </CheckoutProvider>
    </CartProvider>
  );
}