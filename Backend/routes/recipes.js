const express = require('express');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Get all recipes with search/filter
router.get('/', async (req, res) => {
  try {
    const { search, cuisine, difficulty } = req.query;
    const query = {};
    
    if (search) query.title = { $regex: search, $options: 'i' };
    if (cuisine) query.cuisine = cuisine;
    if (difficulty) query.difficulty = difficulty;
    
    const recipes = await Recipe.find(query).populate('createdBy', 'username');
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Other CRUD routes (POST, GET /:id, PATCH, DELETE) would go here

module.exports = router;