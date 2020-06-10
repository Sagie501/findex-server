import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true }
});

export const categoryModel = mongoose.model('category', categorySchema);

export function getCategoryByName(name): Promise<any> {
  return categoryModel.findOne({ name }).exec();
}
