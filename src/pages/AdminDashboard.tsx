import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, DollarSign, Package, Tag, Users, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Class, Product, Order, PromoCode } from '@/services/api';
import AddClassModal from '@/components/admin/AddClassModal';
import AddProductModal from '@/components/admin/AddProductModal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminDashboard = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [categories, setCategories] = useState<string[]>(['Fitness Gear', 'Apparel', 'Accessories', 'Nutrition']);
  const [newCategory, setNewCategory] = useState('');
  const [showClassModal, setShowClassModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const [promoCode, setPromoCode] = useState({
    code: '',
    discount: '',
    type: 'percentage' as 'percentage' | 'fixed',
    applicableTo: 'all' as 'all' | 'class' | 'product',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load from localStorage - will be replaced with API calls
    const savedClasses = localStorage.getItem('blossomClasses');
    const savedProducts = localStorage.getItem('blossomProducts');
    const savedOrders = localStorage.getItem('blossomOrders');
    const savedPromos = localStorage.getItem('blossomPromoCodes');
    
    if (savedClasses) setClasses(JSON.parse(savedClasses));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedOrders) setOrders(JSON.parse(savedOrders));
    if (savedPromos) setPromoCodes(JSON.parse(savedPromos));
  };

  const handleAddClass = (classData: Omit<Class, 'id'>) => {
    const newClass: Class = {
      ...classData,
      id: `class-${Date.now()}`,
    };
    const updated = [...classes, newClass];
    setClasses(updated);
    localStorage.setItem('blossomClasses', JSON.stringify(updated));
    toast({
      title: 'Class Added',
      description: `${classData.name} has been added successfully`,
    });
  };

  const handleDeleteClass = (id: string) => {
    const updated = classes.filter(c => c.id !== id);
    setClasses(updated);
    localStorage.setItem('blossomClasses', JSON.stringify(updated));
    toast({
      title: 'Class Deleted',
      description: 'Class has been removed',
    });
  };

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem('blossomProducts', JSON.stringify(updated));
    toast({
      title: 'Product Added',
      description: `${productData.name} has been added successfully`,
    });
  };

  const handleDeleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('blossomProducts', JSON.stringify(updated));
    toast({
      title: 'Product Deleted',
      description: 'Product has been removed',
    });
  };

  const handleCreatePromo = () => {
    if (!promoCode.code || !promoCode.discount) {
      toast({
        title: 'Validation Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const newPromo: PromoCode = {
      code: promoCode.code,
      discount: parseFloat(promoCode.discount),
      type: promoCode.type,
      applicableTo: promoCode.applicableTo,
      usedCount: 0,
    };

    const updated = [...promoCodes, newPromo];
    setPromoCodes(updated);
    localStorage.setItem('blossomPromoCodes', JSON.stringify(updated));
    toast({
      title: 'Promo Code Created',
      description: `Code ${promoCode.code} has been created successfully`,
    });
    setPromoCode({ code: '', discount: '', type: 'percentage', applicableTo: 'all' });
  };

  const handleDeletePromo = (code: string) => {
    const updated = promoCodes.filter(p => p.code !== code);
    setPromoCodes(updated);
    localStorage.setItem('blossomPromoCodes', JSON.stringify(updated));
    toast({
      title: 'Promo Code Deleted',
      description: 'Promo code has been removed',
    });
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    const updated = [...categories, newCategory.trim()];
    setCategories(updated);
    setNewCategory('');
    toast({
      title: 'Category Added',
      description: `${newCategory} has been added`,
    });
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
    localStorage.setItem('blossomOrders', JSON.stringify(updated));
    toast({
      title: 'Order Updated',
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const stats = [
    { label: 'Total Classes', value: classes.length.toString(), icon: Calendar },
    { label: 'Total Products', value: products.length.toString(), icon: Package },
    { label: 'Total Orders', value: orders.length.toString(), icon: Users },
    { label: 'Active Promos', value: promoCodes.length.toString(), icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-creamish">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto">
          <div className="mb-12">
            <h1 className="text-5xl font-heading font-bold mb-4 text-chocolate">
              Admin Dashboard
            </h1>
            <p className="text-xl text-chocolate/80">
              Manage your Zumba® fitness hub
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 animate-fade-in">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 bg-white border-chocolate/20 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="w-8 h-8 text-chocolate" />
                </div>
                <div className="text-3xl font-bold text-chocolate mb-1">{stat.value}</div>
                <div className="text-sm text-chocolate/70">{stat.label}</div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="classes" className="w-full">
            <TabsList className="grid w-full max-w-2xl grid-cols-5 mb-8">
              <TabsTrigger value="classes">Classes</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="promo">Promos</TabsTrigger>
            </TabsList>

            <TabsContent value="classes" className="animate-fade-in">
              <Card className="p-8 bg-white border-chocolate/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-chocolate">Manage Classes</h2>
                  <Button 
                    className="bg-chocolate text-creamish hover:bg-chocolate/90"
                    onClick={() => setShowClassModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Class
                  </Button>
                </div>
                <div className="space-y-4">
                  {classes.length === 0 ? (
                    <p className="text-chocolate/70 text-center py-8">No classes yet. Add your first class!</p>
                  ) : (
                    classes.map((classItem) => (
                      <div key={classItem.id} className="flex items-center justify-between p-4 border border-chocolate/20 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-chocolate">{classItem.name}</h3>
                          <p className="text-sm text-chocolate/70">{classItem.type} • {classItem.date} at {classItem.time}</p>
                          <p className="text-sm text-chocolate/70">{classItem.currency}{classItem.price} • {classItem.spotsAvailable}/{classItem.capacity} spots</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteClass(classItem.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="products" className="animate-fade-in">
              <Card className="p-8 bg-white border-chocolate/20">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-chocolate">Manage Products</h2>
                  <Button 
                    className="bg-chocolate text-creamish hover:bg-chocolate/90"
                    onClick={() => setShowProductModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New Product
                  </Button>
                </div>
                <div className="space-y-4">
                  {products.length === 0 ? (
                    <p className="text-chocolate/70 text-center py-8">No products yet. Add your first product!</p>
                  ) : (
                    products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border border-chocolate/20 rounded-lg">
                        <div>
                          <h3 className="font-semibold text-chocolate">{product.name}</h3>
                          <p className="text-sm text-chocolate/70">{product.category} • {product.currency}{product.price}</p>
                          <p className="text-sm text-chocolate/70">Stock: {product.stock} • {product.requiresShipping ? 'Requires Shipping' : 'Digital'}</p>
                        </div>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="animate-fade-in">
              <Card className="p-8 bg-white border-chocolate/20">
                <h2 className="text-2xl font-bold text-chocolate mb-6">Manage Categories</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder="New category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="border-chocolate/20"
                    />
                    <Button 
                      onClick={handleAddCategory}
                      className="bg-chocolate text-creamish hover:bg-chocolate/90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                    {categories.map((cat, idx) => (
                      <div key={idx} className="p-3 border border-chocolate/20 rounded-lg text-chocolate">
                        {cat}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="animate-fade-in">
              <Card className="p-8 bg-white border-chocolate/20">
                <h2 className="text-2xl font-bold text-chocolate mb-6">Recent Orders</h2>
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-chocolate/70 text-center py-8">No orders yet</p>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="p-4 border border-chocolate/20 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-chocolate">Order #{order.id}</h3>
                            <p className="text-sm text-chocolate/70">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <Select 
                            value={order.status} 
                            onValueChange={(value: any) => handleUpdateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-[150px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="paid">Paid</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-lg font-bold text-chocolate">{order.currency}{order.total}</p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="promo" className="animate-fade-in">
              <Card className="p-8 bg-white border-chocolate/20">
                <h2 className="text-2xl font-bold text-chocolate mb-6">Create Promo Code</h2>
                <div className="max-w-md space-y-4 mb-8">
                  <div>
                    <Label htmlFor="code" className="text-chocolate">Promo Code</Label>
                    <Input
                      id="code"
                      placeholder="SUMMER2025"
                      value={promoCode.code}
                      onChange={(e) => setPromoCode({ ...promoCode, code: e.target.value.toUpperCase() })}
                      className="border-chocolate/20"
                    />
                  </div>
                  <div>
                    <Label htmlFor="discount" className="text-chocolate">Discount Value</Label>
                    <Input
                      id="discount"
                      type="number"
                      placeholder="20"
                      value={promoCode.discount}
                      onChange={(e) => setPromoCode({ ...promoCode, discount: e.target.value })}
                      className="border-chocolate/20"
                    />
                  </div>
                  <div>
                    <Label className="text-chocolate">Type</Label>
                    <div className="flex gap-4 mt-2">
                      <Button
                        type="button"
                        variant={promoCode.type === 'percentage' ? 'default' : 'outline'}
                        onClick={() => setPromoCode({ ...promoCode, type: 'percentage' })}
                        className={promoCode.type === 'percentage' ? 'bg-chocolate text-creamish' : ''}
                      >
                        Percentage
                      </Button>
                      <Button
                        type="button"
                        variant={promoCode.type === 'fixed' ? 'default' : 'outline'}
                        onClick={() => setPromoCode({ ...promoCode, type: 'fixed' })}
                        className={promoCode.type === 'fixed' ? 'bg-chocolate text-creamish' : ''}
                      >
                        Fixed Amount
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label className="text-chocolate">Applicable To</Label>
                    <Select 
                      value={promoCode.applicableTo} 
                      onValueChange={(value: any) => setPromoCode({ ...promoCode, applicableTo: value })}
                    >
                      <SelectTrigger className="border-chocolate/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Items</SelectItem>
                        <SelectItem value="class">Classes Only</SelectItem>
                        <SelectItem value="product">Products Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="bg-chocolate text-creamish hover:bg-chocolate/90 w-full"
                    onClick={handleCreatePromo}
                  >
                    <Tag className="w-4 h-4 mr-2" />
                    Create Promo Code
                  </Button>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-chocolate">Active Promo Codes</h3>
                  {promoCodes.length === 0 ? (
                    <p className="text-chocolate/70 text-center py-4">No promo codes yet</p>
                  ) : (
                    promoCodes.map((promo) => (
                      <div key={promo.code} className="flex items-center justify-between p-3 border border-chocolate/20 rounded-lg">
                        <div>
                          <span className="font-semibold text-chocolate">{promo.code}</span>
                          <span className="text-sm text-chocolate/70 ml-3">
                            {promo.type === 'percentage' ? `${promo.discount}%` : `₦${promo.discount}`} off
                          </span>
                          <span className="text-sm text-chocolate/70 ml-3">• {promo.applicableTo}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeletePromo(promo.code)}
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <AddClassModal 
        open={showClassModal}
        onClose={() => setShowClassModal(false)}
        onSave={handleAddClass}
      />

      <AddProductModal 
        open={showProductModal}
        onClose={() => setShowProductModal(false)}
        onSave={handleAddProduct}
        categories={categories}
      />

      <Footer />
    </div>
  );
};

export default AdminDashboard;
