import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { getChatbotResponse } from "./chatbot.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("OpenRouter API is up and running.");
});

app.post("/generate", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt required" });

  const models = [
    "deepseek/deepseek-r1-0528-qwen3-8b:free",
    "mistralai/mistral-7b-instruct",
    "google/gemma-7b-it",
    "openrouter/codellama-34b-instruct",
    "openai/gpt-3.5-turbo",
  ];

  for (let model of models) {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "ProjectMitra Code Generator"
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "user",
              content: `${prompt}\n\nPlease provide a brief explanation first, then the code inside a single markdown code block.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        console.warn(`⚠️ Model ${model} failed: ${response.status}`);
        continue;
      }

      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;

      if (reply) {
        // Extract code block between triple backticks
        const codeBlockRegex = /```(?:[\s\S]*?\n)?([\s\S]*?)```/;
        const codeMatch = reply.match(codeBlockRegex);

        const code = codeMatch ? codeMatch[1].trim() : "";
        const explanation = codeMatch
          ? reply.replace(codeMatch[0], "").trim()
          : reply.trim();

        return res.json({ explanation, code, model });
      }

    } catch (error) {
      console.error(`❌ Error using model ${model}:`, error.message);
      continue;
    }
  }

  return res.status(500).json({ error: "All models failed. Please try again later." });
});

// Chatbot Route -
app.post("/chatbot", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });

  const response = await getChatbotResponse(message, OPENROUTER_API_KEY);
  if (response.error) {
    return res.status(500).json({ error: response.error });
  }

  res.json(response);
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
