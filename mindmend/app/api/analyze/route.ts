/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

const HF_API_URL_SENTIMENT =
  "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
const HF_API_URL_EMOTION =
  "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base";

async function queryHuggingFace(url: string, text: string): Promise<any> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    },
    body: JSON.stringify({ inputs: text }),
  });
  if (!res.ok) {
    throw new Error("Hugging Face API error");
  }
  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    if (!text || text.length === 0) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const [sentimentRes, emotionRes] = await Promise.all([
      queryHuggingFace(HF_API_URL_SENTIMENT, text),
      queryHuggingFace(HF_API_URL_EMOTION, text),
    ]);

    const sentiment = sentimentRes[0]?.label ?? null;
    const emotion = emotionRes[0]?.label ?? null;

    // summary via simple heuristics (first 20 words) placeholder
    const summary = text.split(" ").slice(0, 20).join(" ") + (text.split(" ").length > 20 ? "..." : "");

    return NextResponse.json({ sentiment, emotion, summary });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}