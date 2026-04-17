import { NextResponse } from "next/server";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = `https://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${process.env.HOTPEPPER_API_KEY}&lat=${searchParams.get("lat")}&lng=${searchParams.get("lng")}&keyword=${encodeURIComponent(searchParams.get("keyword")||"")}&range=3&format=json&count=10`;
    const res = await fetch(url);
    const data = await res.json();
    return NextResponse.json(data.results.shop || []);
  } catch (e) { return NextResponse.json([]); }
}
