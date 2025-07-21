import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import RecipeCard from '../RecipeCard';
import { mockRecipe } from '../../../__mocks__/mockData';

const server = setupServer(
  rest.get('/api/recipes/1', (req, res, ctx) => {
    return res(ctx.json(mockRecipe));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('loads and displays recipe', async () => {
  render(<RecipeCard recipeId="1" />);
  
  await waitFor(() => {
    expect(screen.getByText(mockRecipe.title)).toBeInTheDocument();
    expect(screen.getByText(`${mockRecipe.cookTime}m`)).toBeInTheDocument();
  });
});