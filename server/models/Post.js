import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  idea: {
    type: String,
    required: [true, "Please add an idea"]
  },
  slides: [{
    text: { type: String, required: true },
    visualPrompt: { type: String }
  }],
  format: {
    type: String,
    default: "1:1"
  },
  theme: {
    type: String,
    default: "Modern"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Post", postSchema);
