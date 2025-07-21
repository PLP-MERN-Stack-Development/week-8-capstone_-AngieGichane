import { useState, useEffect } from 'react';
import RecipeCard from '../../components/RecipeCard';
import axios from 'axios';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    cuisine: '',
    difficulty: ''
  });

  useEffect(() => {
    const fetchRecipes = async () => {
      const params = { search: searchTerm, ...filters };
      const res = await axios.get('/api/recipes', { params });
      setRecipes(res.data);
    };
    fetchRecipes();
  }, [searchTerm, filters]);

  return (
    <div>
      <div className="search-filter">
        <input 
          type="text" 
          placeholder="Search recipes..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={filters.cuisine}
          onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
        >
          <option value="">All Cuisines</option>
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          {/* Add more options */}
        </select>
        <select 
          value={filters.difficulty}
          onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
        >
          <option value="">All Difficulties</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>
      
      <div className="recipe-grid">
        {recipes.map(recipe => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}