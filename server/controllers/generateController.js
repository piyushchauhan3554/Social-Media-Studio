import { getAIResponse } from "../services/aiService.js";

export const generateContent = async (req, res) => {
  try {
    const { idea, format, theme } = req.body;

    if (!idea) {
      return res.status(400).json({
        message: "Idea is required",
      });
    }

    const aiResponse = await getAIResponse(idea, format, theme);

    res.status(200).json({
      slides: aiResponse.slides, // ✅ array of {text, visualPrompt}
    });

  } catch (error) {
    console.error("Controller Error:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};