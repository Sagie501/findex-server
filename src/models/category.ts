import * as mongoose from "mongoose";
import { Schema } from "mongoose";

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

export const categoriesModel = mongoose.model("category", categorySchema);

export function addCategory(newCategory): Promise<any> {
  return newCategory.save();
}

export function getAllCategories(): Promise<any> {
  return categoriesModel.find().exec();
}

export function deleteCategory(name): Promise<any> {
  return categoriesModel.deleteOne({ name }).exec();
}

export function getCategoryByName(name): Promise<any> {
  return categoriesModel.findOne({ name }).exec();
}

export function getCategoriesByName(name): Promise<any> {
  return categoriesModel.find({ name }).exec();
}
