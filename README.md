const express = require("express");
const OpenAI = require("openai");
const path = require("path");

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  const message =
    typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

  if (!message) {
    return res.status(400).json({
      error: "প্রশ্ন লিখো।"
    });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(503).json({
      error: "AI এখনো সেটআপ করা হয়নি।"
    });
  }

  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are Rohan AI. Help users in Bengali or English, matching their language. Give clear and helpful answers."
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 800
    });

    res.json({
      answer:
        response.choices[0]?.message?.content ||
        "উত্তর পাওয়া যায়নি।"
    });
  } catch (error) {
    console.error("AI request failed:", error.status || error.name);
    res.status(502).json({
      error: "AI উত্তর দিতে পারেনি। সেটআপ পরীক্ষা করো।"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Rohan AI server started");
});
