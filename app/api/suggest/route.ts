import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { members, previousDrink, budget } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `あなたは居酒屋の達人です。
      人数:${members}人、1軒目に飲んだもの:${previousDrink}、予算:${budget}円
      2軒目に最適なジャンルを1つ検索キーワードとして出し、その理由を20文字以内で教えてください。
      回答は必ず以下のJSON形式のみで返してください。余計な説明は一切不要です。
      {"keyword": "キーワード", "reason": "理由"}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // AIが返した文字列からJSON部分だけを抽出する（```json ... ``` 対策）
    const jsonMatch = text.match(/\{.*\}/s);
    if (jsonMatch) {
      return NextResponse.json(JSON.parse(jsonMatch[0]));
    }
    
    throw new Error("Invalid AI response");
  } catch (error) {
    console.error("AI Error:", error);
    // AIが失敗した時のための予備
    return NextResponse.json({ 
      keyword: "居酒屋 静か", 
      reason: "落ち着いて飲めるお店を厳選しました" 
    });
  }
}
