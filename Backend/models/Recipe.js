const mongoose = require('mongoose');

const NutritionalInfoSchema = new mongoose.Schema({
  calories: Number,
  protein: Number,
  carbs: Number,
  fat: Number,
  fiber: Number,
  sugar: Number
});

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  rating: Number,
  comment: String,
  date: { type: Date, default: Date.now }
});

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  cookTime: { type: Number, required: true },
  servings: { type: Number, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  category: { type: String, required: true },
  ingredients: { type: [String], required: true },
  instructions: { type: [String], required: true },
  tags: { type: [String], default: [] },
  nutrition: { type: NutritionalInfoSchema, required: true },
  dietaryRestrictions: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  reviews: { type: [ReviewSchema], default: [] },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  dateCreated: { type: Date, default: Date.now }
}, { timestamps: true });

RecipeSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
});

module.exports = mongoose.model('Recipe', RecipeSchema);