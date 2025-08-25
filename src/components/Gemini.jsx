import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);


async function askGemini(prompt, maxTokens = 300) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    });

    return (
      result.response?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response"
    );
  } catch (err) {
    console.error("Gemini API Error:", err);
    throw new Error("Gemini call failed: " + err.message);
  }
}

// ✅ Default + Named export
export { askGemini };
export default { askGemini };