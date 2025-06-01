import Navbar from '../components/Navbar';
import Banner from '../components/Banner';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import History from '../components/History';
import Testimonial from '../components/Testimonial';
function Home() {
  return (
    <>
    <Banner/>
    <CategorySection/>
     <History/>
    <Testimonial/>
    <FeaturedProducts/>
    </>
  );
}

export default Home;
