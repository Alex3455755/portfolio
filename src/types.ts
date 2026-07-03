export type SeasonType = 'winter' | 'spring' | 'summer' | 'autumn';

export interface Project {
  id: string;
  title: string;
  season: SeasonType;
  tagline: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  stats: { label: string; value: string }[];
  // Interactive features shown in the mock browser window
  features: {
    title: string;
    description: string;
    preview?: any;
  }[];
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'devops' | 'tools';
  season: SeasonType;
  description: string;
}
