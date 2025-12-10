import React from 'react';
import { Sparkles, BrainCircuit, Shield, ArrowRight, Star, CheckCircle2, Lock } from 'lucide-react';

interface HomeProps {
  onLogin: () => void;
}

const Home: React.FC<HomeProps> = ({ onLogin }) => {
  const features = [
    { icon: BrainCircuit, title: 'AI Study Copilot', desc: 'Adaptive plans, quizzes, and tutoring from your notes.' },
    { icon: Shield, title: 'Private & Secure', desc: 'OAuth sign-in with Google. Your sessions stay in your browser.' },
    { icon: Sparkles, title: 'Premium UI', desc: 'Glassmorphism, neon glows, and smooth motion for focus.' },
  ];

  const highlights = [
    'Generate a tailored roadmap in seconds',
    'Quiz mode with immediate explanations',
    'Upload PDFs or notes to ground the AI',
    'Personalized tutor styles (simple, analogy, Socratic)',
  ];

  return (
    <div className="relative min-h-screen bg-ambient text-slate-100">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-10 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-cyan-400/25 blur-3xl" />
        <div className="absolute top-1/3 left-1/3 h-96 w-96 rounded-full bg-indigo-500/15 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 pb-16 pt-20">
        {/* Nav */}
        <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-glow-1">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-violet-200">MindMate</p>
              <p className="text-sm text-slate-300">Adaptive Study Buddy</p>
            </div>
          </div>
          <button
            onClick={onLogin}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-[0_20px_60px_rgba(148,163,184,0.6)] transition hover:scale-105"
          >
            <Lock className="h-4 w-4" />
            Sign in with Google
          </button>
        </div>

        {/* Hero */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl shadow-[0_28px_90px_rgba(15,23,42,0.9)]">
          <div className="grid gap-10 px-8 py-10 md:grid-cols-[1.1fr_0.9fr] md:px-12 md:py-14">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
                <Sparkles className="h-4 w-4" />
                AI-Powered Study
              </div>
              <h1 className="hero-title">
                <span className="text-slate-50">Master faster with </span>
                <span className="bg-gradient-to-r from-violet-300 via-indigo-200 to-cyan-200 bg-clip-text text-transparent">
                  intelligent guidance
                </span>
              </h1>
              <p className="text-base leading-relaxed text-slate-300 md:text-lg">
                Log in to sync your workspace, generate adaptive roadmaps, and chat with an AI tutor grounded in your own materials.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={onLogin}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 px-6 py-3 text-sm font-bold text-white shadow-glow-1 transition hover:scale-105"
                >
                  <Lock className="h-4 w-4" />
                  Sign in with Google
                  <ArrowRight className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Star className="h-4 w-4 text-amber-300" />
                  <span>Premium UI · Secure OAuth</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -left-6 bottom-0 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" />
              <div className="glass relative overflow-hidden rounded-3xl border border-white/10 p-6 shadow-[0_24px_80px_rgba(79,70,229,0.5)]">
                <div className="mb-5 flex items-center justify-between">
                  <div className="pill bg-white/5 border-white/10 text-slate-200">
                    <Sparkles className="h-4 w-4" />
                    Preview
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-violet-200">Study Flow</div>
                </div>
                <div className="space-y-4">
                  {highlights.map((item, idx) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-white/5 bg-white/5 p-3.5 text-sm text-slate-100"
                      style={{ animationDelay: `${idx * 80}ms` }}
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative overflow-hidden rounded-2xl border border-white/8 bg-slate-950/70 p-5 shadow-[0_18px_60px_rgba(15,23,42,0.9)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-white/20"
              >
                <div className="pointer-events-none absolute -right-10 -top-16 h-32 w-32 rounded-full bg-white/5 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-70" />
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-violet-200">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{f.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-cyan-500/15 px-6 py-8 text-center shadow-[0_26px_80px_rgba(15,23,42,0.9)]">
          <div className="pill border-white/20 bg-white/10 text-white">
            Ready to dive in?
          </div>
          <h3 className="text-2xl font-bold text-white">Sign in to unlock your adaptive study space</h3>
          <p className="max-w-2xl text-sm text-slate-200">
            Your materials, plans, quizzes, and tutor history are available after secure Google login. Continue to your workspace in one click.
          </p>
          <button
            onClick={onLogin}
            className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-950 shadow-[0_20px_60px_rgba(148,163,184,0.8)] transition hover:scale-105"
          >
            <Lock className="h-4 w-4" />
            Sign in with Google
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;


