import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAI } from "@/lib/openai";

const schema = z.object({
  prompt: z.string().min(10, "Provide a richer creative brief."),
  format: z.enum(["square", "portrait", "landscape"]).default("square"),
  vibe: z.string().optional()
});

const sizeMap = {
  square: "1024x1024",
  portrait: "1024x1792",
  landscape: "1792x1024"
} as const;

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { prompt, format, vibe } = schema.parse(json);
    const openai = getOpenAI();

    const template = `${prompt}

Design parameters:
- format: ${format}
- aesthetic vibe: ${vibe ?? "creator-defined"}
- deliverable: social media ready, high contrast, text legible, brand-safe`;

    const result = await openai.images.generate({
      model: "gpt-image-1",
      prompt: template,
      size: sizeMap[format],
      style: "vivid",
      quality: "high",
      n: 1
    });

    const image = result.data?.[0];

    if (!image?.b64_json) {
      throw new Error("No image returned from OpenAI");
    }

    return NextResponse.json({
      image: `data:image/png;base64,${image.b64_json}`,
      prompt: template
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Unknown image generation error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
