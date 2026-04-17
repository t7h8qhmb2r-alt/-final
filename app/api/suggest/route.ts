import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `2軒目の居酒屋を探すキーワード1つと理由(20文字以内)をJSON形式で。{"keyword":"...", "reason":"..."}`;
    const result = await model.generateContent(prompt);
    const jsonMatch = result.response.text().match(/\{.*\}/s);
    return NextResponse.json(jsonMatch ? JSON.parse(jsonMatch[0]) : { keyword: "居酒屋", reason: "おすすめを厳選しました" });
  } catch (e) { return NextResponse.json({ keyword: "居酒屋", reason: "人気店をピックアップしました" }); }
}
