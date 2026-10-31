import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "./components/SiteHeader";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Haxi",
  description:
    "Answer a few easy questions and get a clear, honest answer about what your symptoms could mean and what to do next.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full bg-paper font-sans text-ink">
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <footer className="no-print w-full border-t border-cyan-800 mt-10">
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <p className="text-base font-semibold tracking-tight">
                  Haxi
                </p>
                <p className="max-w-2xl text-xs leading-relaxed text-muted">
                  <span className="font-medium text-body">
                    Please remember:
                  </span>{" "}
                  Haxi is a learning tool, not a doctor. It cannot diagnose or
                  treat you. Health information links come from MedlinePlus.gov,
                  a free service of the U.S. National Library of Medicine, which
                  does not endorse Kenko. If something feels dangerous, call your
                  local emergency number straight away.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
