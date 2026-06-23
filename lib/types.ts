import type {
  MoonPhase,
  SpacePulse,
  TrendingTopic,
  AsteroidInsight
} from "./insights";

export type Category =
  | "LocalSky"
  | "Launch"
  | "Asteroid"
  | "APOD"
  | "ISS"
  | "General";

export interface Article {
  timestamp: string;
  type: string;
  source: string;
  title: string;
  aiSummary: string;
  tweet: string;
  localNote: string;
  category: Category;
  localRelevance: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  date?: string;
  excitementScore?: number;
  readingTime?: number;
}

export interface DigestBuckets {
  all: Article[];
  localSky: Article[];
  apod: Article | null;
  asteroids: Article[];
  iss: Article | null;
  launches: Article[];
  generalNews: Article[];
  topStories: Article[];
  lastUpdated: string;

  // Derived insights
  pulse: SpacePulse;
  moon: MoonPhase;
  observationQuality: { score: number; reason: string };
  visiblePlanets: { name: string; altitude: number }[];
  viewingTime: string | null;
  issCrewCount: number;
  trending: TrendingTopic[];
  asteroidInsights: AsteroidInsight[];
}
