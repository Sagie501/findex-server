import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const itemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  kind: { type: String, enum: ["Request", "ForDelivery"], required: true },
  category: { type: Schema.Types.ObjectId, ref: "category", required: true },
  city: { type: String, require: true },
  username: { type: Schema.Types.ObjectId, ref: "user", required: true }
});

export const itemsModel = mongoose.model('item', itemSchema);

export function getAllItems(): Promise<any> {
  return itemsModel.find().populate('category').populate('username').exec();
}

export function getItemsByUserId(userId): Promise<any> {
  return itemsModel.find({ username: userId }).populate("category").populate("username").exec();
}

// TODO: Check this function implementation
export function getItemsByCategory(category, callback) {
  let query = {category: category};

  itemsModel.find(query).count().exec(function (err, count) {
    let random = Math.floor(Math.random() * count);
    return itemsModel.find(query).find().limit(-1).skip(random).exec(callback);
  })
}

export function getItemsAmountByKind(): Promise<any> {
  return itemsModel.aggregate([
    {
      $group: {
        _id: '$kind',
        count: {$sum: 1}
      }
    }
  ]).exec();
}

export function getItemsAmountInEachCategory(): Promise<any> {
  return itemsModel.aggregate([
    {
      $group: {
        _id: '$category',
        count: {$sum: 1}
      }
    }
  ]).exec();
}

export function createNewItem(item): Promise<any> {
  return item.save();
}
