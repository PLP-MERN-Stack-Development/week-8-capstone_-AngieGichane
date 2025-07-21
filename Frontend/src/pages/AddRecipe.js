import { useState } from 'react';
import axios from 'axios';

export default function AddRecipe() {
  const [recipe, setRecipe] = useState({
    title: '',
    ingredients: [''],
    instructions: '',
    cookingTime: 0,
    difficulty: 'Easy',
    cuisine: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/recipes', recipe);
      alert('Recipe added!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={recipe.title}
          onChange={(e) => setRecipe({...recipe, title: e.target.value})}
          required
        />
        {/* Add other form fields similarly */}
        <button type="submit">Save Recipe</button>
      </form>
    </div>
  );
}