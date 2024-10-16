import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, unique: true, required: true },
    name: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
  }
);

const User = models.User || model('User', UserSchema);

export default User;
