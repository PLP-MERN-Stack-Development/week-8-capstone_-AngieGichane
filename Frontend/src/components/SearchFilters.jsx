import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { categories, difficulties } from '@/data/recipes';

export const SearchFilters = ({ filters, onFiltersChange }) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleSearchChange = (e) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleCategoryChange = (value) => {
    onFiltersChange({ ...filters, category: value });
  };

  const handleDifficultyChange = (value) => {
    onFiltersChange({ ...filters, difficulty: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'All',
      difficulty: 'All',
      maxCookTime: 120,
      dietaryRestrictions: []
    });
  };

  const hasActiveFilters = filters.search || 
                         filters.category !== 'All' || 
                         filters.difficulty !== 'All' || 
                         filters.dietaryRestrictions?.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search recipes..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10 bg-white border-gray-300 focus:bg-white"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          className="bg-white border-gray-300 hover:bg-gray-50"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Clear
          </Button>
        )}
      </div>

      {isFiltersOpen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <Select value={filters.difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map((difficulty) => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};