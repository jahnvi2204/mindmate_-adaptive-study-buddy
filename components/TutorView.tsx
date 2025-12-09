import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  User,
  Bot,
  Sparkles,
  BookOpen,
  MessageSquare,
} from 'lucide-react';
import { StudyMaterial, ChatMessage, LearningStyle } from '../types';
import { explainTopic } from '../services/geminiService';

interface TutorViewProps {
  materials: StudyMaterial[];
  preferences: { learningStyle: LearningStyle };
  onUpdateStyle: (style: LearningStyle) => void;
}

const TutorView: React.FC<TutorViewProps> = ({
  materials,
  preferences,
  onUpdateStyle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'intro',
      role: 'model',
      content:
        "Hey, I'm your AI Tutor. I’ll adapt to your notes and learning style.\n\nAsk me to explain a concept, summarize a topic, or quiz you on what you’ve learned.",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    const history = messages.map((m) => ({
      role: m.role,
      parts: [{ text: m.content }],
    }));

    try {
      const responseText = await explainTopic(
        userMsg.content,
        materials,
        preferences.learningStyle,
        history,
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="relative mx-auto flex h-[calc(100vh-6rem)] max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-white/12 bg-slate-950/85 shadow-[0_28px_90px_rgba(15,23,42,0.98)] backdrop-blur-2xl md:h-[calc(100vh-4rem)] animate-fadeIn">
      {/* Section background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 left-[5%] h-72 w-72 rounded-full bg-violet-600/25 blur-[120px]" />
        <div className="absolute top-[45%] right-[-10%] h-80 w-80 rounded-full bg-indigo-500/25 blur-[130px]" />
        <div className="absolute bottom-[-25%] left-[30%] h-80 w-80 rounded-full bg-cyan-400/20 blur-[120px]" />
      </div>

      {/* Sticky Glass Header */}
      <div className="absolute inset-x-0 top-0 z-30 flex h-24 items-center justify-between border-b border-white/10 bg-slate-950/90 px-6 md:px-8 backdrop-blur-2xl">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-[0_18px_50px_rgba(79,70,229,0.8)] ring-2 ring-white/15">
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-4 border-slate-950 bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.95)]" />
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-base font-bold leading-none text-white md:text-lg">
              AI Tutor
            </h3>
            <div className="inline-flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Context aware
              </span>
              <span className="h-1 w-1 rounded-full bg-slate-500" />
              <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-slate-400">
                Personalized
              </span>
            </div>
          </div>
        </div>

        {/* Style Selector + hint */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 rounded-xl border border-white/12 bg-black/40 px-3 py-2 text-xs text-slate-200 md:flex">
            <Sparkles className="h-4 w-4 text-violet-300" />
            <span className="hidden text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400 lg:inline">
              Learning style
            </span>
            <select
              value={preferences.learningStyle}
              onChange={(e) => onUpdateStyle(e.target.value as LearningStyle)}
              className="ml-1 min-w-[120px] cursor-pointer border-none bg-transparent text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-100 outline-none focus:ring-0"
            >
              {Object.values(LearningStyle).map((style) => (
                <option
                  key={style}
                  value={style}
                  className="bg-slate-950 text-slate-100"
                >
                  {style}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="custom-scrollbar flex-1 space-y-7 overflow-y-auto px-4 pb-6 pt-28 md:px-8 md:pt-32">
        {materials.length === 0 && (
          <div className="mx-auto mb-4 max-w-md rounded-3xl border border-amber-400/25 bg-amber-500/10 p-5 text-center shadow-[0_18px_45px_rgba(180,83,9,0.4)]">
            <BookOpen className="mx-auto mb-3 h-7 w-7 text-amber-300" />
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-200">
              No notes detected
            </p>
            <p className="mt-2 text-sm leading-relaxed text-amber-100/90">
              I&apos;ll use my general knowledge for now. Upload your notes to make
              explanations laser-focused on your syllabus.
            </p>
          </div>
        )}

        {/* Small hint row */}
        <div className="mx-auto flex max-w-xl items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-slate-500">
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Try: &quot;Explain this like I&apos;m 15&quot; or &quot;Quiz me on X&quot;</span>
        </div>

        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-4 ${
                isUser ? 'flex-row-reverse' : ''
              } animate-fadeIn`}
            >
              {/* Avatar */}
              {isUser ? (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/12 bg-slate-900">
                  <User className="h-5 w-5 text-slate-300" />
                </div>
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-[0_16px_40px_rgba(79,70,229,0.9)]">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}

              {/* Bubble */}
              <div
                className={`
                  group relative max-w-[85%] rounded-[24px] px-6 py-4 text-[15px] leading-7 shadow-sm md:max-w-[75%]
                  ${
                    isUser
                      ? 'rounded-br-none bg-white text-slate-950 font-medium'
                      : 'rounded-bl-none border border-white/12 bg-black/30 text-slate-100'
                  }
                `}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <span
                  className={`
                    absolute bottom-2 text-[10px] opacity-0 transition-opacity group-hover:opacity-40
                    ${isUser ? 'left-4 text-slate-800' : 'right-4 text-slate-400'}
                  `}
                >
                  Just now
                </span>
              </div>
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-end gap-4 animate-fadeIn">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 via-indigo-500 to-cyan-400 shadow-[0_14px_36px_rgba(79,70,229,0.8)]">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="rounded-[24px] rounded-bl-none border border-white/12 bg-black/30 px-5 py-4">
              <div className="flex space-x-2">
                <div
                  className="h-2 w-2 rounded-full bg-slate-500 animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="h-2 w-2 rounded-full bg-slate-500 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="h-2 w-2 rounded-full bg-slate-500 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input Area */}
      <div className="relative z-30 border-t border-white/10 bg-slate-950/90 px-4 py-5 backdrop-blur-2xl md:px-8 md:py-6">
        <form
          onSubmit={handleSendMessage}
          className="mx-auto flex max-w-4xl items-center gap-3 md:gap-4"
        >
          <div className="group relative flex-1">
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-400 opacity-0 blur-xl transition-opacity duration-500 group-focus-within:opacity-20 group-hover:opacity-15" />
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question, request an explanation, or say “quiz me on chapter 3...”"
              className="relative w-full rounded-2xl border border-white/15 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 shadow-inner focus:border-violet-400/70 focus:bg-slate-950"
            />
          </div>
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="inline-flex items-center justify-center rounded-2xl bg-white p-3 text-slate-950 shadow-[0_0_26px_rgba(255,255,255,0.3)] transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TutorView;
