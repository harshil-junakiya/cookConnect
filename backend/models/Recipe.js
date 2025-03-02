import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  ratings: [{ user: String, rating: Number }],
  comments: [{ user: String, text: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Recipe", RecipeSchema);
