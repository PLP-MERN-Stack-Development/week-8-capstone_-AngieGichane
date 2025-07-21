import { render, screen, fireEvent } from '@testing-library/react';
import { RecipeCard } from '@/components/RecipeCard';
import { mockRecipe } from '@/__mocks__/mockData';

describe('RecipeCard', () => {
  const mockOnClick = jest.fn();
  
  it('renders recipe title', () => {
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);
    expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole('article'));
    expect(mockOnClick).toHaveBeenCalledWith(mockRecipe);
  });

  it('displays difficulty badge', () => {
    render(<RecipeCard recipe={mockRecipe} onClick={mockOnClick} />);
    expect(screen.getByText(mockRecipe.difficulty)).toBeInTheDocument();
  });
});