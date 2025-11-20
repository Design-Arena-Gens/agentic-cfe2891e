import { NextResponse } from "next/server";
import { z } from "zod";
import { createVideoPrediction } from "@/lib/replicate";

const schema = z.object({
  imageUrl: z.string().url("Provide a valid image URL."),
  concept: z.string().min(5, "Describe the motion you expect."),
  duration: z.number().min(4).max(12),
  motionStyle: z.string().min(3)
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { imageUrl, concept, duration, motionStyle } = schema.parse(json);

    const prediction = await createVideoPrediction({
      image: imageUrl,
      prompt: concept,
      duration,
      motion: motionStyle
    });

    return NextResponse.json({
      status: prediction.status,
      resultUrl:
        Array.isArray(prediction.output) && prediction.output.length > 0
          ? prediction.output[prediction.output.length - 1]
          : undefined,
      dashboardUrl: `https://replicate.com/p/${prediction.id}`
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Video prediction failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
