import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAI } from "@/lib/openai";

const schema = z.object({
  prompt: z.string().min(3, "Prompt is too short")
});

const systemPrompt = `You are InfluenceOS, an orchestrated AI collective for digital influencers.
- Provide actionable, structured plans.
- When needed, reference the suite of tools available: Image Studio, Video Studio, Growth Engine.
- Suggest next actions and call-to-action items.
- Respond in markdown with headers, bullet lists, and tables when helpful.
- Keep tone confident, strategic, and energetic.
- If the user explicitly requests visual generation, recommend switching to the Visual Creator.
- If the user requests video creation from images, suggest the Video Director module.
- Always end with a short "Command Queue" list of the most important next steps.`;

const autoNavigate = (reply: string) => {
  const checks: { id: "visuals" | "video" | "growth"; patterns: RegExp[] }[] = [
    {
      id: "visuals",
      patterns: [
        /image/i,
        /banner/i,
        /flyer/i,
        /visual/i,
        /graphic/i,
        /design/i
      ]
    },
    {
      id: "video",
      patterns: [/video/i, /motion/i, /animate/i]
    },
    {
      id: "growth",
      patterns: [/strategy/i, /growth/i, /calendar/i, /plan/i, /campaign/i]
    }
  ];

  for (const check of checks) {
    if (check.patterns.some((regex) => regex.test(reply))) {
      return check.id;
    }
  }

  return undefined;
};

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { prompt } = schema.parse(json);

    const openai = getOpenAI();

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6
    });

    const reply =
      response.output_text ??
      "I could not synthesize a response. Confirm your OpenAI configuration.";

    return NextResponse.json({
      reply,
      autoNavigate: autoNavigate(reply)
    });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
