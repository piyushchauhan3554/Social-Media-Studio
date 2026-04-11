import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getAIResponse = async (idea, format = "1:1", theme = "Modern") => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env file");
  }

  // Determine text-length constraints based on visual format
  let formatGuide = "";
  if (format === "9:16") {
    formatGuide = "- Format is vertical Story (9:16). KEEP TEXT EXTREMELY SHORT (max 10-15 words per slide). Use punchy, highly readable text.";
  } else if (format === "1:1") {
    formatGuide = "- Format is standard Square Carousel (1:1). Text should be balanced (max 25-30 words per slide).";
  } else if (format === "4:5") {
    formatGuide = "- Format is Portrait Post (4:5). Text can be slightly longer but keep it engaging.";
  } else {
    formatGuide = "- Keep text perfectly balanced per slide.";
  }

  const prompt = `
You are an expert Social Media Strategist and Copywriter.
Generate high-converting social media slides.

Topic/Idea: ${idea}
Requested Vibe/Theme: ${theme}

Strictly follow this mapping format:

Slide 1: <Hook (max 10 words)>
Slide 2: <Problem/Struggle>
Slide 3: <Core Explanation>
Slide 4: <Actionable Solution>
Slide 5: <Call to Action (CTA)>

Rules:
${formatGuide}
- Only return the slide text content mapping exactly as Slide X: <content>.
- Do NOT add any introduction, conclusion, or pleasantries out of the slide format.
- Do NOT include image prompts, visual descriptions, or brackets like [Image: ...].
- Write in a natural, engaging tone matching the requested vibe.
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const output = completion.choices[0]?.message?.content;

    if (!output) {
      throw new Error("Empty response from Groq API");
    }

    return output;

  } catch (error) {
    console.error("Groq API Full Error:", error);

    const message =
      error?.error?.message ||
      error?.message ||
      "Unknown Groq API error";

    throw new Error(`Groq API Error: ${message}`);
  }
};