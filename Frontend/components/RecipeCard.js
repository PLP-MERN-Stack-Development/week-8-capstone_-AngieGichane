import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <Link to={`/recipes/${recipe._id}`}>
        <h3>{recipe.title}</h3>
        <p>Cuisine: {recipe.cuisine}</p>
        <p>Difficulty: {recipe.difficulty}</p>
        <p>Time: {recipe.cookingTime} mins</p>
      </Link>
    </div>
  );
}