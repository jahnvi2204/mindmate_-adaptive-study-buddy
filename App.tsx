import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import MaterialsView from './components/MaterialsView';
import PlanView from './components/PlanView';
import QuizMode from './components/QuizMode';
import TutorView from './components/TutorView';
import { AppTab, StudyMaterial, StudyPlanDay, LearningStyle, UserProfile } from './types';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [studyPlan, setStudyPlan] = useState<StudyPlanDay[]>([]);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(LearningStyle.SIMPLE);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedMats = localStorage.getItem('mindmate_materials');
      const savedPlan = localStorage.getItem('mindmate_plan');
      const savedStyle = localStorage.getItem('mindmate_style');

      if (savedMats) setMaterials(JSON.parse(savedMats));
      if (savedPlan) setStudyPlan(JSON.parse(savedPlan));
      if (savedStyle) setLearningStyle(savedStyle as LearningStyle);
    } catch (e) {
      console.warn('Failed to load from localStorage:', e);
    }
  }, []);

  // Fetch session user
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

  // Persistence helpers
  const handleAddMaterial = (material: StudyMaterial) => {
    const updated = [...materials, material];
    setMaterials(updated);
    try {
      localStorage.setItem('mindmate_materials', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const handleRemoveMaterial = (id: string) => {
    const updated = materials.filter(m => m.id !== id);
    setMaterials(updated);
    try {
      localStorage.setItem('mindmate_materials', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const handleSetPlan = (plan: StudyPlanDay[]) => {
    setStudyPlan(plan);
    try {
      localStorage.setItem('mindmate_plan', JSON.stringify(plan));
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  const handleSetStyle = (style: LearningStyle) => {
    setLearningStyle(style);
    try {
      localStorage.setItem('mindmate_style', style);
    } catch (e) {
      console.warn('Failed to save to localStorage:', e);
    }
  };

  // Render View based on Tab
  const renderContent = () => {
    switch (activeTab) {
      case AppTab.DASHBOARD:
        return (
          <Dashboard 
            materials={materials} 
            plan={studyPlan} 
            onNavigate={setActiveTab} 
          />
        );
      case AppTab.MATERIALS:
        return (
          <MaterialsView 
            materials={materials} 
            onAddMaterial={handleAddMaterial} 
            onRemoveMaterial={handleRemoveMaterial} 
          />
        );
      case AppTab.PLAN:
        return (
          <PlanView 
            materials={materials} 
            existingPlan={studyPlan} 
            onSetPlan={handleSetPlan} 
          />
        );
      case AppTab.QUIZ:
        return <QuizMode materials={materials} />;
      case AppTab.TUTOR:
        return (
          <TutorView 
            materials={materials} 
            preferences={{ learningStyle }} 
            onUpdateStyle={handleSetStyle} 
          />
        );
      default:
        return <div>Not found</div>;
    }
  };

  if (loadingUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-ambient text-slate-100">
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 shadow-lg">
          <div className="h-3 w-3 animate-ping rounded-full bg-violet-400" />
          <span className="text-sm font-semibold tracking-wide">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Home onLogin={handleLogin} />;
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;