import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Calendar, Clock, Video } from 'lucide-react';
import { apiService, Class } from '@/services/api';
import { useCurrency } from '@/hooks/useCurrency';

const VirtualClasses = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const { currency } = useCurrency();

  useEffect(() => {
    loadVirtualClasses();
  }, []);

  const loadVirtualClasses = async () => {
    const allClasses = await apiService.getClasses();
    setClasses(allClasses.filter(c => c.type === 'virtual'));
  };

  return (
    <div className="min-h-screen bg-creamish">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-heading font-bold mb-6 text-chocolate">
              Virtual Classes
            </h1>
            <p className="text-xl text-chocolate/80 max-w-3xl mx-auto">
              Join Dr. Blossom's live virtual Zumba classes from the comfort of your home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="bg-white p-8 border-chocolate/20">
                <div className="flex items-center mb-4">
                  <Video className="w-8 h-8 mr-3 text-chocolate" />
                  <h3 className="text-2xl font-bold text-chocolate">{classItem.name}</h3>
                </div>
                
                <p className="text-chocolate/70 mb-4">{classItem.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-chocolate/80">
                    <Calendar className="w-5 h-5 mr-3" />
                    {new Date(classItem.date).toLocaleDateString()} at {classItem.time}
                  </div>
                  <div className="flex items-center text-chocolate/80">
                    <Clock className="w-5 h-5 mr-3" />
                    {classItem.duration} minutes
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-chocolate">
                    {currency === '₦' ? `₦${classItem.price.naira.toLocaleString()}` : `$${classItem.price.usd.toFixed(2)}`}
                  </span>
                  <Button className="bg-chocolate text-creamish hover:bg-chocolate/90">
                    Book Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="bg-white p-12 text-center border-chocolate/20">
            <Play className="w-24 h-24 mx-auto mb-8 text-chocolate" />
            <h2 className="text-3xl font-heading font-bold mb-6 text-chocolate">
              How Virtual Classes Work
            </h2>
            <p className="text-chocolate/80 mb-8 max-w-2xl mx-auto">
              After booking, you'll receive a unique Zoom link in your email and dashboard. 
              Join the live session at the scheduled time and workout with our community!
            </p>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VirtualClasses;
