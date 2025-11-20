import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Agentic Creator",
  description:
    "Autonomous AI agent that crafts visuals, videos, and growth strategies for digital influencers."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, "bg-midnight text-slate-100")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
