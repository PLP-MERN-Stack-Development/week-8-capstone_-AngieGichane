import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

export const NutritionalBreakdown = ({ nutrition, servings }) => {
  const perServing = {
    calories: Math.round(nutrition.calories / servings),
    protein: Math.round(nutrition.protein / servings),
    carbs: Math.round(nutrition.carbs / servings),
    fat: Math.round(nutrition.fat / servings),
    fiber: Math.round(nutrition.fiber / servings),
    sugar: Math.round(nutrition.sugar / servings),
  };

  const macroData = [
    { name: 'Protein', value: perServing.protein, color: '#8B5CF6' },
    { name: 'Carbs', value: perServing.carbs, color: '#EC4899' },
    { name: 'Fat', value: perServing.fat, color: '#F97316' },
  ];

  const nutritionData = [
    { name: 'Calories', value: perServing.calories, unit: 'kcal' },
    { name: 'Protein', value: perServing.protein, unit: 'g' },
    { name: 'Carbs', value: perServing.carbs, unit: 'g' },
    { name: 'Fat', value: perServing.fat, unit: 'g' },
    { name: 'Fiber', value: perServing.fiber, unit: 'g' },
    { name: 'Sugar', value: perServing.sugar, unit: 'g' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Macronutrient Distribution</CardTitle>
          <p className="text-sm text-muted-foreground">Per serving</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={macroData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {macroData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}g`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground">Nutrition Facts</CardTitle>
          <p className="text-sm text-muted-foreground">Per serving</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={nutritionData} layout="horizontal">
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={60} />
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value}${props.payload.unit}`, 
                  props.payload.name
                ]} 
              />
              <Bar dataKey="value" fill="url(#gradient)" radius={[0, 4, 4, 0]} />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};