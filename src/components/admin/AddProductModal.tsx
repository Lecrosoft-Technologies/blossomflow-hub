import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/services/api';
import { MultiImageUpload } from './MultiImageUpload';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id'>) => void;
  categories: string[];
}

const AddProductModal = ({ open, onClose, onSave, categories }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: { usd: 0, naira: 0, gbp: 0 },
    image: '',
    images: [] as string[],
    category: '',
    inStock: true,
  });

  const handleImagesChange = (images: string[]) => {
    setFormData({ 
      ...formData, 
      images,
      image: images[0] || '' // Set first image as primary
    });
  };

  const handleSubmit = () => {
    onSave({
      ...formData,
      image: formData.images[0] || formData.image,
    });
    setFormData({
      name: '',
      description: '',
      price: { usd: 0, naira: 0, gbp: 0 },
      image: '',
      images: [],
      category: '',
      inStock: true,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#8026d9]">Add New Product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Yoga Mat Pro"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="productDesc">Description</Label>
            <Textarea
              id="productDesc"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="High-quality yoga mat..."
            />
          </div>
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
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
          
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price-naira">Price (₦)</Label>
              <Input
                id="price-naira"
                type="number"
                value={formData.price.naira}
                onChange={(e) => setFormData({
                  ...formData,
                  price: { ...formData.price, naira: parseFloat(e.target.value) || 0 }
                })}
              />
            </div>
            <div className="grid gap-2">
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
              />
            </div>
            <div className="grid gap-2">
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
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label>Product Images (Multiple)</Label>
            <MultiImageUpload
              values={formData.images}
              onChange={handleImagesChange}
              maxImages={5}
            />
            <p className="text-xs text-gray-500">Upload up to 5 images. First image will be the primary image.</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={formData.inStock}
              onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
            />
            <Label htmlFor="inStock">In Stock</Label>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-[#8026d9] text-white hover:bg-[#8026d9]/90">
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;