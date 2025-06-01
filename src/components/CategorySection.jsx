import banner from "./../assets/banner.jpg"
import tulip from "./../assets/tulip.jpg"
export default function CategorySection() {
  const categories = [
    { id: 1, image: tulip },
    { id: 2, image: banner },
    { id: 3, image: banner },
    { id: 4, image: banner},
    { id: 5, image: banner},
  ];

  return (
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-6 h-[700px]">
      
      {/* Left Tall Image */}
      <div
        className="relative h-full rounded-lg overflow-hidden bg-gray-200 bg-cover bg-center"
        style={{ backgroundImage: `url(${categories[0].image})` }}
      >
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex items-center justify-center h-full">
          <button className="bg-white text-black px-4 py-2 text-lg font-semibold rounded-md transition duration-300 hover:bg-pink-500 hover:text-white">
            Potted Plant
            <div className="text-sm tracking-widest">18 ITEMS</div>
          </button>
        </div>
      </div>

      {/* Right Grid */}
      <div className="lg:col-span-2 grid grid-cols-2 grid-rows-2 gap-4">
        {categories.slice(1).map((category) => (
          <div
            key={category.id}
            className="relative rounded-lg overflow-hidden bg-gray-200 bg-cover bg-center"
            style={{ backgroundImage: `url(${category.image})` }}
          >
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative z-10 flex items-center justify-center h-full">
              <button className="bg-white text-black px-4 py-2 text-lg font-semibold rounded-md transition duration-300 hover:bg-pink-500 hover:text-white">
                Potted Plant
                <div className="text-sm tracking-widest">18 ITEMS</div>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
