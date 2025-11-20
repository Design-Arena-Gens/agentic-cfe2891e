"use client";

import { useState } from "react";
import useSWRMutation from "swr/mutation";
import { Loader2, Film, Link as LinkIcon } from "lucide-react";
import { useAgentStore } from "@/components/state/agent-store";

type VideoPayload = {
  imageUrl: string;
  concept: string;
  duration: number;
  motionStyle: string;
};

const requestVideo = async (
  url: string,
  { arg }: { arg: VideoPayload }
): Promise<{ status: string; resultUrl?: string; dashboardUrl?: string }> => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(arg)
  });

  if (!response.ok) {
    throw new Error("Unable to initiate video synthesis");
  }

  return response.json();
};

const styles = [
  "Smooth Cinematic",
  "Energetic TikTok Loop",
  "Documentary Pan",
  "Dynamic Product Spin",
  "Hyperreal Drone Pullback"
];

export const VideoStudio = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [concept, setConcept] = useState("");
  const [duration, setDuration] = useState(6);
  const [motionStyle, setMotionStyle] = useState(styles[0]);
  const { setVideoStatus } = useAgentStore();

  const { data, trigger, isMutating, error } = useSWRMutation(
    "/api/video",
    requestVideo
  );

  const handleSubmit = async () => {
    if (!imageUrl.trim()) return;
    const submission = {
      imageUrl: imageUrl.trim(),
      concept: concept.trim(),
      duration,
      motionStyle
    };
    const response = await trigger(submission);
    setVideoStatus(response?.status);
  };

  return (
    <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">
          Animate Static Shots Into Motion Assets
        </h2>
        <p className="mt-2 text-sm text-slate-300">
          Feed a key visual, and let the video director extrapolate believable
          motion. Perfect for hero loops, story intros, and short-form hooks.
        </p>
        <label className="mt-6 block text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
          Image URL
          <input
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aurora/60 focus:outline-none"
            placeholder="https://..."
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </label>
        <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
          Motion Intent
          <textarea
            className="mt-2 min-h-[120px] w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-aurora/60 focus:outline-none"
            placeholder="Example: Transform this still sneaker shot into a rotating hero clip with pulsing neon trails."
            value={concept}
            onChange={(event) => setConcept(event.target.value)}
          />
        </label>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Duration (seconds)
            <input
              type="number"
              min={4}
              max={12}
              step={1}
              className="mt-2 w-32 rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-aurora/60 focus:outline-none"
              value={duration}
              onChange={(event) => setDuration(Number(event.target.value))}
            />
          </label>
          <label className="block text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Motion Palette
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2 text-sm text-white focus:border-aurora/60 focus:outline-none"
              value={motionStyle}
              onChange={(event) => setMotionStyle(event.target.value)}
            >
              {styles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={isMutating}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-aurora px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-fuchsia-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isMutating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Composing Motion
            </>
          ) : (
            <>
              <Film className="h-4 w-4" />
              Render Video
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
        {!data && (
          <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 text-center text-sm text-slate-400">
            Awaiting render request. The agent will surface result links and
            track progress automatically.
          </div>
        )}
        {data && (
          <div className="space-y-4 text-sm text-slate-200">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                Status
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {data.status}
              </p>
            </div>
            {data.resultUrl && (
              <a
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200 transition hover:border-white/40 hover:text-white"
                href={data.resultUrl}
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon className="h-4 w-4" />
                View Render
              </a>
            )}
            {data.dashboardUrl && (
              <a
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200 transition hover:border-white/40 hover:text-white"
                href={data.dashboardUrl}
                target="_blank"
                rel="noreferrer"
              >
                <LinkIcon className="h-4 w-4" />
                Replicate Dashboard
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
