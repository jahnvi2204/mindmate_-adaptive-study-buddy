import React, { useState } from 'react';
import {
  Calendar,
  RefreshCw,
  CheckCircle2,
  Clock,
  Zap,
  AlertCircle,
} from 'lucide-react';
import { StudyPlanDay, StudyMaterial } from '../types';
import { generateStudyPlan } from '../services/geminiService';

interface PlanViewProps {
  materials: StudyMaterial[];
  existingPlan: StudyPlanDay[];
  onSetPlan: (plan: StudyPlanDay[]) => void;
}

const PlanView: React.FC<PlanViewProps> = ({ materials, existingPlan, onSetPlan }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (materials.length === 0) {
      setError('Please add study materials first.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const plan = await generateStudyPlan(materials);
      onSetPlan(plan);
    } catch (err) {
      setError('Failed to generate plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative mx-auto max-w-5xl space-y-12 pb-20 pt-2 animate-fadeIn">
      {/* Local background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-[5%] h-64 w-64 rounded-full bg-violet-600/25 blur-3xl" />
        <div className="absolute top-[40%] right-[-10%] h-72 w-72 rounded-full bg-indigo-500/25 blur-[110px]" />
        <div className="absolute bottom-[-20%] left-[30%] h-72 w-72 rounded-full bg-cyan-400/20 blur-[110px]" />
      </div>

      {/* Header */}
      <div className="flex flex-col justify-between gap-8 border-b border-white/8 pb-8 md:flex-row md:items-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]" />
            Smart Roadmap
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight text-white">
            <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
              Roadmap
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            An AI-crafted, day-by-day path from where you are to where you want to be.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || materials.length === 0}
          className={`
            inline-flex items-center justify-center gap-3 rounded-full px-8 py-3.5 text-sm font-bold text-white
            transition-all duration-300 transform
            ${
              loading
                ? 'bg-slate-900/80 cursor-wait border border-slate-700/60'
                : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 shadow-[0_18px_50px_rgba(79,70,229,0.75)] hover:scale-105 hover:shadow-[0_24px_70px_rgba(56,189,248,0.8)]'
            }
            ${materials.length === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}
          `}
        >
          {loading ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Constructing Plan...</span>
            </>
          ) : (
            <>
              <Zap className="h-5 w-5 fill-current" />
              <span>{existingPlan.length > 0 ? 'Regenerate Path' : 'Generate Roadmap'}</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200 shadow-[0_16px_40px_rgba(127,29,29,0.5)]">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Empty State */}
      {existingPlan.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="group relative mb-8">
            <div className="absolute inset-0 rounded-full bg-violet-600/25 blur-[60px] opacity-30 group-hover:opacity-40 transition-opacity" />
            <div className="relative flex h-28 w-28 rotate-3 items-center justify-center rounded-[2rem] border border-white/10 bg-slate-950/90 shadow-[0_20px_60px_rgba(15,23,42,0.95)] group-hover:rotate-6 transition-transform duration-500">
              <Calendar className="h-12 w-12 text-violet-400" />
            </div>
          </div>
          <h3 className="mb-3 text-3xl font-bold tracking-tight text-white">No Active Plan</h3>
          <p className="max-w-lg text-base leading-relaxed text-slate-400">
            Upload your materials and let the AI break them into a focused, day-by-day roadmap that balances
            revision, concepts, and problem practice.
          </p>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-10 pl-3 md:pl-0 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-7 md:gap-10">
              <div className="relative flex flex-shrink-0 flex-col items-center">
                <div className="h-11 w-11 rounded-full border border-slate-700 bg-slate-900" />
                <div className="absolute top-11 bottom-0 w-0.5 bg-slate-800" />
              </div>
              <div className="h-44 flex-1 rounded-[2rem] border border-white/8 bg-slate-950/70" />
            </div>
          ))}
        </div>
      )}

      {/* Timeline View */}
      {!loading && existingPlan.length > 0 && (
        <div className="relative space-y-0">
          {existingPlan.map((day, index) => {
            const isFirst = index === 0;
            const isLast = index === existingPlan.length - 1;

            return (
              <div
                key={index}
                className="group relative flex gap-6 md:gap-10"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                {/* Timeline Line & Dot */}
                <div className="relative flex flex-shrink-0 flex-col items-center">
                  <div
                    className={`
                      z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-lg font-bold shadow-[0_0_18px_rgba(15,23,42,0.9)]
                      transition-all duration-300
                      ${
                        isFirst
                          ? 'scale-110 bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 border-violet-300 text-white shadow-[0_0_40px_rgba(129,140,248,0.9)]'
                          : 'bg-[#020617]/95 border-slate-800 text-slate-500 group-hover:border-violet-500 group-hover:text-violet-300'
                      }
                    `}
                  >
                    {day.day}
                  </div>

                  {!isLast && (
                    <div className="absolute top-12 bottom-0 w-0.5 bg-slate-800 transition-colors group-hover:bg-slate-700" />
                  )}
                </div>

                {/* Content Card */}
                <div className="flex-1 pb-14">
                  <div
                    className={`
                      relative overflow-hidden rounded-[2.1rem] border p-7 md:p-9 transition-all duration-300 group/card
                      ${
                        isFirst
                          ? 'border-violet-500/40 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 shadow-[0_24px_65px_rgba(79,70,229,0.7)]'
                          : 'border-white/8 bg-slate-950/70 hover:border-white/15 hover:bg-slate-950/85 shadow-[0_18px_55px_rgba(15,23,42,0.95)]'
                      }
                    `}
                  >
                    {isFirst && (
                      <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-violet-500/20 blur-[100px]" />
                    )}

                    {/* Header row */}
                    <div className="relative mb-7 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="mb-3 flex items-center gap-3">
                          <span
                            className={`text-[11px] font-bold uppercase tracking-[0.18em] ${
                              isFirst ? 'text-violet-300' : 'text-slate-500'
                            }`}
                          >
                            {isFirst ? 'Current Focus' : 'Upcoming'}
                          </span>
                          {isFirst && (
                            <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.9)]" />
                          )}
                        </div>
                        <h3 className="mb-2 text-2xl md:text-3xl font-bold tracking-tight text-white">
                          {day.topic}
                        </h3>
                        <div className="flex items-center text-xs font-medium text-slate-400">
                          <Clock className="mr-2 h-4 w-4" />
                          ~2 Hours Est.
                        </div>
                      </div>

                      <span className="self-start rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-200 backdrop-blur-md">
                        {day.focusArea}
                      </span>
                    </div>

                    {/* Activities */}
                    <div className="relative z-10 space-y-4">
                      <div className="mb-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                      <ul className="grid gap-3.5">
                        {day.activities.map((activity, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-4 rounded-2xl px-3 py-2.5 transition-colors duration-200 hover:bg-white/5"
                          >
                            <div className="mt-[3px] flex-shrink-0">
                              <CheckCircle2
                                className={`h-5 w-5 ${
                                  isFirst
                                    ? 'text-violet-400'
                                    : 'text-slate-700 group-hover/card:text-slate-500'
                                }`}
                              />
                            </div>
                            <span className="text-sm font-medium leading-relaxed text-slate-200">
                              {activity}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlanView;
