import mongoose, {Schema} from "mongoose";

const chatSchema = new Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
