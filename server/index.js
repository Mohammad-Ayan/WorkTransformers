import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import path from "path";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const app = express();
app.use(cors());

// Multer handles multipart/form-data
const upload = multer({ dest: "uploads/" });

// Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post(
  "/api/ai",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "query", maxCount: 1 },
    { name: "context", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const query = req.body.query || "";
      const context = req.body.context || "";

      // Convert uploaded images to base64
      const files = req.files?.images || [];
      const imageParts = files.map((file) => {
        const fileData = fs.readFileSync(file.path);
        return {
          inlineData: {
            data: fileData.toString("base64"),
            mimeType: file.mimetype,
          },
        };
      });

      const model = genAI.getGenerativeModel({
        model: "models/gemini-2.5-flash",
      });

      const systemPrompt = `
        You are the AI assistant inside a visual canvas editor.
        Your job:

        1. Always answer VERY concisely and to the point (3–6 lines maximum).
        2. Only use information from the connected nodes provided in "Canvas Context".
        3. Ignore anything unrelated — do NOT generate long explanations.
        4. If shapes, text nodes, comments, or images are connected, describe only what is necessary.
        5. If the user query is unclear, ask ONE clarifying question only.
        6. Never repeat the entire canvas context—only use it to form your short answer.
        7. No long paragraphs. No repetition. No(*). Give high-quality, direct output.
        8. Never include HTML, CSS, JavaScript, or code examples.  
        9. Never explain steps unless asked.  
       10. Never wrap answers in backticks.  
       11. Only return text that can be placed directly inside a canvas box.
        `;

      const result = await model.generateContentStream({
        contents: [
          {
            role: "user",
            parts: [
              { text: systemPrompt },
              { text: "User Query:\n" + query },
              { text: "Canvas Context (connected nodes only):\n" + context },
              ...imageParts,
            ],
          },
        ],
      });


      // Stream back to the frontend
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.flushHeaders();

      for await (const chunk of result.stream) {
        res.write(`data: ${chunk.text()}\n\n`);
      }

      res.end();
    } catch (err) {
      console.error("Gemini Server Error:", err);
      res.status(500).json({ error: "AI Failed" });
    } finally {
      // Cleanup uploaded files
      const images = req.files?.images || [];
      images.forEach((f) => fs.unlinkSync(f.path));
    }
  }
);

app.listen(5000, () =>
  console.log("AI Server running on http://localhost:5000")
);
