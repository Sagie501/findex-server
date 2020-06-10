import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true }
});

export const categoriesModel = mongoose.model('category', categorySchema);

export function addCategory(newCategory): Promise<any> {
  return newCategory.save();
}

export function getCategoryByName(name): Promise<any> {
  return categoriesModel.findOne({ name }).exec();
}
