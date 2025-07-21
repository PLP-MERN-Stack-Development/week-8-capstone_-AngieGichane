import pastaDish from '@/assets/pasta-dish.jpg';
import chocolateCake from '@/assets/chocolate-cake.jpg';
import avocadoToast from '@/assets/avocado-toast.jpg';
import stirFry from '@/assets/stir-fry.jpg';
import freshSalad from '@/assets/fresh-salad.jpg';

export const recipes = [
  {
    id: '1',
    title: 'Creamy Basil Pasta',
    description: 'A delicious pasta dish with fresh basil, cherry tomatoes, and creamy sauce',
    image: pastaDish,
    cookTime: 25,
    servings: 4,
    difficulty: 'Easy',
    category: 'Pasta',
    ingredients: [
      '400g pasta',
      '200ml heavy cream',
      '2 cloves garlic',
      '200g cherry tomatoes',
      'Fresh basil leaves',
      'Parmesan cheese',
      'Salt and pepper'
    ],
    instructions: [
      'Cook pasta according to package instructions',
      'Heat cream in a large pan',
      'Add garlic and cherry tomatoes',
      'Toss with cooked pasta',
      'Add fresh basil and parmesan',
      'Season with salt and pepper'
    ],
    tags: ['vegetarian', 'creamy', 'italian'],
    nutrition: {
      calories: 520,
      protein: 18,
      carbs: 65,
      fat: 22,
      fiber: 3,
      sugar: 8
    },
    dietaryRestrictions: ['vegetarian'],
    rating: 4.5,
    author: 'Chef Marco',
    dateCreated: '2024-01-15'
  },
  // ... (rest of the recipes array remains the same)
];

export const categories = ['All', 'Pasta', 'Dessert', 'Breakfast', 'Asian', 'Salad'];
export const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
export const dietaryOptions = ['vegetarian', 'vegan', 'gluten-free', 'gluten-free-option', 'keto-friendly', 'dairy-free', 'nut-free'];