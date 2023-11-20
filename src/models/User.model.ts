import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    roles: { type: [String], default: ["USER"] },
});

export const User = mongoose.model("User", userSchema);
