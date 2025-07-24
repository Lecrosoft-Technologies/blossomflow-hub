import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Cart = () => {
  const { state, updateQuantity, removeItem, getTotalPrice, formatPrice } = useCart();

  const handleCheckout = () => {
    // Check if user is logged in - replace with actual auth check
    const isLoggedIn = false; // TODO: Replace with actual auth state
    
    if (!isLoggedIn) {
      window.location.href = '/login';
      return;
    }
    
    // TODO: Implement checkout flow with Laravel API
    console.log('Proceed to checkout');
  };

  const symbols = { usd: '$', naira: '₦', gbp: '£' };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-primary rounded-2xl mx-auto mb-6 flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-white" />
            </div>
            
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            
            <Button 
              className="btn-primary"
              onClick={() => window.location.href = '/shop'}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => window.history.back()}
              className="mr-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {state.items.map((item) => (
                <Card key={item.id} className="card-glass p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-muted-foreground text-sm mb-2">{item.category}</p>
                      <p className="text-primary font-bold">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="card-glass p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  {state.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        {symbols[state.currency]}{(item.price[state.currency] * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{symbols[state.currency]}{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{symbols[state.currency]}{(getTotalPrice() * 0.1).toFixed(2)}</span>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-primary">
                    {symbols[state.currency]}{(getTotalPrice() * 1.1).toFixed(2)}
                  </span>
                </div>
                
                <Button 
                  className="w-full btn-primary text-lg py-3"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  * You'll be redirected to login if you're not signed in
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Cart;