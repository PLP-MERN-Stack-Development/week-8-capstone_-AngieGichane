import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/add-recipe">Add Recipe</Link>
    </nav>
  );
}