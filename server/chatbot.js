import fetch from "node-fetch";

const models = [
  "deepseek/deepseek-r1-0528-qwen3-8b:free",
  "mistralai/mistral-7b-instruct",
  "google/gemma-7b-it",
  "openrouter/codellama-34b-instruct",
  "openai/gpt-3.5-turbo",
];

export async function getChatbotResponse(prompt, apiKey) {
  if (!apiKey) {
    throw new Error("API key is missing.");
  }

  // Augment prompt with instructions for clean and structured response
  const enhancedPrompt = `${prompt}

Please respond as a friendly chatbot assistant speaking casual English.
If you provide project ideas, please list only up to 5 project titles or names without any markdown, special characters (*, #) or extra formatting.
Do not use any bullet points or list symbols.
If you can, respond with JSON in this format when you provide ideas:

{
  "ideas": ["Idea 1", "Idea 2", "Idea 3"]
}

Otherwise, just reply normally in plain text.`;

  for (let model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ProjectMitra Chatbot",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: enhancedPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.warn(`⚠️ Chatbot Model ${model} failed: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (reply) {
        // Try parsing JSON response for 'ideas'
        try {
          const parsed = JSON.parse(reply);
          if (parsed.ideas && Array.isArray(parsed.ideas)) {
            return { ideas: parsed.ideas.slice(0, 5), model };
          }
        } catch {
          // Not JSON — return raw reply for frontend to show
        }

        return { reply, model };
      }
    } catch (err) {
      console.error(`❌ Chatbot Error (${model}):`, err.message);
      continue;
    }
  }
  return { reply: null, model: null };
}
