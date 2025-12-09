import React from 'react';
import {
  BookOpen,
  CalendarDays,
  BrainCircuit,
  Activity,
  ArrowRight,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { StudyMaterial, StudyPlanDay, AppTab } from '../types';

interface DashboardProps {
  materials: StudyMaterial[];
  plan: StudyPlanDay[];
  onNavigate: (tab: AppTab) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ materials, plan, onNavigate }) => {
  const stats = [
    {
      label: 'Materials',
      value: materials.length,
      desc: 'Documents uploaded',
      icon: BookOpen,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      action: AppTab.MATERIALS,
    },
    {
      label: 'Study Plan',
      value: plan.length > 0 ? `${plan.length} Days` : 'Inactive',
      desc: 'Current roadmap',
      icon: CalendarDays,
      color: 'text-violet-400',
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/20',
      action: AppTab.PLAN,
    },
    {
      label: 'Quiz Mode',
      value: 'Ready',
      desc: 'Test your knowledge',
      icon: BrainCircuit,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      action: AppTab.QUIZ,
    },
  ];

  return (
    <div className="relative space-y-10 pb-12 pt-4 md:pt-6 animate-fadeIn">
      {/* PREMIUM BACKGROUND + NEON BLOBS */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.12),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(16,185,129,0.16),_transparent_55%)]" />

      <div className="pointer-events-none absolute -top-32 -left-16 h-72 w-72 rounded-full bg-purple-500/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-80 w-80 rounded-full bg-cyan-400/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-fuchsia-500/10 blur-3xl" />

      {/* HERO SECTION */}
      <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.85)] border border-white/10 group transition-transform duration-700 hover:-translate-y-1">
        {/* Deep gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

        {/* Animated neon glows */}
        <div className="absolute -top-32 -right-20 h-96 w-96 rounded-full bg-violet-600/30 blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-indigo-500/30 blur-[110px] mix-blend-screen" />
        <div className="absolute top-1/3 left-10 h-40 w-40 rounded-full bg-emerald-400/10 blur-3xl mix-blend-screen" />

        <div className="relative z-10 flex flex-col items-center justify-center py-16 md:py-20 px-6 sm:px-10 text-center">
          {/* Glass card for content */}
          <div className="backdrop-blur-2xl bg-white/5 border border-white/15 rounded-[2rem] md:rounded-[2.5rem] px-6 py-10 md:px-14 md:py-14 shadow-[0_24px_80px_rgba(15,23,42,0.9)] max-w-4xl mx-auto transform transition-all duration-700 group-hover:scale-[1.015] group-hover:shadow-[0_32px_120px_rgba(79,70,229,0.65)]">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/60 border border-white/15 mb-7 shadow-inner">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-semibold tracking-[0.22em] text-slate-200 uppercase">
                System Operational
              </span>
            </div>

            {/* Gradient heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 leading-tight">
              <span className="block text-slate-50">Learn Something</span>
              <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_12px_40px_rgba(129,140,248,0.75)]">
                Extraordinary
              </span>
            </h1>

            <p className="text-slate-300 mt-4 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-light">
              Your AI-powered study companion. Upload your notes, generate adaptive plans, and master any subject
              with deeply personalized guidance.
            </p>

            {/* CTA buttons */}
            <div className="mt-9 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => onNavigate(AppTab.MATERIALS)}
                className="px-7 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white text-sm sm:text-base font-bold shadow-[0_18px_50px_rgba(79,70,229,0.8)] hover:shadow-[0_24px_70px_rgba(56,189,248,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                Start Learning
              </button>

              <button
                onClick={() => onNavigate(AppTab.TUTOR)}
                className="px-7 sm:px-8 py-3.5 rounded-full border border-white/25 bg-white/5 text-white text-sm sm:text-base font-semibold hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-xl flex items-center gap-2 shadow-[0_16px_40px_rgba(15,23,42,0.9)]"
              >
                <Sparkles className="w-5 h-5 text-violet-300" />
                AI Tutor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <button
              key={idx}
              onClick={() => onNavigate(stat.action)}
              className="group relative h-44 sm:h-48 rounded-[1.9rem] border border-white/10 bg-slate-900/40 p-[1px] overflow-hidden text-left transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:shadow-[0_18px_50px_rgba(15,23,42,0.9)]"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Inner glass card */}
              <div className="relative h-full w-full bg-slate-950/60 backdrop-blur-xl rounded-[1.8rem] p-5 flex flex-col justify-between z-10 transition-all duration-500 group-hover:bg-slate-950/30">
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`p-3.5 rounded-2xl border ${stat.bg} ${stat.border} ${stat.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:bg-white/10 transition-all duration-300">
                    <ArrowRight className="w-5 h-5 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-[0.18em]">
                    {stat.label}
                  </p>
                  <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-1 group-hover:translate-x-1 transition-transform">
                    {stat.value}
                  </h3>
                  <p className="text-[13px] font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                    {stat.desc}
                  </p>
                </div>
              </div>

              {/* Neon swipe */}
              <div className="pointer-events-none absolute -right-16 -top-20 h-40 w-40 bg-gradient-to-br from-white/40 via-purple-400/20 to-transparent blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT: PLAN + CHALLENGE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7 lg:gap-8">
        {/* Current Focus */}
        <div className="lg:col-span-2 relative rounded-[2.4rem] border border-white/10 bg-slate-950/70 backdrop-blur-2xl p-7 sm:p-8 md:p-10 overflow-hidden group shadow-[0_22px_70px_rgba(15,23,42,0.95)]">
          <div className="pointer-events-none absolute -top-10 -right-8 opacity-[0.04] group-hover:opacity-[0.09] transition-opacity duration-500 scale-150">
            <Activity className="w-64 h-64 text-white" />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-7 relative z-10">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300/80 mb-1">
                Focus Stream
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-emerald-300 bg-clip-text text-transparent">
                  Current Focus
                </span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Priority tasks from your personalized schedule.
              </p>
            </div>

            {plan.length === 0 && (
              <button
                onClick={() => onNavigate(AppTab.PLAN)}
                className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-[0_16px_40px_rgba(79,70,229,0.65)] hover:scale-105 active:scale-95"
              >
                Generate Plan
              </button>
            )}
          </div>

          {plan.length > 0 ? (
            <div className="relative z-10 bg-slate-950/70 rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-colors duration-300 shadow-[0_12px_40px_rgba(15,23,42,0.9)]">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 flex flex-col items-center justify-center shadow-[0_18px_50px_rgba(79,70,229,0.85)] text-white">
                    <span className="text-[10px] font-semibold uppercase opacity-80 mb-1 tracking-[0.18em]">
                      Day
                    </span>
                    <span className="text-3xl font-bold leading-none">{plan[0].day}</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-[0.18em] bg-violet-500/10 text-violet-200 border border-violet-500/25 mb-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                    {plan[0].focusArea}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-semibold text-white mb-4 truncate">
                    {plan[0].topic}
                  </h4>
                  <div className="space-y-3">
                    {plan[0].activities.slice(0, 3).map((act, i) => (
                      <div key={i} className="flex items-start gap-3 group/item">
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-slate-600 group-hover/item:bg-violet-400 transition-colors" />
                        <span className="text-slate-300 text-sm leading-relaxed group-hover/item:text-white transition-colors">
                          {act}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative z-10 flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-white/10 rounded-3xl bg-slate-950/40">
              <div className="w-16 h-16 rounded-full bg-slate-800/60 flex items-center justify-center mb-4 text-slate-400">
                <CalendarDays className="w-6 h-6" />
              </div>
              <p className="text-slate-300 font-medium text-sm">
                No active plan generated yet.
              </p>
              <p className="text-slate-500 text-xs mt-1">
                Create a roadmap and your focus area will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Challenge Card */}
        <div className="relative rounded-[2.4rem] p-[1px] bg-gradient-to-br from-teal-400/40 via-emerald-500/35 to-slate-800/60 group overflow-hidden shadow-[0_22px_80px_rgba(15,23,42,0.95)]">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-400 via-emerald-400 to-cyan-300 opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-700" />
          <div className="absolute -top-16 right-0 h-40 w-40 rounded-full bg-emerald-400/30 blur-3xl opacity-40" />

          <div className="relative h-full rounded-[2.2rem] bg-slate-950/85 backdrop-blur-2xl p-7 sm:p-8 flex flex-col justify-between z-10">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-6 border border-emerald-400/30 group-hover:scale-110 transition-transform duration-300 shadow-[0_12px_40px_rgba(16,185,129,0.65)]">
                <Trophy className="w-7 h-7 text-emerald-300" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent">
                  Challenge Mode
                </span>
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Ready to test your retention? Take a quick adaptive quiz generated from your uploaded notes to
                reinforce memory and spot weak areas instantly.
              </p>
            </div>

            <button
              onClick={() => onNavigate(AppTab.QUIZ)}
              className="mt-7 w-full py-3.5 rounded-xl bg-white text-slate-950 text-sm sm:text-base font-bold hover:bg-emerald-300 hover:text-slate-950 transition-all duration-200 shadow-[0_18px_50px_rgba(148,163,184,0.8)] flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-95"
            >
              Start Quiz
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
