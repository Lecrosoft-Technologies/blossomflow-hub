import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Play, Calendar, Clock } from 'lucide-react';

const VirtualClasses = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-heading font-bold mb-6">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Virtual Classes
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join Dr. Blossom's live virtual Zumba classes from the comfort of your home
            </p>
          </div>

          <div className="glass-card p-12 text-center">
            <Play className="w-24 h-24 mx-auto mb-8 text-primary" />
            <h2 className="text-3xl font-heading font-bold mb-6">Book Your Virtual Session</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the energy of our Zumba classes through live streaming. 
              Perfect for busy schedules or those who prefer working out at home.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="glass-card p-6">
                <Calendar className="w-8 h-8 mb-4 text-primary mx-auto" />
                <h3 className="text-xl font-bold mb-2">Live Sessions</h3>
                <p className="text-muted-foreground">Join real-time classes with Dr. Blossom</p>
              </div>
              <div className="glass-card p-6">
                <Clock className="w-8 h-8 mb-4 text-primary mx-auto" />
                <h3 className="text-xl font-bold mb-2">On-Demand</h3>
                <p className="text-muted-foreground">Access recorded sessions anytime</p>
              </div>
            </div>

            <Button className="btn-primary text-lg">Book Virtual Class - ₦3,000</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VirtualClasses;