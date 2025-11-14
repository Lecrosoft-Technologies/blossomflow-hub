import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';
import { Switch } from '@/components/ui/switch';

interface Product {
  id: string;
  name: string;
  description: string;
  price: { usd: number; naira: number; gbp: number };
  image: string;
  category: string;
  inStock: boolean;
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  categories: string[];
}

export const EditProductModal = ({ product, isOpen, onClose, onSave, categories }: EditProductModalProps) => {
  const [formData, setFormData] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: { usd: 0, naira: 0, gbp: 0 },
    image: '',
    category: '',
    inStock: true,
  });

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price-naira">Price (₦)</Label>
              <Input
                id="price-naira"
                type="number"
                value={formData.price.naira}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, naira: parseFloat(e.target.value) || 0 }
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price-usd">Price ($)</Label>
              <Input
                id="price-usd"
                type="number"
                step="0.01"
                value={formData.price.usd}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, usd: parseFloat(e.target.value) || 0 }
                })}
                required
              />
            </div>
            <div>
              <Label htmlFor="price-gbp">Price (£)</Label>
              <Input
                id="price-gbp"
                type="number"
                step="0.01"
                value={formData.price.gbp}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, gbp: parseFloat(e.target.value) || 0 }
                })}
                required
              />
            </div>
          </div>

          <div>
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Product Image</Label>
            <ImageUpload
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
