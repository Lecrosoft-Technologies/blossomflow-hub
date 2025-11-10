import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, DollarSign, Package, Tag, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [promoCode, setPromoCode] = useState({
    code: '',
    discount: '',
    type: 'percentage' as 'percentage' | 'fixed',
  });

  const handleCreatePromo = () => {
    // TODO: Connect to API
    toast({
      title: 'Promo Code Created',
      description: `Code ${promoCode.code} has been created successfully`,
    });
    setPromoCode({ code: '', discount: '', type: 'percentage' });
  };

  const stats = [
    { label: 'Total Classes', value: '24', icon: Calendar },
    { label: 'Active Users', value: '156', icon: Users },
    { label: 'Revenue (This Month)', value: '₦450,000', icon: DollarSign },
    { label: 'Promo Codes', value: '8', icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-heading font-bold mb-4 text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-xl text-muted-foreground">
              Manage your fitness hub
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-8 h-8 text-chocolate" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="classes" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-4 mb-8">
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="promo">Promo Codes</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>

            <TabsContent value="classes">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Manage Classes</h2>
                <Button className="bg-chocolate text-creamish hover:bg-chocolate-light">
                  <Calendar className="w-4 h-4 mr-2" />
                  Add New Class
                </Button>
                <div className="mt-6 text-muted-foreground">
                  Class management interface will be here
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Recent Orders</h2>
                <div className="text-muted-foreground">
                  Order management interface will be here
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="promo">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Create Promo Code</h2>
                <div className="max-w-md space-y-4">
                  <div>
                    <Label htmlFor="code">Promo Code</Label>
                    <Input
                      id="code"
                      placeholder="SUMMER2025"
                      value={promoCode.code}
                      onChange={(e) => setPromoCode({ ...promoCode, code: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount">Discount Value</Label>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="20"
                      value={promoCode.discount}
                      onChange={(e) => setPromoCode({ ...promoCode, discount: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Type</Label>
                    <div className="flex gap-4 mt-2">
                      <Button
                        variant={promoCode.type === 'percentage' ? 'default' : 'outline'}
                        onClick={() => setPromoCode({ ...promoCode, type: 'percentage' })}
                      >
                        Percentage
                      </Button>
                      <Button
                        variant={promoCode.type === 'fixed' ? 'default' : 'outline'}
                        onClick={() => setPromoCode({ ...promoCode, type: 'fixed' })}
                      >
                        Fixed Amount
                      </Button>
                    </div>
                  </div>
                  <Button 
                    className="bg-chocolate text-creamish hover:bg-chocolate-light w-full"
                    onClick={handleCreatePromo}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Create Promo Code
                  </Button>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="products">
              <Card className="p-8">
                <h2 className="text-2xl font-bold mb-6">Manage Products</h2>
                <Button className="bg-chocolate text-creamish hover:bg-chocolate-light">
                  <Package className="w-4 h-4 mr-2" />
                  Add New Product
                </Button>
                <div className="mt-6 text-muted-foreground">
                  Product management interface will be here
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
