"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PanelLayout } from "@/components/panel-layout";
import { AgentChat } from "@/components/sections/agent-chat";
import { AssetStudio } from "@/components/sections/asset-studio";
import { GrowthPlaybooks } from "@/components/sections/growth-playbooks";
import { VideoStudio } from "@/components/sections/video-studio";
import { useAgentStore } from "@/components/state/agent-store";
import type { AgentSection } from "@/components/state/agent-store";

const sections: ReadonlyArray<{ id: AgentSection; label: string }> = [
  { id: "assistant", label: "Strategic Agent" },
  { id: "visuals", label: "Visual Creator" },
  { id: "video", label: "Video Director" },
  { id: "growth", label: "Growth Engine" }
] as const;

export default function Home() {
  const current = useAgentStore((state) => state.section);
  const setSection = useAgentStore((state) => state.setSection);

  const active = useMemo(
    () => sections.find((section) => section.id === current) ?? sections[0],
    [current]
  );

  return (
    <div className="min-h-screen">
      <PanelLayout
        sections={sections}
        active={active.id}
        onSelect={(section) => setSection(section)}
      >
        <AnimatePresence mode="wait">
          {active.id === "assistant" && (
            <motion.div
              key="assistant"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <AgentChat />
            </motion.div>
          )}
          {active.id === "visuals" && (
            <motion.div
              key="visuals"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <AssetStudio />
            </motion.div>
          )}
          {active.id === "video" && (
            <motion.div
              key="video"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <VideoStudio />
            </motion.div>
          )}
          {active.id === "growth" && (
            <motion.div
              key="growth"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="h-full"
            >
              <GrowthPlaybooks />
            </motion.div>
          )}
        </AnimatePresence>
      </PanelLayout>
    </div>
  );
}
