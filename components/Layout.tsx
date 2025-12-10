import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  LayoutDashboard,
  CalendarDays,
  BrainCircuit,
  GraduationCap,
  Menu,
  X,
  Zap,
  LogOut,
  Brain,
  Sparkles,
  User,
  Loader2,
} from 'lucide-react';
import { AppTab, UserProfile } from '../types';

interface LayoutProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const navItems = [
    { id: AppTab.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: AppTab.MATERIALS, label: 'Library', icon: BookOpen },
    { id: AppTab.PLAN, label: 'Roadmap', icon: CalendarDays },
    { id: AppTab.QUIZ, label: 'Quiz Mode', icon: BrainCircuit },
    { id: AppTab.TUTOR, label: 'AI Tutor', icon: GraduationCap },
  ];

  return (
    <div className="relative flex h-screen overflow-hidden font-sans text-slate-200">
      {/* GLOBAL GRADIENT BACKGROUND + NEON BLOBS */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-slate-950 bg-[radial-gradient(circle_at_top,_rgba(129,140,248,0.18),_transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18),_transparent_60%)]" />
      <div className="pointer-events-none absolute -top-24 -left-10 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-18%] right-[-5%] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-80 w-80 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`
          glass-panel
          fixed md:relative inset-y-0 left-0 z-50
          flex w-72 flex-col justify-between
          border-r border-white/10
          bg-slate-950/70 backdrop-blur-2xl
          shadow-[0_20px_60px_rgba(15,23,42,0.95)]
          transform transition-transform duration-300 ease-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Logo Section */}
        <div className="relative p-7 pb-9">
          <div className="mb-1 flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-indigo-500 to-sky-500 shadow-[0_16px_40px_rgba(79,70,229,0.7)] ring-1 ring-white/20">
              <Brain className="h-6 w-6 text-white" />
              <span className="pointer-events-none absolute -bottom-1.5 right-1 h-3 w-3 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-white">
                MindMate
              </h1>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-violet-300">
                AI Study Sync
              </p>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Align your notes, plans, and quizzes in one intelligent workspace.
          </p>

          {/* Mobile Close */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute right-5 top-6 rounded-full p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="custom-scrollbar flex-1 space-y-3 overflow-y-auto px-4 pb-4 pt-1">
          <div className="px-4 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-500">
            Main Menu
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  group relative flex w-full items-center gap-3 rounded-xl px-4 py-3.5
                  text-left text-sm transition-all duration-300
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600/15 via-indigo-600/15 to-cyan-500/10 text-slate-50 shadow-[0_14px_40px_rgba(79,70,229,0.6)]'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                  }
                `}
              >
                {/* Active side accent */}
                {isActive && (
                  <div className="absolute left-1 top-1/2 h-9 w-1 -translate-y-1/2 rounded-full bg-gradient-to-b from-violet-400 via-indigo-400 to-cyan-300 shadow-[0_0_14px_rgba(129,140,248,0.85)]" />
                )}

                <div
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-xl border transition-all duration-300
                    ${
                      isActive
                        ? 'border-violet-400/60 bg-violet-500/20 text-violet-200'
                        : 'border-slate-700/60 bg-slate-900/60 text-slate-400 group-hover:border-slate-500 group-hover:bg-slate-900/80 group-hover:text-slate-100'
                    }
                  `}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>

                <div className="flex flex-1 items-center justify-between gap-2">
                  <span className={`truncate ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>

                  {isActive && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-200">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-300 shadow-[0_0_10px_rgba(196,181,253,0.9)]" />
                      Active
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* User Profile / Footer */}
        <div className="mt-auto border-t border-white/5 p-4">
          <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-violet-900/30 via-slate-900/60 to-indigo-900/30 p-4 shadow-[0_14px_40px_rgba(15,23,42,0.9)]">
            {/* Ambient Glow */}
            <div className="pointer-events-none absolute -right-8 -top-6 h-28 w-28 rounded-full bg-violet-500/25 blur-2xl transition-all duration-500 group-hover:bg-violet-500/30" />

            <div className="relative z-10 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-slate-900 text-slate-200">
                {user?.picture ? (
                  <img src={user.picture} alt="avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-white">
                  {loadingUser ? 'Loading...' : user?.name || 'Guest'}
                </p>
                <div className="mt-0.5 flex items-center gap-1.5 text-xs text-violet-200">
                  <Zap className="h-3 w-3 fill-current" />
                  <span>{user ? 'Signed in' : 'Sign in to sync'}</span>
                </div>
              </div>
              {loadingUser ? (
                <div className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200 flex items-center gap-1.5">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Checking</span>
                </div>
              ) : user ? (
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-200 transition-all hover:bg-white/10 active:scale-95"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={handleLogin}
                  className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition-all hover:opacity-90 active:scale-95"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="relative flex min-w-0 flex-1 flex-col">
        {/* Background Glows for Main Area */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-[-15%] left-[8%] h-[420px] w-[520px] rounded-full bg-violet-900/25 blur-[140px]" />
          <div className="absolute bottom-[-15%] right-[5%] h-[420px] w-[520px] rounded-full bg-sky-900/25 blur-[130px]" />
        </div>

        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/85 px-4 py-3 backdrop-blur-2xl md:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-500">
              <BrainCircuit className="h-4.5 w-4.5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">MindMate</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-slate-400">
                Study Dashboard
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden items-center justify-between border-b border-white/5 bg-slate-950/70 px-8 py-4 backdrop-blur-2xl md:flex z-20">
          <div className="flex items-center gap-3">
            <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              Focus Session
            </div>
            <span className="text-xs text-slate-400">
              Optimize your session with dashboard, roadmap & quiz in sync.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur hover:bg-white/10 lg:flex">
              <Zap className="h-3.5 w-3.5 text-amber-300" />
              Quick Start
            </button>
            <button className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur hover:bg-white/10">
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </button>
          </div>
        </header>

        {/* Content Scroll Wrapper */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scroll-smooth px-4 py-4 md:px-8 md:py-8 lg:px-10 lg:py-10">
          <div className="mx-auto h-full max-w-7xl animate-fadeIn">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;

