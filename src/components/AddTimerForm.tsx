import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';
import { parseTimeInput } from '@/utils/formatUtils';

interface AddTimerFormProps {
  onAddTimer: (timer: {
    name: string;
    duration: number;
    category: string;
    halfwayAlert?: boolean;
  }) => void;
  onClose: () => void;
  existingCategories: string[];
}

export const AddTimerForm = ({ onAddTimer, onClose, existingCategories }: AddTimerFormProps) => {
  const [name, setName] = useState('');
  const [durationInput, setDurationInput] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);
  const [useNewCategory, setUseNewCategory] = useState(existingCategories.length === 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('AddTimerForm - Form submission started');
    console.log('AddTimerForm - Form data:', {
      name: name.trim(),
      durationInput: durationInput.trim(),
      category,
      newCategory: newCategory.trim(),
      useNewCategory,
      halfwayAlert
    });
    
    if (!name.trim()) {
      console.log('AddTimerForm - Error: Name is empty');
      return;
    }

    if (!durationInput.trim()) {
      console.log('AddTimerForm - Error: Duration input is empty');
      return;
    }

    const duration = parseTimeInput(durationInput);
    console.log('AddTimerForm - Parsed duration:', duration);
    
    if (duration <= 0) {
      console.log('AddTimerForm - Error: Duration is 0 or negative');
      return;
    }

    const finalCategory = useNewCategory ? newCategory.trim() : category;
    console.log('AddTimerForm - Final category:', finalCategory);
    
    if (!finalCategory) {
      console.log('AddTimerForm - Error: No category selected');
      return;
    }

    const timerData = {
      name: name.trim(),
      duration,
      category: finalCategory,
      halfwayAlert,
    };

    console.log('AddTimerForm - Calling onAddTimer with:', timerData);
    onAddTimer(timerData);

    // Reset form
    setName('');
    setDurationInput('');
    setCategory('');
    setNewCategory('');
    setHalfwayAlert(false);
    setUseNewCategory(existingCategories.length === 0);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <Card className="w-full max-w-md p-2 sm:p-6">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold">Add New Timer</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Timer Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Workout Timer"
              required
            />
          </div>

          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              value={durationInput}
              onChange={(e) => setDurationInput(e.target.value)}
              placeholder="e.g., 5:00 or 300 (seconds)"
              required
            />
            <p className="text-sm text-gray-600 mt-1">
              Format: MM:SS, HH:MM:SS, or seconds
            </p>
          </div>

          <div>
            <Label>Category</Label>
            <div className="space-y-2">
              {existingCategories.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="use-existing"
                    checked={!useNewCategory}
                    onCheckedChange={(checked) => setUseNewCategory(!checked)}
                  />
                  <Label htmlFor="use-existing">Use existing category</Label>
                </div>
              )}
              
              {!useNewCategory && existingCategories.length > 0 ? (
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {existingCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div>
                  <Label htmlFor="new-category">New Category</Label>
                  <Input
                    id="new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="halfway-alert"
              checked={halfwayAlert}
              onCheckedChange={(checked) => setHalfwayAlert(checked as boolean)}
            />
            <Label htmlFor="halfway-alert">Enable halfway alert</Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button type="submit" className="flex-1 w-full sm:w-auto">
              Add Timer
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 w-full sm:w-auto">
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
