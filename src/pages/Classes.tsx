import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Clock, Users, Video, MapPin } from 'lucide-react';
import { apiService, Class } from '@/services/api';
import { useCurrency } from '@/hooks/useCurrency';
import { useToast } from '@/hooks/use-toast';

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();
  const { toast } = useToast();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    try {
      const data = await apiService.getClasses();
      setClasses(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load classes',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleClassSelection = (classId: string) => {
    setSelectedClasses(prev =>
      prev.includes(classId)
        ? prev.filter(id => id !== classId)
        : [...prev, classId]
    );
  };

  const handleBookClass = (classId: string) => {
    // TODO: Add to cart and redirect to checkout
    toast({
      title: 'Class Added',
      description: 'Class has been added to your cart',
    });
  };

  const handleBulkPurchase = () => {
    if (selectedClasses.length === 0) {
      toast({
        title: 'No Classes Selected',
        description: 'Please select at least one class',
        variant: 'destructive',
      });
      return;
    }
    
    // TODO: Add selected classes to cart and redirect to checkout
    toast({
      title: 'Classes Added',
      description: `${selectedClasses.length} classes added to cart`,
    });
  };

  const totalBulkPrice = classes
    .filter(c => selectedClasses.includes(c.id))
    .reduce((sum, c) => sum + c.price, 0);

  return (
    <div className="min-h-screen bg-creamish">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-heading font-bold mb-6 text-chocolate">
              Fitness Classes
            </h1>
            <p className="text-xl text-chocolate/80 max-w-3xl mx-auto">
              Join Dr. Blossom and discover the joy of dance fitness with our high-energy Zumba classes
            </p>
          </div>

          {selectedClasses.length > 0 && (
            <div className="mb-8 bg-white p-6 rounded-lg shadow-lg flex items-center justify-between">
              <div>
                <p className="text-chocolate font-semibold">
                  {selectedClasses.length} class{selectedClasses.length > 1 ? 'es' : ''} selected
                </p>
                <p className="text-chocolate/70">Total: {formatPrice(totalBulkPrice)}</p>
              </div>
              <Button 
                className="bg-chocolate text-creamish hover:bg-chocolate/90"
                onClick={handleBulkPurchase}
              >
                Purchase Selected Classes
              </Button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem) => (
              <Card key={classItem.id} className="bg-white border-chocolate/20 hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-heading font-bold text-chocolate">{classItem.name}</h3>
                    <Checkbox
                      checked={selectedClasses.includes(classItem.id)}
                      onCheckedChange={() => toggleClassSelection(classItem.id)}
                    />
                  </div>
                  
                  <p className="text-chocolate/70 mb-4">{classItem.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-chocolate/80">
                      {classItem.type === 'virtual' ? (
                        <Video className="w-5 h-5 mr-3 text-chocolate" />
                      ) : (
                        <MapPin className="w-5 h-5 mr-3 text-chocolate" />
                      )}
                      {classItem.type === 'virtual' ? 'Virtual Class' : 'In-Person'}
                    </div>
                    <div className="flex items-center text-chocolate/80">
                      <Calendar className="w-5 h-5 mr-3 text-chocolate" />
                      {new Date(classItem.date).toLocaleDateString()} at {classItem.time}
                    </div>
                    <div className="flex items-center text-chocolate/80">
                      <Clock className="w-5 h-5 mr-3 text-chocolate" />
                      {classItem.duration} minutes
                    </div>
                    <div className="flex items-center text-chocolate/80">
                      <Users className="w-5 h-5 mr-3 text-chocolate" />
                      {classItem.spotsAvailable} spots available
                    </div>
                  </div>
                  
                  <div className="text-2xl font-bold text-chocolate mb-6">
                    {formatPrice(classItem.price)}
                  </div>
                  
                  <Button 
                    className="bg-chocolate text-creamish hover:bg-chocolate/90 w-full"
                    onClick={() => handleBookClass(classItem.id)}
                    disabled={classItem.spotsAvailable === 0}
                  >
                    {classItem.spotsAvailable === 0 ? 'Sold Out' : 'Book Class'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Classes;
