import { getAIResponse } from "../services/aiService.js";

export const generateContent = async (req, res) => {
  try {
    const { idea, format, theme } = req.body;

    if (!idea) {
      return res.status(400).json({
        message: "Idea is required",
      });
    }

    const aiText = await getAIResponse(idea, format, theme);

    // 🔥 FINAL UNIVERSAL PARSING
    const slides = aiText
      .split(/Slide\s*\d+:/)   // split using Slide 1:, Slide 2:
      .filter((s) => s.trim() !== "")
      .map((s, index) => `Slide ${index + 1}: ${s.trim()}`);

    res.status(200).json({
      slides, // ✅ array send hoga
    });

  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      message: error.message,
    });
  }
};