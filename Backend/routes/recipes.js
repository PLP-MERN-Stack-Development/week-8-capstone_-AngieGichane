const express = require('express');
const {
  getRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe
} = require('../controllers/recipes');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getRecipes);
router.get('/:id', getRecipeById);

// Protected routes (require authentication)
router.post('/', authMiddleware, createRecipe);
router.put('/:id', authMiddleware, updateRecipe);
router.delete('/:id', authMiddleware, deleteRecipe);

module.exports = router;