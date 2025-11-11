import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Class } from '@/services/api';

interface AddClassModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (classData: Omit<Class, 'id'>) => void;
}

const AddClassModal = ({ open, onClose, onSave }: AddClassModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructor: 'Dr. Blossom Maduafokwa',
    type: 'virtual' as 'virtual' | 'in-person',
    date: '',
    time: '',
    duration: 60,
    price: 0,
    currency: '₦',
    capacity: 50,
    spotsAvailable: 50,
    image: '',
    zoomLink: '',
  });

  const handleSubmit = () => {
    onSave(formData);
    setFormData({
      name: '',
      description: '',
      instructor: 'Dr. Blossom Maduafokwa',
      type: 'virtual',
      date: '',
      time: '',
      duration: 60,
      price: 0,
      currency: '₦',
      capacity: 50,
      spotsAvailable: 50,
      image: '',
      zoomLink: '',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Class</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Class Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="High-Energy Zumba®"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Dance your way to fitness..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (min)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value), spotsAvailable: parseInt(e.target.value) })}
              />
            </div>
          </div>
          {formData.type === 'virtual' && (
            <div className="grid gap-2">
              <Label htmlFor="zoomLink">Zoom Link (optional)</Label>
              <Input
                id="zoomLink"
                value={formData.zoomLink}
                onChange={(e) => setFormData({ ...formData, zoomLink: e.target.value })}
                placeholder="https://zoom.us/j/..."
              />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-chocolate text-creamish hover:bg-chocolate/90">
            Add Class
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddClassModal;
