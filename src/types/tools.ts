export type ToolCategory =
  | 'ai-writing'
  | 'pdf-tools'
  | 'image-tools'
  | 'ai-social'
  | 'student-tools'
  | 'text-tools'
  | 'text-design';

export interface ToolCategoryInfo {
  id: ToolCategory;
  name: string;
  shortName: string;
  description: string;
  iconName: string;
  imageUrl?: string;
}

export interface ToolOptionChoice {
  label: string;
  value: string;
}

export interface ToolOptionConfig {
  id: string;
  label: string;
  type: 'select' | 'radio' | 'text' | 'number' | 'toggle';
  defaultValue: string | number | boolean;
  options?: ToolOptionChoice[];
  placeholder?: string;
  helperText?: string;
}

export interface ToolExample {
  title: string;
  input: string;
  options?: Record<string, string | number | boolean>;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export type ToolType = 'ai' | 'text-utility' | 'pdf' | 'image' | 'student' | 'text-design';

export interface ToolDefinition {
  slug: string;
  title: string;
  category: ToolCategory;
  toolType: ToolType;
  shortDescription: string;
  fullDescription: string;
  icon: string;
  isAi: boolean;
  isFreeClientSide: boolean;
  badge?: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  secondaryInputLabel?: string;
  secondaryInputPlaceholder?: string;
  options?: ToolOptionConfig[];
  defaultWordCountTarget?: number;
  examples: ToolExample[];
  instructions: string[];
  faqs: ToolFaq[];
  relatedSlugs: string[];
  outputType?: 'text' | 'list' | 'analysis' | 'file';
  isPremiumOnly?: boolean;
}

export interface ReadabilityMetrics {
  fleschReadingEase: number;
  fleschKincaidGrade: number;
  automatedReadabilityIndex: number;
  readingEaseDescription: string;
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  syllables: number;
  complexWords: number;
  readingTimeMinutes: number;
  speakingTimeMinutes: number;
  avgWordsPerSentence: number;
  avgSyllablesPerWord: number;
}

export interface GrammarIssue {
  id: string;
  offset: number;
  length: number;
  originalText: string;
  suggestion: string;
  message: string;
  type: 'spelling' | 'grammar' | 'style' | 'punctuation';
}

export interface AiGenerateRequest {
  toolSlug: string;
  input: string;
  secondaryInput?: string;
  options?: Record<string, string | number | boolean>;
  mode?: 'generate' | 'improve' | 'rewrite' | 'shorten' | 'expand';
}

export interface AiGenerateResponse {
  success: boolean;
  output?: string;
  tokensUsed?: number;
  error?: string;
  requiresKey?: boolean;
}

// User & Subscription Types
export type SubscriptionTier = 'free' | 'premium';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  subscriptionTier: SubscriptionTier;
  aiUsageCountToday: number;
  dailyAiLimit: number;
  savedToolsCount: number;
  createdAt: string;
  planRenewalDate?: string;
}
