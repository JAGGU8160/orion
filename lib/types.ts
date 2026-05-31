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
}

export interface DigestBuckets {
  all: Article[];
  localSky: Article[];
  apod: Article | null;
  asteroids: Article[];
  iss: Article | null;
  news: Article[];
  lastUpdated: string;
}
