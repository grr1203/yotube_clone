import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  socialOnly: { type: Boolean, default: false },
  avatarUrl: String,
  username: { type: String, required: true, unique: true },
  password: { type: String },
  location: String,
  videos: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Video" },
  ],
  comments: [
    { type: mongoose.Schema.Types.ObjectId, requried: true, ref: "Comment" },
  ],
});

userSchema.pre("save", async function () {
  if (this.isModified("password"))
    this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
