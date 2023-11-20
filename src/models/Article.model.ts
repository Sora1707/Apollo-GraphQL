import mongoose from "mongoose";
const { Schema } = mongoose;

const articlechema = new Schema({
    authorId: { type: mongoose.Types.ObjectId },
    content: { type: String, default: "Hello Sora" },
});

export const Article = mongoose.model("Article", articlechema);
