"use client";

import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Loader2, Download, Wand2 } from "lucide-react";
import Image from "next/image";
import { useAgentStore } from "@/components/state/agent-store";

type GenerateBody = {
  prompt: string;
  format: "square" | "portrait" | "landscape";
  vibe: string;
};

const sendRequest = async (
  url: string,
  { arg }: { arg: GenerateBody }
): Promise<{ image: string; prompt: string }> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(arg)
  });

  if (!response.ok) {
    throw new Error("Failed to create image");
  }

  return response.json();
};

const vibes = [
  "Bold Neon",
  "Pastel Minimalism",
  "Futuristic Hologram",
  "Editorial Luxury",
  "Street Pop",
  "Cyber Noir"
];

export const AssetStudio = () => {
  const [prompt, setPrompt] = useState("");
  const [vibe, setVibe] = useState(vibes[0]);
  const [format, setFormat] = useState<GenerateBody["format"]>("square");
  const { isProcessing, setProcessing, setAssetResult } = useAgentStore();

  const { data, trigger, isMutating, error } = useSWRMutation(
    "/api/images",
    sendRequest
  );

  const busy = isMutating || isProcessing;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setProcessing(true);
    try {
      const payload = {
        prompt,
        format,
        vibe
      };
      const response = await trigger(payload);
      setAssetResult(response?.image);
    } catch (err) {
      console.error(err);
      setAssetResult(undefined);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">
          Generate Social-Ready Visuals
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Describe the campaign asset you need. InfluenceOS blends your style
          guide with trending visual tropes and brand-safe composition rules.
        </p>
        <textarea
          className="mt-6 min-h-[160px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-accent/60 focus:outline-none"
          placeholder="Example: Create a high-energy carousel cover promoting a giveaway for a fitness influencer targeting Gen Z."
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">
            Format:
            <select
              className="bg-transparent text-sm font-semibold tracking-normal focus:outline-none"
              value={format}
              onChange={(event) =>
                setFormat(event.target.value as GenerateBody["format"])
              }
            >
              <option value="square">Square (1080x1080)</option>
              <option value="portrait">Portrait (1080x1350)</option>
              <option value="landscape">Landscape (1920x1080)</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/50 px-4 py-2 text-xs uppercase tracking-[0.25em] text-slate-300">
            Vibe:
            <select
              className="bg-transparent text-sm font-semibold tracking-normal focus:outline-none"
              value={vibe}
              onChange={(event) => setVibe(event.target.value)}
            >
              {vibes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={() => void handleGenerate()}
          disabled={busy}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Rendering
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4" />
              Generate Visual
            </>
          )}
        </button>
        {error && (
          <p className="mt-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
            {error.message}
          </p>
        )}
      </div>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent">
        {!data?.image && (
          <div className="flex h-full min-h-[320px] items-center justify-center px-6 py-12 text-center text-sm text-slate-400">
            Output preview will appear here. The agent automatically archives
            generations for campaign referencing.
          </div>
        )}
        {data?.image && (
          <div className="flex flex-col gap-4 px-6 py-8">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/15 bg-black/40">
              <Image
                src={data.image}
                alt="Generated asset preview"
                fill
                className="object-cover"
                sizes="(min-width: 768px) 320px, 100vw"
              />
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-slate-300">
              <p className="font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Prompt blueprint
              </p>
              <p className="mt-2 text-sm text-slate-200">{data.prompt}</p>
            </div>
            <a
              className="inline-flex items-center gap-2 self-start rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200 transition hover:border-white/40 hover:text-white"
              href={data.image}
              download
            >
              <Download className="h-4 w-4" />
              Download Asset
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
