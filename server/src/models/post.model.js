import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
   caption: {
      type: String,
      default: "",
   },
   image: {
      type: String,
      required: true,
   },
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
   },
   likes: {
      type: Number,
      default: 0,
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment",
      },
   ],
});

export default mongoose.model("Post", postSchema);
