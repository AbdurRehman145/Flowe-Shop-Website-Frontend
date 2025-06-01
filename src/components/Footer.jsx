import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaVimeoV,
} from 'react-icons/fa';

export default function FloSunFooter() {
  return (
    <footer className="bg-[#1e1e1e] text-white py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

        {/* FloSun + Socials */}
        <div>
          <h1 className="text-4xl font-semibold text-white mb-4">Flo<span className="text-gray-300">Sun</span></h1>
          <p className="text-gray-300 mb-4">
            Lorem Khaled Ipsum is a major key to success. To be successful you’ve got to work hard you’ve got to make it.
          </p>
          <div className="flex gap-4">
            {[FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaVimeoV].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="border border-white rounded-full p-2 text-white hover:text-pink-400 hover:border-pink-400 transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {/* Information */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Information</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">Our Company</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Our Services</a></li>
            <li><a href="#">Why We?</a></li>
            <li><a href="#">Careers</a></li>
          </ul>
        </div>

        {/* Quicklink */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Quicklink</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">About</a></li>
            <li><a href="#">Blog</a></li>
            <li><a href="#">Shop</a></li>
            <li><a href="#">Cart</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Support</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#">Online Support</a></li>
            <li><a href="#">Shipping Policy</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="font-semibold text-lg mb-4">See Information</h3>
          <ul className="space-y-2 text-gray-300">
            <li>123, ABC, Road ##, Main City, Your address goes here.</li>
            <li>Phone: 01234 567 890</li>
            <li>Email: <a href="mailto:example@example.com" className="underline">https://example.com</a></li>
          </ul>
        </div>

      </div>
    </footer>
  );
}
