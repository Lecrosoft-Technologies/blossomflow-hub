import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';

const UserProfile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: user?.city || '',
    country: user?.country || '',
    postalCode: user?.postalCode || '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        postalCode: user.postalCode || '',
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="min-h-screen bg-creamish">
      <Header />
      
      <section className="section-padding pt-32">
        <div className="container-custom mx-auto max-w-3xl">
          <div className="mb-12">
            <h1 className="text-5xl font-heading font-bold mb-4 text-chocolate">
              My Profile
            </h1>
            <p className="text-xl text-chocolate/80">
              Manage your personal information and shipping details
            </p>
          </div>

          <Card className="p-8 bg-white border-chocolate/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="flex items-center gap-2 text-chocolate">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-chocolate/20"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-chocolate">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="border-chocolate/20"
                    disabled
                  />
                  <p className="text-sm text-chocolate/60">Email cannot be changed</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone" className="flex items-center gap-2 text-chocolate">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+234..."
                    className="border-chocolate/20"
                  />
                </div>

                <div className="border-t border-chocolate/20 pt-6">
                  <h3 className="text-lg font-semibold text-chocolate mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Shipping Address
                  </h3>
                  
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address" className="text-chocolate">Street Address</Label>
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        placeholder="123 Main Street"
                        className="border-chocolate/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city" className="text-chocolate">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          placeholder="Lagos"
                          className="border-chocolate/20"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="postalCode" className="text-chocolate">Postal Code</Label>
                        <Input
                          id="postalCode"
                          value={formData.postalCode}
                          onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                          placeholder="100001"
                          className="border-chocolate/20"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="country" className="text-chocolate">Country</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="Nigeria"
                        className="border-chocolate/20"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full bg-chocolate text-creamish hover:bg-chocolate/90">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UserProfile;
