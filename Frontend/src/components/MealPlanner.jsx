import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const MealPlanner = ({ recipes, onSelectRecipe }) => {
  const [mealPlan, setMealPlan] = useState({
    id: 'current-plan',
    userId: 'current-user',
    week: getCurrentWeek(),
    meals: {}
  });
  
  const [groceryList, setGroceryList] = useState({
    id: 'current-list',
    userId: 'current-user',
    items: [],
    dateCreated: new Date().toISOString(),
    completed: false
  });

  const { toast } = useToast();

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTimes = ['breakfast', 'lunch', 'dinner'];

  function getCurrentWeek() {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 1));
    return startOfWeek.toISOString().split('T')[0];
  }

  const addRecipeToMeal = (day, mealTime, recipeId) => {
    setMealPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [day]: {
          ...prev.meals[day],
          [mealTime]: recipeId
        }
      }
    }));

    toast({
      title: "Recipe added to meal plan",
      description: `Added to ${day} ${mealTime}`,
    });
  };

  const removeRecipeFromMeal = (day, mealTime) => {
    setMealPlan(prev => ({
      ...prev,
      meals: {
        ...prev.meals,
        [day]: {
          ...prev.meals[day],
          [mealTime]: undefined
        }
      }
    }));
  };

  const generateGroceryList = () => {
    const ingredients = new Map();
    
    Object.entries(mealPlan.meals).forEach(([day, dayMeals]) => {
      Object.values(dayMeals).forEach(recipeId => {
        if (recipeId) {
          const recipe = recipes.find(r => r.id === recipeId);
          if (recipe) {
            recipe.ingredients.forEach(ingredient => {
              const [quantity, ...nameParts] = ingredient.split(' ');
              const name = nameParts.join(' ');
              const category = categorizeIngredient(name);
              
              if (ingredients.has(name)) {
                const existing = ingredients.get(name);
                ingredients.set(name, {
                  quantity: `${existing.quantity} + ${quantity}`,
                  category
                });
              } else {
                ingredients.set(name, { quantity, category });
              }
            });
          }
        }
      });
    });

    const groceryItems = Array.from(ingredients.entries()).map(([name, { quantity, category }], index) => ({
      id: `item-${index}`,
      name,
      quantity,
      category,
      checked: false
    }));

    setGroceryList(prev => ({
      ...prev,
      items: groceryItems,
      dateCreated: new Date().toISOString()
    }));

    toast({
      title: "Grocery list generated!",
      description: `Added ${groceryItems.length} items to your shopping list`,
    });
  };

  const categorizeIngredient = (ingredient) => {
    const lower = ingredient.toLowerCase();
    if (lower.includes('meat') || lower.includes('chicken') || lower.includes('beef') || lower.includes('fish')) return 'Meat & Seafood';
    if (lower.includes('milk') || lower.includes('cheese') || lower.includes('butter') || lower.includes('cream')) return 'Dairy';
    if (lower.includes('apple') || lower.includes('banana') || lower.includes('berry') || lower.includes('fruit')) return 'Fruits';
    if (lower.includes('lettuce') || lower.includes('tomato') || lower.includes('onion') || lower.includes('vegetable')) return 'Vegetables';
    if (lower.includes('bread') || lower.includes('pasta') || lower.includes('rice') || lower.includes('flour')) return 'Grains & Bread';
    return 'Other';
  };

  const toggleGroceryItem = (itemId) => {
    setGroceryList(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    }));
  };

  const getRecipeById = (id) => recipes.find(r => r.id === id);

  const groupedGroceryItems = groceryList.items.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push(item);
    return groups;
  }, {});

  return (
    <Tabs defaultValue="planner" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="planner" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Meal Planner
        </TabsTrigger>
        <TabsTrigger value="grocery" className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Grocery List
        </TabsTrigger>
      </TabsList>

      <TabsContent value="planner" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Weekly Meal Plan</h2>
          <Button onClick={generateGroceryList} className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Generate Grocery List
          </Button>
        </div>

        <div className="grid gap-4">
          {daysOfWeek.map(day => (
            <Card key={day} className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {mealTimes.map(mealTime => {
                    const recipeId = mealPlan.meals[day]?.[mealTime];
                    const recipe = recipeId ? getRecipeById(recipeId) : null;

                    return (
                      <div key={mealTime} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground capitalize">{mealTime}</h4>
                          {recipe && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeRecipeFromMeal(day, mealTime)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        
                        {recipe ? (
                          <Card 
                            className="bg-background/50 border-border/50 cursor-pointer hover:bg-accent transition-colors"
                            onClick={() => onSelectRecipe(recipe)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2">
                                <img
                                  src={recipe.image}
                                  alt={recipe.title}
                                  className="w-12 h-12 rounded object-cover"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm text-foreground truncate">
                                    {recipe.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {recipe.cookTime} min • {recipe.servings} servings
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ) : (
                          <div className="relative">
                            <select
                              className="w-full p-2 bg-background/50 border border-border/50 rounded text-sm"
                              onChange={(e) => {
                                if (e.target.value) {
                                  addRecipeToMeal(day, mealTime, e.target.value);
                                  e.target.value = '';
                                }
                              }}
                              defaultValue=""
                            >
                              <option value="">Select a recipe...</option>
                              {recipes.map(recipe => (
                                <option key={recipe.id} value={recipe.id}>
                                  {recipe.title}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="grocery" className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Grocery List</h2>
          <Badge variant="outline">
            {groceryList.items.filter(item => item.checked).length} / {groceryList.items.length} items
          </Badge>
        </div>

        {Object.keys(groupedGroceryItems).length === 0 ? (
          <Card className="bg-background/50 border-border/50">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground mb-4">
                No grocery list generated yet. Add recipes to your meal plan and generate a shopping list.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedGroceryItems).map(([category, items]) => (
              <Card key={category} className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">{category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => toggleGroceryItem(item.id)}
                        />
                        <label
                          htmlFor={item.id}
                          className={`flex-1 text-sm ${
                            item.checked ? 'line-through text-muted-foreground' : 'text-foreground'
                          }`}
                        >
                          {item.quantity} {item.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};