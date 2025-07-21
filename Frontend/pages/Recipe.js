import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Recipe() {
  const [recipe, setRecipe] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await axios.get(`/api/recipes/${id}`);
      setRecipe(res.data);
    };
    fetchRecipe();
  }, [id]);

  if (!recipe) return <div>Loading...</div>;

  return (
    <div className="recipe-detail">
      <h1>{recipe.title}</h1>
      <h3>Cuisine: {recipe.cuisine}</h3>
      <h3>Difficulty: {recipe.difficulty}</h3>
      <h3>Cooking Time: {recipe.cookingTime} minutes</h3>
      
      <h2>Ingredients</h2>
      <ul>
        {recipe.ingredients.map((ing, i) => (
          <li key={i}>{ing}</li>
        ))}
      </ul>
      
      <h2>Instructions</h2>
      <p>{recipe.instructions}</p>
    </div>
  );
}