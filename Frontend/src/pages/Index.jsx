import React, { useState, useMemo } from 'react';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetail } from '@/components/RecipeDetail';
import { SearchFilters } from '@/components/SearchFilters';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { AISearch } from '@/components/AISearch';
import { MealPlanner } from '@/components/MealPlanner';
import { CookingAnalytics } from '@/components/CookingAnalytics';
import { LiveCookingMode } from '@/components/LiveCookingMode';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChefHat, Sparkles, Calendar, BarChart3, Play } from 'lucide-react';
import heroCooking from '@/assets/hero-cooking.jpg';
import { recipes } from '@/data/recipes';

const Index = () => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [cookingMode, setCookingMode] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    difficulty: 'All',
    maxCookTime: 120,
    dietaryRestrictions: []
  });
  
  const [cookingSessions] = useState([
    { recipeId: '1', date: '2024-01-20', duration: 25, completed: true },
    { recipeId: '2', date: '2024-01-19', duration: 60, completed: true },
    { recipeId: '1', date: '2024-01-18', duration: 23, completed: true },
  ]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(filters.search.toLowerCase()) ||
                           recipe.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCategory = filters.category === 'All' || recipe.category === filters.category;
      const matchesDifficulty = filters.difficulty === 'All' || recipe.difficulty === filters.difficulty;
      const matchesCookTime = recipe.cookTime <= filters.maxCookTime;
      const matchesDietary = filters.dietaryRestrictions.length === 0 || 
                           filters.dietaryRestrictions.every(restriction => 
                             recipe.dietaryRestrictions.includes(restriction));
      const matchesCalories = !filters.maxCalories || recipe.nutrition.calories <= filters.maxCalories;
      const matchesRating = !filters.minRating || (recipe.rating || 0) >= filters.minRating;
      
      return matchesSearch && matchesCategory && matchesDifficulty && matchesCookTime && 
             matchesDietary && matchesCalories && matchesRating;
    });
  }, [filters]);

  if (cookingMode) {
    return <LiveCookingMode recipe={cookingMode} onExit={() => setCookingMode(null)} />;
  }

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <RecipeDetail 
            recipe={selectedRecipe} 
            onBack={() => setSelectedRecipe(null)} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCooking})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-80" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ChefHat className="w-12 h-12" />
            <h1 className="text-5xl md:text-7xl font-bold">Recipe Realm</h1>
            <Sparkles className="w-12 h-12" />
          </div>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Discover delicious recipes from around the world
          </p>
          <Button 
            variant="hero" 
            size="lg"
            className="text-lg px-8 py-4"
            onClick={() => {
              document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Explore Recipes
          </Button>
        </div>
      </div>

      <div id="recipes" className="container mx-auto px-4 py-12">
        <Tabs defaultValue="recipes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="recipes">🍳 Recipes</TabsTrigger>
            <TabsTrigger value="planner">📅 Meal Plan</TabsTrigger>
            <TabsTrigger value="analytics">📊 Analytics</TabsTrigger>
            <TabsTrigger value="ai-search">✨ AI Search</TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">Find Your Perfect Recipe</h2>
              <SearchFilters filters={filters} onFiltersChange={setFilters} />
              <AdvancedFilters filters={filters} onFiltersChange={setFilters} />
            </div>

            <div className="mb-6">
              <p className="text-muted-foreground">
                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''} found
              </p>
            </div>

            {filteredRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id}
                    recipe={recipe}
                    onClick={setSelectedRecipe}
                    onStartCooking={setCookingMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-primary rounded-full flex items-center justify-center">
                  <ChefHat className="w-12 h-12 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No recipes found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search terms or filters</p>
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ search: '', category: 'All', difficulty: 'All', maxCookTime: 120, dietaryRestrictions: [] })}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="planner">
            <MealPlanner recipes={recipes} onSelectRecipe={setSelectedRecipe} />
          </TabsContent>

          <TabsContent value="analytics">
            <CookingAnalytics recipes={recipes} cookingSessions={cookingSessions} />
          </TabsContent>

          <TabsContent value="ai-search">
            <AISearch onSearchResults={(query) => setFilters(prev => ({ ...prev, search: query }))} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;