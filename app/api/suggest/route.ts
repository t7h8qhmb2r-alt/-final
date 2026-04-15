import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");
export async function POST(req: Request) {
  const { members, previousDrink, budget } = await req.json();
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `2軒目の居酒屋を探すための日本語の検索キーワード(例: 静かなバー, 餃子 居酒屋)を1つと、その理由を20文字以内で提案して。JSON形式{"keyword":"...", "reason":"..."}で返して。`;
  const result = await model.generateContent(prompt);
  return NextResponse.json(JSON.parse(result.response.text().replace(/```json|```/g, "")));
}
