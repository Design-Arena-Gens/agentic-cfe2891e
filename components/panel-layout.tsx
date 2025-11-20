import { cn } from "@/lib/utils";
import { Sparkles, Wand2, Video, BarChart3 } from "lucide-react";
import { useTheme } from "./theme-provider";
import type { AgentSection } from "@/components/state/agent-store";

type Section = {
  id: AgentSection;
  label: string;
};

type IconMap = Record<AgentSection, JSX.Element>;

const icons: IconMap = {
  assistant: <Sparkles className="h-4 w-4" />,
  visuals: <Wand2 className="h-4 w-4" />,
  video: <Video className="h-4 w-4" />,
  growth: <BarChart3 className="h-4 w-4" />
};

export const PanelLayout = ({
  children,
  sections,
  active,
  onSelect
}: {
  children: React.ReactNode;
  sections: readonly Section[];
  active: AgentSection;
  onSelect: (id: Section["id"]) => void;
}) => {
  const { theme, toggle } = useTheme();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-10">
      <header className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-semibold uppercase tracking-[0.4em] text-cyan-300/80">
              Agentic Studio
            </p>
            <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
              InfluenceOS — Autonomous Social Media Producer
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-slate-300">
              Deploy an orchestrated AI team that invents growth strategies,
              scripts narratives, and renders imagery & video assets tailored to
              your persona. Configure objectives, feed inspiration, and let the
              agent deliver a cohesive influence blueprint.
            </p>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-200 transition hover:border-white/40 hover:text-white"
            onClick={toggle}
          >
            {theme === "dark" ? "Lights Up" : "Lights Down"}
          </button>
        </div>
        <nav className="mt-8 flex flex-wrap gap-2">
          {sections.map((section) => (
            <button
              key={section.id}
              className={cn(
                "group flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition",
                active === section.id
                  ? "border-accent/50 bg-accent/15 text-white shadow-glow"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/30 hover:text-white"
              )}
              onClick={() => onSelect(section.id)}
            >
              <span className="text-cyan-300">{icons[section.id]}</span>
              {section.label}
            </button>
          ))}
        </nav>
      </header>
      <section className="rounded-3xl border border-white/10 bg-black/40 p-8 shadow-glow backdrop-blur">
        {children}
      </section>
    </div>
  );
};
