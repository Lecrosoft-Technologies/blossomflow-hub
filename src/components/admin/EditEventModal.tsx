import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from './ImageUpload';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: { usd: number; naira: number; gbp: number };
  image: string;
  spotsAvailable: number;
}

interface EditEventModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

export const EditEventModal = ({ event, isOpen, onClose, onSave }: EditEventModalProps) => {
  const [formData, setFormData] = useState<Event>({
    id: '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: { usd: 0, naira: 0, gbp: 0 },
    image: '',
    spotsAvailable: 50,
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Event Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
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

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
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
            <Label>Event Image</Label>
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
