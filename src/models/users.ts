import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  items: [{
    type: Schema.Types.ObjectId, ref: "item",
    default: () => { return []; },
    required: false
  }]
});

export const usersModel = mongoose.model('user', userSchema);

export function getAllUsers(): Promise<any> {
  return usersModel.find().populate({
    path: 'items',
    populate: {
      path: 'category',
      model: 'category'
    }
  }).exec();
}

export function getUserByUsernameAndPassword(username: string, password: string): Promise<any> {
  let query = { username: username, password: password };
  return usersModel.findOne(query).populate("items").exec();
}

export function getUserById(id): Promise<any> {
  let query = { _id: id };
  return usersModel.findOne(query).populate("items").exec();
}

export function getUserByUsername(username): Promise<any> {
  let query = { username: username };
  return usersModel.findOne(query).populate("items").exec();
}

export function editUser(editedUser): Promise<any> {
  return usersModel.findOneAndUpdate({ username: editedUser.username }, editedUser, {upsert: true, new: true, runValidators: true}).exec();
}

export function addItemToUser(item, username, callback) {
  usersModel.findOne({ username }, (err: any, user: any) => {
    if (err || !user || !user.items) {
      console.error(err);
      callback(err);
    } else {
      user.items.push(item);
      user.save(callback);
    }
  });
}
