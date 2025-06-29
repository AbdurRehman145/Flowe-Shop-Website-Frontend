import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  
  const { getCartItemsCount } = useCart();
  const cartItemsCount = getCartItemsCount();
  
  // Get current location to determine active nav item
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Function to check if a nav item is active
  const isActiveNavItem = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', hasDropdown: false, path: '/' },
    { name: 'Shop', hasDropdown: false, path: '/shop' },
    { name: 'Cart', hasDropdown: false, path: '/cart' },
    { name: 'About Us', hasDropdown: false, path: '/about' },
    { name: 'Pages', hasDropdown: true, path: '#' },
  ];

  const pagesDropdownItems = [
    { name: 'FAQ', path: '/faq' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
  ];

  return (
    <nav className="bg-white py-4 shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-3xl font-bold">
            <span className="text-black">Flo</span>
            <span className="text-pink-500">Sun</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map((item, index) => (
            <div key={index} className="relative">
              {item.hasDropdown ? (
                <button
                  onClick={() => toggleDropdown(item.name)}
                  className="flex items-center font-medium hover:text-pink-500 transition duration-200 text-black"
                >
                  {item.name}
                  <ChevronDown size={16} className="ml-1" />
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center font-medium hover:text-pink-500 transition duration-200 ${
                    isActiveNavItem(item.path) ? 'text-pink-500' : 'text-black'
                  }`}
                >
                  {item.name}
                </Link>
              )}
              
              {/* Desktop Dropdown */}
              {item.hasDropdown && activeDropdown === item.name && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
                  <div className="py-2">
                    {pagesDropdownItems.map((dropdownItem, dropdownIndex) => (
                      <Link
                        key={dropdownIndex}
                        to={dropdownItem.path}
                        className={`block px-4 py-2 hover:text-pink-500 hover:bg-gray-50 transition duration-200 ${
                          isActiveNavItem(dropdownItem.path) ? 'text-pink-500' : 'text-black'
                        }`}
                        onClick={() => setActiveDropdown(null)}
                      >
                        {dropdownItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cart and Search */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="text-black hover:text-pink-500 cursor-pointer" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          
        </div>

        {/* Mobile Navigation Icons */}
        <div className="flex lg:hidden items-center space-x-4">
          <Link to="/cart" className="relative">
            <ShoppingCart className="text-black hover:text-pink-500 cursor-pointer" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </Link>
          <div>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 text-black hover:text-pink-500 cursor-pointer" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <button
            onClick={toggleMenu}
            className="text-black hover:text-pink-500 transition"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${
          isMenuOpen ? 'block' : 'hidden'
        } absolute w-full bg-white shadow-md z-50 transition-all duration-300`}
      >
        <div className="container mx-auto px-4 py-3">
          {navItems.map((item, index) => (
            <div key={index} className="py-2">
              {item.hasDropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center justify-between w-full font-medium hover:text-pink-500 transition duration-200 text-black"
                  >
                    {item.name}
                    <ChevronDown size={16} className="ml-1" />
                  </button>
                  {activeDropdown === item.name && (
                    <div className="pl-4 mt-2 space-y-2">
                      {pagesDropdownItems.map((dropdownItem, dropdownIndex) => (
                        <Link
                          key={dropdownIndex}
                          to={dropdownItem.path}
                          className={`block hover:text-pink-500 transition duration-200 ${
                            isActiveNavItem(dropdownItem.path) ? 'text-pink-500' : 'text-black'
                          }`}
                          onClick={() => {
                            setActiveDropdown(null);
                            setIsMenuOpen(false);
                          }}
                        >
                          {dropdownItem.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center justify-between w-full font-medium hover:text-pink-500 transition duration-200 ${
                    isActiveNavItem(item.path) ? 'text-pink-500' : 'text-black'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;