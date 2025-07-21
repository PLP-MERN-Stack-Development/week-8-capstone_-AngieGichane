import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dietaryOptions } from '@/data/recipes';
import { Star, Clock, Flame } from 'lucide-react';

export const AdvancedFilters = ({ filters, onFiltersChange }) => {
  const handleDietaryRestrictionToggle = (restriction) => {
    const updatedRestrictions = filters.dietaryRestrictions.includes(restriction)
      ? filters.dietaryRestrictions.filter(r => r !== restriction)
      : [...filters.dietaryRestrictions, restriction];
    
    onFiltersChange({ ...filters, dietaryRestrictions: updatedRestrictions });
  };

  const handleCookTimeChange = (value) => {
    onFiltersChange({ ...filters, maxCookTime: value[0] });
  };

  const handleMaxCaloriesChange = (event) => {
    const value = event.target.value ? parseInt(event.target.value) : undefined;
    onFiltersChange({ ...filters, maxCalories: value });
  };

  const handleMinRatingChange = (value) => {
    onFiltersChange({ ...filters, minRating: value[0] });
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">Advanced Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dietary Restrictions */}
        <div>
          <Label className="text-sm font-medium text-foreground mb-3 block">Dietary Restrictions</Label>
          <div className="flex flex-wrap gap-2">
            {dietaryOptions.map((option) => {
              const isSelected = filters.dietaryRestrictions.includes(option);
              return (
                <Badge
                  key={option}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    isSelected 
                      ? 'bg-gradient-primary text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => handleDietaryRestrictionToggle(option)}
                >
                  {option.replace('-', ' ')}
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Cook Time Slider */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium text-foreground">
              Max Cook Time: {filters.maxCookTime} minutes
            </Label>
          </div>
          <Slider
            value={[filters.maxCookTime]}
            onValueChange={handleCookTimeChange}
            max={120}
            min={5}
            step={5}
            className="w-full"
          />
        </div>

        {/* Calories Filter */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="maxCalories" className="text-sm font-medium text-foreground">
              Max Calories
            </Label>
          </div>
          <Input
            id="maxCalories"
            type="number"
            placeholder="e.g., 500"
            value={filters.maxCalories || ''}
            onChange={handleMaxCaloriesChange}
            className="bg-background/50"
          />
        </div>

        {/* Rating Filter */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-muted-foreground" />
            <Label className="text-sm font-medium text-foreground">
              Minimum Rating: {filters.minRating || 0}⭐
            </Label>
          </div>
          <Slider
            value={[filters.minRating || 0]}
            onValueChange={handleMinRatingChange}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
        </div>
      </CardContent>
    </Card>
  );
};