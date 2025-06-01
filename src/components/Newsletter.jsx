export default function NewsletterSection() {
  return (
    <section className="bg-gray-100 py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-8">
        
        {/* Text */}
        <div>
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-4">SEND NEWSLETTER</h2>
          <p className="text-gray-600 text-lg">
            Enter Your Email Address For Our Mailing List To Keep Your Self Update
          </p>
        </div>

        {/* Email input and button */}
        <form className="flex items-center border-b border-gray-300 max-w-lg w-full">
          <input
            type="email"
            placeholder="email@example.com"
            className="flex-1 px-4 py-2 bg-transparent text-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-gray-700 text-white font-semibold hover:bg-pink-500 transition-colors duration-300"
          >
            Subscribe
          </button>
        </form>
        
      </div>
    </section>
  );
}
