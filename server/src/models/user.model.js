import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      fullname: {
         type: String,
         required: true,
         trim: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
      },
      password: {
         type: String,
         required: true,
      },
      profilePicture: {
         type: String,
         default: "default.png",
      },
      bio: {
         type: String,
         default: "",
      },
      isVerified: {
         type: Boolean,
         default: false,
      },
      gender: {
         type: String,
         enum: ["male", "female"],
         default: "male",
      },
      follwers: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      following: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      posts: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
         },
      ],
      savedPosts: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
         },
      ],
   },
   { timestamps: true }
);

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
   next();
});

export default mongoose.model("User", userSchema);
