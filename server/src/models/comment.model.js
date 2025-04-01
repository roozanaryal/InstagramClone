import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
   {
      description: {
         type: String,
         required: true,
         trim: true,
      },
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      post: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Post",
         required: true,
      },
   },
   { timestamps: true }
);
export default mongoose.model("Comment", commentSchema);
