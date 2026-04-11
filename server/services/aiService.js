import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const getAIResponse = async (idea) => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is missing in .env file");
  }

  const prompt = `
Generate Instagram carousel content.

Topic: ${idea}

Strictly follow this format:

Slide 1: <Hook (max 10 words)>
Slide 2: <Problem>
Slide 3: <Explanation>
Slide 4: <Solution>
Slide 5: <CTA>

Rules:
- Only return slide content
- Do NOT add introduction or conclusion
- Do NOT include images or [Image: ...]
- Keep each slide concise
- Use simple and engaging language
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
      max_tokens: 400,
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