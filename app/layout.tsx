import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MindMate | Adaptive Study Buddy",
  description: "AI-powered study companion with adaptive plans, quizzes, and tutoring.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ambient text-slate-100 antialiased">{children}</body>
    </html>
  );
}

