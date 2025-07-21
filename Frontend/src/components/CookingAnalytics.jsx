import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Clock, ChefHat, Star } from 'lucide-react';

export const CookingAnalytics = ({ recipes, cookingSessions }) => {
  const stats = {
    totalCookingSessions: cookingSessions.length,
    completedSessions: cookingSessions.filter(s => s.completed).length,
    avgCookingTime: Math.round(
      cookingSessions.reduce((sum, s) => sum + s.duration, 0) / cookingSessions.length || 0
    ),
    favoriteRecipes: getMostCookedRecipes(cookingSessions, recipes)
  };

  const recipeFrequency = cookingSessions.reduce((acc, session) => {
    acc[session.recipeId] = (acc[session.recipeId] || 0) + 1;
    return acc;
  }, {});

  const mostCookedData = Object.entries(recipeFrequency)
    .map(([recipeId, count]) => {
      const recipe = recipes.find(r => r.id === recipeId);
      return {
        name: recipe?.title || 'Unknown Recipe',
        count,
        category: recipe?.category || 'Other'
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const categoryData = recipes.reduce((acc, recipe) => {
    acc[recipe.category] = (acc[recipe.category] || 0) + 1;
    return acc;
  }, {});

  const categoryChartData = Object.entries(categoryData).map(([category, count]) => ({
    name: category,
    value: count,
    color: getCategoryColor(category)
  }));

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyCookingData = last7Days.map(date => {
    const daySessions = cookingSessions.filter(s => s.date.startsWith(date));
    return {
      date: new Date(date).toLocaleDateString('en', { weekday: 'short' }),
      sessions: daySessions.length,
      avgDuration: daySessions.length > 0 
        ? Math.round(daySessions.reduce((sum, s) => sum + s.duration, 0) / daySessions.length)
        : 0
    };
  });

  function getMostCookedRecipes(sessions, recipes) {
    const frequency = sessions.reduce((acc, session) => {
      acc[session.recipeId] = (acc[session.recipeId] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([recipeId]) => recipes.find(r => r.id === recipeId))
      .filter(Boolean);
  }

  function getCategoryColor(category) {
    const colors = {
      'Pasta': '#8B5CF6',
      'Dessert': '#EC4899',
      'Breakfast': '#F97316',
      'Asian': '#10B981',
      'Salad': '#06B6D4',
      'Other': '#6B7280'
    };
    return colors[category] || colors.Other;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalCookingSessions}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.completedSessions}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgCookingTime}m</p>
                <p className="text-sm text-muted-foreground">Avg Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.favoriteRecipes.length}</p>
                <p className="text-sm text-muted-foreground">Favorites</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Most Cooked Recipes</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={mostCookedData}>
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="url(#gradient)" radius={[4, 4, 0, 0]} />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Recipe Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Cooking Activity (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyCookingData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle>Your Most Cooked Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.favoriteRecipes.map((recipe, index) => (
              <div key={recipe.id} className="flex items-center gap-3 p-3 bg-background/50 rounded-lg">
                <Badge className="bg-gradient-primary text-primary-foreground">
                  #{index + 1}
                </Badge>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-12 h-12 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{recipe.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Cooked {recipeFrequency[recipe.id]} times
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};