import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChefHat } from 'lucide-react';
import api from '@/api';

export const RecipeCard = ({ recipe, onClick, onStartCooking }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // If receiving recipeId instead of full recipe
  const [localRecipe, setLocalRecipe] = useState(recipe || null);

  useEffect(() => {
    if (!recipe && recipe?.id) {
      const fetchRecipe = async () => {
        setIsLoading(true);
        try {
          const response = await api.get(`/recipes/${recipe.id}`);
          setLocalRecipe(response.data);
        } catch (err) {
          setError('Failed to load recipe');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchRecipe();
    }
  }, [recipe]);

  if (isLoading) return (
    <Card className="animate-pulse bg-gray-100 h-64 rounded-lg"></Card>
  );

  if (error) return (
    <Card className="bg-red-50 border-red-200 p-4">
      <p className="text-red-500">{error}</p>
    </Card>
  );

  const displayRecipe = localRecipe || recipe;
  if (!displayRecipe) return null;

  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
      onClick={() => onClick(displayRecipe)}
    >
      <div className="aspect-video overflow-hidden">
        <img 
          src={displayRecipe.image} 
          alt={displayRecipe.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardContent className="p-4 space-y-2">
        <h3 className="font-semibold text-lg truncate">{displayRecipe.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{displayRecipe.description}</p>
        
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1 text-sm">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{displayRecipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span>{displayRecipe.servings} servings</span>
          </div>
          <Badge 
            variant="outline"
            className={`${
              displayRecipe.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
              displayRecipe.difficulty === 'Medium' ? 'bg-yellow-50 text-yellow-600' :
              'bg-red-50 text-red-600'
            }`}
          >
            <ChefHat className="w-3 h-3 mr-1" />
            {displayRecipe.difficulty}
          </Badge>
        </div>

        {onStartCooking && (
          <Button 
            variant="outline"
            size="sm"
            className="mt-3 w-full"
            onClick={(e) => {
              e.stopPropagation();
              onStartCooking(displayRecipe);
            }}
          >
            Start Cooking
          </Button>
        )}
      </CardContent>
    </Card>
  );
};