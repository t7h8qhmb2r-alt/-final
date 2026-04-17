import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `2軒目の居酒屋を探すキーワード1つと理由(20文字以内)をJSON形式で返して。{"keyword":"...", "reason":"..."}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    // /s フラグを使わずに [\s\S] (すべての文字) を使う安全な書き方に変更
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return NextResponse.json(jsonMatch ? JSON.parse(jsonMatch[0]) : { keyword: "居酒屋", reason: "AIおすすめのお店です" });
  } catch (e) { return NextResponse.json({ keyword: "居酒屋", reason: "人気のお店をピックアップしました" }); }
}
