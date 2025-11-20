"use client";

import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Loader2, Brain } from "lucide-react";
import ReactMarkdown from "react-markdown";

type PlaybookPayload = {
  persona: string;
  goals: string;
  constraints: string;
  cadence: string;
};

const requestPlaybook = async (
  url: string,
  { arg }: { arg: PlaybookPayload }
): Promise<{ blueprint: string }> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(arg)
  });

  if (!response.ok) {
    throw new Error("Unable to synthesize strategy");
  }

  return response.json();
};

export const GrowthPlaybooks = () => {
  const [persona, setPersona] = useState("");
  const [goals, setGoals] = useState("");
  const [constraints, setConstraints] = useState("");
  const [cadence, setCadence] = useState("3 posts/week");

  const { data, trigger, isMutating, error } = useSWRMutation(
    "/api/strategy",
    requestPlaybook
  );

  const handleCreate = async () => {
    if (!persona.trim() || !goals.trim()) return;
    await trigger({
      persona,
      goals,
      constraints,
      cadence
    });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">
          Architect Multi-Channel Growth Systems
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          InfluenceOS deploys strategy, scripting, and measurement frameworks
          tuned for your persona & audience.
        </p>
        <div className="mt-6 grid gap-4">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Persona DNA
            <textarea
              className="mt-2 min-h-[80px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
              placeholder="Describe tone, audience, unique POV…"
              value={persona}
              onChange={(event) => setPersona(event.target.value)}
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Growth Objectives
            <textarea
              className="mt-2 min-h-[80px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
              placeholder="KPIs, timelines, acquisition priorities…"
              value={goals}
              onChange={(event) => setGoals(event.target.value)}
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Constraints
            <textarea
              className="mt-2 min-h-[80px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
              placeholder="Budget, time, brand guardrails…"
              value={constraints}
              onChange={(event) => setConstraints(event.target.value)}
            />
          </label>
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Cadence
            <input
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
              placeholder="3 posts/week"
              value={cadence}
              onChange={(event) => setCadence(event.target.value)}
            />
          </label>
        </div>
        <button
          type="button"
          onClick={() => void handleCreate()}
          disabled={isMutating}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isMutating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Drafting Blueprint
            </>
          ) : (
            <>
              <Brain className="h-4 w-4" />
              Generate Strategy
            </>
          )}
        </button>
        {error && (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error.message}
          </p>
        )}
      </div>
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6">
        {!data?.blueprint && (
          <div className="flex h-full min-h-[280px] items-center justify-center px-6 text-center text-sm text-slate-400">
            Strategic OS delivers positioning narratives, content pillars,
            weekly cadences, and measurement loops referencing your context.
          </div>
        )}
        {data?.blueprint && (
          <div className="prose prose-invert max-w-none text-sm text-slate-100 prose-li:text-slate-200">
            <ReactMarkdown>{data.blueprint}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};
