import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, ChefHat, ArrowLeft } from 'lucide-react';
import { NutritionalBreakdown } from '@/components/NutritionalBreakdown';
import { RecipeReviews } from '@/components/RecipeReviews';

export const RecipeDetail = ({ recipe, onBack }) => {
  if (!recipe) return null;

  return (
    <div className="animate-fade-in max-w-6xl mx-auto px-4 py-8">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="mb-6 hover:bg-gray-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Recipes
      </Button>
      
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="aspect-video overflow-hidden rounded-lg shadow-md">
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900">{recipe.title}</CardTitle>
              <p className="text-gray-600">{recipe.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="font-medium">{recipe.cookTime} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span className="font-medium">{recipe.servings} servings</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-primary" />
                  <Badge 
                    variant="secondary"
                    className={
                      recipe.difficulty === 'Easy' 
                        ? 'bg-green-100 text-green-800' 
                        : recipe.difficulty === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {recipe.difficulty}
                  </Badge>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                  {recipe.category}
                </Badge>
                {recipe.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <NutritionalBreakdown nutrition={recipe.nutrition} servings={recipe.servings} />
        </div>
        
        <div className="space-y-6">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Ingredients</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                    <span className="text-gray-800">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </div>
                    <span className="text-gray-800 leading-relaxed pt-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          <RecipeReviews 
            reviews={recipe.reviews || []} 
            averageRating={recipe.rating || 0} 
            totalReviews={recipe.reviews?.length || 0}
            onAddReview={(newReview) => {
              // Handle review submission
              console.log('New review:', newReview);
            }}
          />
        </div>
      </div>
    </div>
  );
};