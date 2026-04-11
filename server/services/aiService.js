import Groq from "groq-sdk";

let groq;

const initGroq = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is missing in .env file");
    }
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }
  return groq;
};

export const getAIResponse = async (idea, format = "1:1", theme = "Modern") => {
  const groqClient = initGroq();


  const prompt = `
You are a Social Media Content Studio AI.
Topic: ${idea}
Format: ${format}
Vibe: ${theme}

Generate a 5-slide carousel in STRICT JSON format.
Each slide must have "text" and "visualPrompt".
The "visualPrompt" should be a 10-word description for an AI image generator (Pollinations/DALL-E) that matches the slide's content.

Example Output Format:
{
  "slides": [
    { "text": "Hook text", "visualPrompt": "A futuristic digital workspace with neon lights" },
    ...
  ]
}

Rules:
- Output ONLY the raw JSON. No markdown blocks, no intro/outro.
- Text must be engaging and relevant to the format.
- Visual prompts should be descriptive (e.g., "3D isometric illustration of a brain", "Minimalist office with a cup of coffee").
`;

  try {
    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }, // Groq supports JSON mode
    });

    const output = completion.choices[0]?.message?.content;

    if (!output) {
      throw new Error("Empty response from Groq API");
    }

    return JSON.parse(output);

  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};