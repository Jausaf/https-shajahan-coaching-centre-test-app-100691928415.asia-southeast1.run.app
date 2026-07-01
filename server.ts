import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client lazily & safely
let ai: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined. AI explanations will fall back to offline local explanations.");
      return null;
    }
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

// API endpoint for AI Hindi Explanation
app.post("/api/gemini/explain", async (req: any, res: any) => {
  try {
    const { question, subject, studentAnswer, correctAnswer, options } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question text is required." });
    }

    const client = getGeminiClient();
    if (!client) {
      return res.json({
        explanation: `💡 *लोकल विश्लेषण (Offline Mode)*:\n\nयह प्रश्न **${subject || "सामान्य ज्ञान"}** विषय से है।\n\n- **सही उत्तर**: ${correctAnswer || "Option A"}\n- **आपका उत्तर**: ${studentAnswer || "अनुत्तरित (Not Attempted)"}\n\n*मुख्य बिंदु (Key Concept)*: रेलवे और SSC परीक्षाओं में इस प्रकार के प्रश्नों को सीधे तथ्यों या बुनियादी सूत्रों की मदद से हल किया जा सकता है। अपनी तैयारी को और मजबूत करने के लिए शजहान कोचिंग सेंटर के टेस्ट सीरीज़ के अन्य प्रश्नों का अभ्यास करते रहें।`,
        isFallback: true
      });
    }

    const prompt = `You are the Head Coach at "Shajahan Coaching Centre", an elite academy in Bihar preparing Hindi medium students for government competitive exams (Railway, SSC, Bihar Police, Bihar Daroga, BSSC, Group D, NTPC, Banking).
Provide a highly detailed, extremely clear, and highly encouraging explanation in Hindi (using clean, easily readable Hindi-English mix that village and small-town students understand instantly) for the following question:

Question: "${question}"
Subject: "${subject || 'General'}"
Options: ${JSON.stringify(options || [])}
Correct Answer: "${correctAnswer}"
Student's Selected Answer: "${studentAnswer || 'Not Attempted'}"

Structure the response beautifully in Devanagari script using simple Markdown formatting:
1. **सही उत्तर का विश्लेषण (Detailed Analysis)**: Confirm why the correct option is indeed correct in simple steps.
2. **स्मार्ट ट्रिक / शॉर्टकट विधि (Smart Shortcut/Trick)**: Provide an active shortcut formula, a fast solving technique, or a memory mnemonic useful for speed under pressure in SSC/Railway exams.
3. **महत्वपूर्ण तथ्य जो सीधे पूछे जाते हैं (Frequently Asked Allied Facts)**: Give 2-3 additional high-yield facts related to this topic.
4. **प्रेरणा संदेश (Guru Mantra)**: A 1-sentence highly motivational sign-off for the student to keep pushing hard.

Keep the tone highly motivating, friendly, and respectful, like a warm and experienced Bihar Daroga / SSC teacher encouraging their favorite student.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({
      explanation: response.text,
      isFallback: false
    });
  } catch (error: any) {
    console.error("Error in gemini explanation:", error);
    res.status(500).json({
      error: "Failed to generate explanation",
      details: error.message
    });
  }
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: any, res: any) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
