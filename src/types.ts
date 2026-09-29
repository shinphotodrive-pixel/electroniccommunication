export type CategoryType = 'all' | 'theory' | 'semicon' | 'conversion' | 'rf' | 'info' | 'optical6g' | 'power' | 'calc';

export interface MaxwellEquation {
  id: string;
  number: number;
  name: string;
  nameEn: string;
  formula: string;
  meaning: string;
  application: string;
  badge: string;
  accentColor: string;
}

export interface SemiconductorData {
  name: string;
  type: string;
  mechanism: string;
  limitation: string;
  application: string;
  highlight?: boolean;
}

export interface InterconnectData {
  title: string;
  titleEn: string;
  badge: string;
  badgeColor: string;
  distance: string;
  features: string;
  advantages: string;
  limitations: string;
  application: string;
}

export interface KnowledgeItem {
  id: string;
  cat: 'theory' | 'semicon' | 'conversion' | 'rf' | 'info' | 'optical6g' | 'power';
  catLabel: string;
  title: string;
  eq: string;
  desc: string;
  tags: string[];
}

export interface QuizQuestion {
  id: number;
  q: string;
  options: string[];
  ans: number;
  explain: string;
  category: string;
}

export interface GlossaryTerm {
  id: string;
  termKo: string;
  termEn: string;
  acronym?: string;
  category: CategoryType;
  sectionTitle: string;
  definition: string;
  keyPoints: string[];
  formulaOrSpec?: string;
}
