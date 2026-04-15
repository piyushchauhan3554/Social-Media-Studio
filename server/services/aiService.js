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

export const getAIResponse = async (idea, format = "1:1", theme = "Modern", tone = "Educational", slideCount = 5) => {
  const groqClient = initGroq();


const prompt = `
You are a Social Media Content Studio AI.
Topic: ${idea}
Format: ${format}
Vibe: ${theme}
Tone: ${tone}
Number of slides: ${slideCount}

Generate a ${slideCount}-slide carousel in STRICT JSON format.
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


export const regenerateSingleSlide = async (idea, slideIndex, format = "1:1", theme = "Modern") => {
  const groqClient = initGroq();

  const prompt = `
You are a Social Media Content Studio AI.
Topic: ${idea}
Format: ${format}
Vibe: ${theme}
Slide Number: ${slideIndex + 1} of 5

Generate ONLY 1 slide for a carousel in STRICT JSON format.
This is slide number ${slideIndex + 1}, so make content appropriate for that position.
(Slide 1 = Hook, Slide 2-4 = Content, Slide 5 = CTA/Conclusion)

Output Format:
{
  "text": "Slide text here",
  "visualPrompt": "A descriptive 10-word image prompt"
}

Rules:
- Output ONLY raw JSON. No markdown, no extra text.
- Make it different from a generic slide — be creative.
`;

  try {
    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.9,
      response_format: { type: "json_object" },
    });

    const output = completion.choices[0]?.message?.content;
    if (!output) throw new Error("Empty response from Groq API");

    return JSON.parse(output);
  } catch (error) {
    console.error("Groq Regenerate Error:", error);
    throw new Error(`AI Service Error: ${error.message}`);
  }
};

export const generateCaption = async (idea, theme, format,  tone = "Educational") => {
  const groqClient = initGroq();

  const prompt = `
You are a Social Media Caption Expert.
Topic: ${idea}
Theme/Vibe: ${theme}
Format: ${format}
Tone: ${tone}

Generate a social media caption with hashtags in STRICT JSON format.

Output Format:
{
  "caption": "Engaging caption text here (2-3 sentences, conversational, with 1-2 emojis)",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8", "hashtag9", "hashtag10"]
}

Rules:
- Output ONLY raw JSON. No markdown, no extra text.
- Caption should be engaging, natural, and relevant to the topic.
- Generate exactly 10 relevant hashtags without # symbol.
- Mix popular and niche hashtags.
`;

  try {
    const completion = await groqClient.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const output = completion.choices[0]?.message?.content;
    if (!output) throw new Error("Empty response from Groq API");

    return JSON.parse(output);
  } catch (error) {
    console.error("Caption Groq Error:", error);
    throw new Error(`Caption Service Error: ${error.message}`);
  }
};