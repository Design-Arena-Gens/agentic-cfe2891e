import { NextResponse } from "next/server";
import { z } from "zod";
import { getOpenAI } from "@/lib/openai";

const schema = z.object({
  persona: z.string().min(10, "Describe the persona in more detail."),
  goals: z.string().min(10, "Outline at least one goal."),
  constraints: z.string().optional(),
  cadence: z.string().optional()
});

const promptTemplate = ({
  persona,
  goals,
  constraints,
  cadence
}: {
  persona: string;
  goals: string;
  constraints?: string;
  cadence?: string;
}) => `You are InfluenceOS, a growth operating system for influencers.

Persona Summary:
${persona}

Growth Objectives:
${goals}

Constraints:
${constraints ?? "None specified"}

Publishing Cadence:
${cadence ?? "Suggested by you"}

Deliver a markdown strategy file including:
- Narrative positioning statement
- Audience insight bullets
- Content pillars with example post formats
- Channel mix with cadence recommendations
- 14-day content calendar table (Day | Channel | Hook | CTA)
- Scripts & caption guidelines
- Measurement stack with metrics, rituals, tooling
- Partnering & monetization opportunities
End with a Mission Debrief list of next actions.`;

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = schema.parse(json);
    const openai = getOpenAI();

    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: promptTemplate(parsed),
      temperature: 0.5,
      max_output_tokens: 1800
    });

    const blueprint =
      response.output_text ??
      "Unable to craft strategy. Confirm your OpenAI configuration.";

    return NextResponse.json({ blueprint });
  } catch (error) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to generate strategy";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
