export enum LearningStyle {
  SIMPLE = 'Simple & Direct',
  DETAILED = 'Detailed Academic',
  ANALOGY = 'Analogy Based',
  SOCHRATIC = 'Socratic Method'
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  MATERIALS = 'materials',
  PLAN = 'plan',
  QUIZ = 'quiz',
  TUTOR = 'tutor'
}

export interface StudyMaterial {
  id: string;
  title: string;
  content: string;
  dateAdded: number;
  type: 'text' | 'file';
}

export interface StudyPlanDay {
  day: number;
  topic: string;
  activities: string[];
  focusArea: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface UserPreferences {
  learningStyle: LearningStyle;
  streak: number;
  lastStudyDate: number | null;
}

export interface UserProfile {
  sub: string;
  name?: string;
  email?: string;
  picture?: string;
}