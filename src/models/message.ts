import * as mongoose from "mongoose";
import { Schema } from "mongoose";

const messageSchema = new Schema({
  sourceUser: { type: Schema.Types.ObjectId, ref: "user", required: true },
  destUser: { type: Schema.Types.ObjectId, ref: "user", required: true },
  title: { type: String, require: true },
  content: { type: String, required: true },
});

export const messagesModel = mongoose.model("message", messageSchema);

export function getMessagesByUsername(username): Promise<any> {
  let query = { destUser: username };
  return messagesModel
    .find(query)
    .populate("sourceUser")
    .populate("destUser")
    .exec();
}

export function filterMessages(
  source,
  dest,
  title: RegExp,
  content: RegExp
): Promise<any> {
  let query = {
    $and: [{ sourceUser: source }, { destUser: dest }, { title }, { content }],
  };
  return messagesModel.find(query).exec();
}

export async function totalMessagesAmount(username): Promise<number> {
  let messages = await getMessagesByUsername(username);
  return messages.map((msg) => 1).reduce((sum, currentMsg) => sum + currentMsg);
}

export function getAllMessages() {
  return messagesModel
    .find()
    .populate("sourceUser")
    .populate("destUser")
    .exec();
}
