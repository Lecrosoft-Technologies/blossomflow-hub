import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from './ImageUpload';

interface Class {
  id: string;
  name: string;
  description: string;
  type: string;
  date: string;
  time: string;
  duration: string;
  spotsAvailable: number;
  price: { usd: number; naira: number; gbp: number };
  instructor: string;
  zoomLink?: string;
  image: string;
  category: string;
}

interface EditClassModalProps {
  classData: Class | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: Class) => void;
  categories: string[];
}

export const EditClassModal = ({ classData, isOpen, onClose, onSave, categories }: EditClassModalProps) => {
  const [formData, setFormData] = useState<Class>({
    id: '',
    name: '',
    description: '',
    type: 'in-person',
    date: '',
    time: '',
    duration: '',
    spotsAvailable: 20,
    price: { usd: 0, naira: 0, gbp: 0 },
    instructor: '',
    zoomLink: '',
    image: '',
    category: '',
  });

  useEffect(() => {
    if (classData) {
      setFormData(classData);
    }
  }, [classData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Class Name</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="60 mins"
                required
              />
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="spots">Spots Available</Label>
              <Input
                id="spots"
                type="number"
                value={formData.spotsAvailable}
                onChange={(e) => setFormData({ ...formData, spotsAvailable: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>

          {formData.type !== 'in-person' && (
            <div>
              <Label htmlFor="zoomLink">Zoom® Link</Label>
              <Input
                id="zoomLink"
                value={formData.zoomLink || ''}
                onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                placeholder="https://zoom.us/j/..."
              />
            </div>
          )}

          <div>
            <Label>Class Image</Label>
            <ImageUpload
              value={formData.image}
              onChange={(value) => setFormData({ ...formData, image: value })}
            />
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
