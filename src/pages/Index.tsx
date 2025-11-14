import Header from '@/components/Header';
import Hero from '@/components/Hero';
import VirtualClasses from '@/components/VirtualClasses';
import ProductGrid from '@/components/ProductGrid';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';
import Gallery from '@/components/Gallery';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <VirtualClasses />
      <ProductGrid />
      <Gallery />
      <Testimonials />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
