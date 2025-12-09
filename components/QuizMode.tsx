import React, { useState } from 'react';
import {
  Play,
  Check,
  X,
  ArrowRight,
  BrainCircuit,
  RefreshCw,
  Trophy,
  Zap,
} from 'lucide-react';
import { QuizQuestion, StudyMaterial } from '../types';
import { generateQuiz } from '../services/geminiService';

interface QuizModeProps {
  materials: StudyMaterial[];
}

const QuizMode: React.FC<QuizModeProps> = ({ materials }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = async () => {
    if (materials.length === 0) return;
    setLoading(true);
    try {
      const qs = await generateQuiz(materials);
      setQuestions(qs);
      setCurrentIndex(0);
      setScore(0);
      setQuizFinished(false);
      setSelectedOption(null);
      setShowExplanation(false);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === questions[currentIndex].correctAnswerIndex) {
      setScore((s) => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-6 animate-fadeIn">
        {/* Local background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-[10%] h-64 w-64 rounded-full bg-violet-600/30 blur-3xl" />
          <div className="absolute bottom-[-20%] right-[5%] h-72 w-72 rounded-full bg-indigo-500/25 blur-[110px]" />
        </div>

        <div className="relative mb-10">
          <div className="absolute inset-0 rounded-full bg-violet-500/40 blur-[50px] opacity-60 animate-pulse" />
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-violet-500/40 bg-slate-950 shadow-[0_20px_60px_rgba(79,70,229,0.8)]">
            <RefreshCw className="h-10 w-10 animate-spin text-violet-300" />
          </div>
        </div>
        <h3 className="mb-2 text-3xl md:text-4xl font-bold tracking-tight text-white">
          Generating Quiz
        </h3>
        <p className="text-base md:text-lg text-slate-400">
          Synthesizing questions from your library in real time...
        </p>
      </div>
    );
  }

  // --- Start Screen ---
  if (questions.length === 0) {
    const disabled = materials.length === 0;

    return (
      <div className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden px-6 text-center animate-fadeIn">
        {/* Background glows */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 left-[15%] h-72 w-72 rounded-full bg-violet-600/25 blur-[100px]" />
          <div className="absolute bottom-[-20%] right-[10%] h-72 w-72 rounded-full bg-indigo-500/25 blur-[110px]" />
        </div>

        <div className="group relative mb-12 cursor-default">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 blur-[100px] opacity-25 transition-opacity duration-700 group-hover:opacity-35" />
          <div className="relative rounded-[3rem] border border-white/10 bg-slate-950/80 p-14 shadow-[0_26px_80px_rgba(15,23,42,0.98)] backdrop-blur-2xl transition-transform duration-500 group-hover:scale-105">
            <BrainCircuit className="h-24 w-24 text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.5)]" />
          </div>
        </div>

        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-500/40 bg-violet-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
          <Zap className="h-3.5 w-3.5 text-amber-300" />
          Active Recall Engine
        </div>

        <h2 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-violet-200 via-white to-cyan-200 bg-clip-text text-transparent">
            Active Recall
          </span>
        </h2>
        <p className="mb-10 max-w-xl text-base md:text-lg leading-relaxed text-slate-400 font-light">
          Transform passive reading into sharp, targeted practice. Generate an instant quiz tailored
          to your exact notes and materials.
        </p>

        <button
          onClick={startQuiz}
          disabled={disabled}
          className={`
            group relative overflow-hidden rounded-full px-12 py-4 text-lg font-bold
            transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.25)]
            ${disabled ? 'cursor-not-allowed opacity-60 shadow-none' : 'hover:scale-105'}
            bg-white text-slate-950
          `}
        >
          <span className="relative z-10 flex items-center gap-3">
            {disabled ? 'Add Materials First' : 'Start Session'}
            {!disabled && <Play className="h-5 w-5 fill-current" />}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200 via-indigo-200 to-cyan-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </button>
      </div>
    );
  }

  // --- Results Screen ---
  if (quizFinished) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="relative mx-auto max-w-3xl pt-10 animate-fadeIn">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-28 left-[10%] h-72 w-72 rounded-full bg-violet-600/25 blur-[110px]" />
          <div className="absolute bottom-[-25%] right-[5%] h-80 w-80 rounded-full bg-amber-400/25 blur-[110px]" />
        </div>

        <div className="relative overflow-hidden rounded-[3rem] border border-white/12 bg-slate-950/90 p-10 md:p-16 shadow-[0_30px_90px_rgba(15,23,42,0.98)] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500 via-white to-amber-400 opacity-70" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/15 blur-[130px]" />

          <div className="relative z-10 text-center">
            <div className="mx-auto mb-10 flex h-28 w-28 rotate-3 items-center justify-center rounded-[2rem] bg-gradient-to-br from-amber-400 to-rose-500 shadow-[0_22px_60px_rgba(251,191,36,0.7)] transition-transform hover:rotate-6">
              <Trophy className="h-14 w-14 text-white" />
            </div>

            <h2 className="mb-2 text-4xl md:text-5xl font-bold tracking-tight text-white">
              Session Complete
            </h2>
            <p className="mb-10 text-base md:text-lg text-slate-400">
              Here’s how your recall stacked up.
            </p>

            <div className="mx-auto mb-12 grid max-w-lg grid-cols-2 gap-5 text-left">
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-7 backdrop-blur">
                <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Accuracy
                </div>
                <div className="text-5xl md:text-6xl font-black text-white">{percentage}%</div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-950/90 p-7 backdrop-blur">
                <div className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                  Score
                </div>
                <div className="text-5xl md:text-6xl font-black text-violet-400">
                  {score}/{questions.length}
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="inline-flex items-center gap-3 rounded-full bg-white px-11 py-4 text-sm md:text-base font-bold text-slate-950 shadow-[0_20px_60px_rgba(148,163,184,0.9)] transition-all hover:bg-slate-100 hover:scale-105"
            >
              <RefreshCw className="h-5 w-5" />
              Start New Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  // --- Question Screen ---
  return (
    <div className="relative mx-auto max-w-4xl space-y-8 pt-4 animate-fadeIn">
      {/* Local background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-[10%] h-72 w-72 rounded-full bg-violet-600/25 blur-[110px]" />
        <div className="absolute bottom-[-25%] right-[10%] h-80 w-80 rounded-full bg-indigo-500/25 blur-[120px]" />
      </div>

      {/* Header Info */}
      <div className="flex items-center justify-between px-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Question {currentIndex + 1} of {questions.length}
          </span>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/35 bg-violet-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-violet-200">
            <BrainCircuit className="h-3.5 w-3.5" />
            Active Recall
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/80 px-4 py-2 text-xs font-bold text-slate-100 shadow-[0_12px_35px_rgba(15,23,42,0.9)]">
          <Zap className="h-4 w-4 text-yellow-400 fill-current" />
          <span>Score: {score}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mx-4 max-w-[calc(100%-2rem)] overflow-hidden rounded-full border border-white/10 bg-slate-950/80">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-400 shadow-[0_0_16px_rgba(129,140,248,0.8)] transition-all duration-500 ease-out"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Main Card */}
      <div className="relative min-h-[480px] overflow-hidden rounded-[3rem] border border-white/12 bg-slate-950/85 shadow-[0_26px_80px_rgba(15,23,42,0.98)] backdrop-blur-2xl">
        {/* Soft gradient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 right-[-10%] h-72 w-72 rounded-full bg-violet-500/20 blur-[120px]" />
          <div className="absolute bottom-[-30%] left-[5%] h-80 w-80 rounded-full bg-indigo-500/20 blur-[130px]" />
        </div>

        <div className="relative z-10 flex flex-1 flex-col p-8 md:p-12 lg:p-14">
          {/* Question Text */}
          <h3 className="mb-10 text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-white">
            {currentQ.question}
          </h3>

          {/* Options Grid */}
          <div className="mt-auto grid grid-cols-1 gap-4">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctAnswerIndex;

              let btnClass =
                'border-white/8 bg-slate-950/70 text-slate-200 hover:bg-slate-900 hover:border-white/20 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.9)]';

              if (selectedOption !== null) {
                if (isCorrect) {
                  btnClass =
                    'bg-emerald-500/15 border-emerald-400/70 text-emerald-100 shadow-[0_0_22px_rgba(16,185,129,0.45)]';
                } else if (isSelected) {
                  btnClass =
                    'bg-red-500/15 border-red-400/70 text-red-100 shadow-[0_0_20px_rgba(248,113,113,0.4)]';
                } else {
                  btnClass = 'pointer-events-none border-transparent bg-slate-900/60 text-slate-500 opacity-30';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`
                    group flex w-full items-center justify-between rounded-2xl border-2 px-5 py-5 text-left text-base md:text-lg lg:text-xl font-medium
                    transition-all duration-200
                    ${btnClass}
                  `}
                >
                  <span className="pr-4">{option}</span>
                  {selectedOption !== null && isCorrect && (
                    <Check className="h-6 w-6 flex-shrink-0 text-emerald-400" />
                  )}
                  {selectedOption !== null && isSelected && !isCorrect && (
                    <X className="h-6 w-6 flex-shrink-0 text-red-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Footer */}
        {showExplanation && (
          <div className="relative z-20 border-t border-white/12 bg-slate-950/90 px-8 py-7 md:px-12 md:py-9">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-400 shadow-[0_0_10px_rgba(167,139,250,0.9)]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-violet-300">
                Explanation
              </span>
            </div>

            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <p className="flex-1 text-sm md:text-base leading-relaxed text-slate-200">
                {currentQ.explanation}
              </p>
              <button
                onClick={nextQuestion}
                className="inline-flex flex-shrink-0 items-center gap-3 rounded-full bg-white px-8 py-3 text-sm md:text-base font-bold text-slate-950 shadow-[0_18px_50px_rgba(148,163,184,0.9)] transition-all hover:scale-105 hover:bg-slate-100"
              >
                <span>{currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizMode;
