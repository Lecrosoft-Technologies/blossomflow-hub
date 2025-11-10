import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Video, ShoppingBag, Clock, ExternalLink } from 'lucide-react';
import { apiService, PurchasedClass, Order } from '@/services/api';
import { useCurrency } from '@/hooks/useCurrency';

const UserDashboard = () => {
  const [purchasedClasses, setPurchasedClasses] = useState<PurchasedClass[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = useCurrency();

  // Mock user ID - will be replaced with actual auth
  const userId = 'user-1';

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [classes, userOrders] = await Promise.all([
        apiService.getPurchasedClasses(userId),
        apiService.getUserOrders(userId),
      ]);
      setPurchasedClasses(classes);
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-heading font-bold mb-4 text-foreground">
              My Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your classes and orders
            </p>
          </div>

          <Tabs defaultValue="classes" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="classes">My Classes</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
            </TabsList>

            <TabsContent value="classes" className="space-y-6">
              {loading ? (
                <div className="text-center py-12">Loading...</div>
              ) : purchasedClasses.length === 0 ? (
                <Card className="p-12 text-center">
                  <Video className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-bold mb-2">No Classes Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Book your first class to get started!
                  </p>
                  <Button className="bg-chocolate text-creamish hover:bg-chocolate-light">
                    Browse Classes
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {purchasedClasses.map((pc) => (
                    <Card key={pc.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">Class ID: {pc.classId}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              Purchased: {new Date(pc.purchasedAt).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Order: {pc.orderId}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            className="bg-chocolate text-creamish hover:bg-chocolate-light"
                            onClick={() => window.open(pc.zoomLink, '_blank')}
                          >
                            <Video className="w-4 h-4 mr-2" />
                            Join Class
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              {loading ? (
                <div className="text-center py-12">Loading...</div>
              ) : orders.length === 0 ? (
                <Card className="p-12 text-center">
                  <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-bold mb-2">No Orders Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Your order history will appear here
                  </p>
                  <Button className="bg-chocolate text-creamish hover:bg-chocolate-light">
                    Start Shopping
                  </Button>
                </Card>
              ) : (
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <Card key={order.id} className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold mb-2">Order #{order.id}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {new Date(order.createdAt).toLocaleDateString()} • {order.status}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">
                            {formatPrice(order.total)}
                          </div>
                        </div>
                      </div>
                      <div className="border-t pt-4">
                        <h4 className="font-semibold mb-2">Items:</h4>
                        <ul className="space-y-2">
                          {order.items.map((item) => (
                            <li key={item.id} className="flex justify-between text-sm">
                              <span>{item.name} x{item.quantity}</span>
                              <span>{formatPrice(item.price * item.quantity)}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserDashboard;
