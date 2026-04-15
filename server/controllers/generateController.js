import { getAIResponse ,regenerateSingleSlide, generateCaption} from "../services/aiService.js";
import Post from "../models/Post.js";

// Generate and Save content
export const generateContent = async (req, res) => {
  try {
const { idea, format, theme, tone, slideCount } = req.body;

    if (!idea) {
      return res.status(400).json({ message: "Idea is required" });
    }
 
    const aiResponse = await getAIResponse(idea, format, theme, tone, slideCount);

    // Save to MongoDB linked to current user
    const post = await Post.create({
      user: req.user._id,
      idea,
      slides: aiResponse.slides,
      format,
      theme
    });

    res.status(200).json(post);

  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Get all posts for logged in user
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check user ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "User not authorized" });
    }

    await post.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const regenerateSlide = async (req, res) => {
  try {
    const { idea, slideIndex, format, theme } = req.body;

    if (idea === undefined || slideIndex === undefined) {
      return res.status(400).json({ message: "idea and slideIndex are required" });
    }

    const newSlide = await regenerateSingleSlide(idea, slideIndex, format, theme);

    res.status(200).json({ slide: newSlide });
  } catch (error) {
    console.error("Regenerate Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const generatePostCaption = async (req, res) => {
  try {
    const { idea, theme, format } = req.body;

    if (!idea) {
      return res.status(400).json({ message: "idea is required" });
    }

    const result = await generateCaption(idea, theme, format);
    res.status(200).json(result);

  } catch (error) {
    console.error("Caption Controller Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};