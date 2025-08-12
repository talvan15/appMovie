import { ENV_CONFIG } from "./env";

export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  IMAGE_BASE_URL: "https://image.tmdb.org/t/p",
  API_KEY: ENV_CONFIG.TMDB_API_KEY,
};

export const TMDB_ENDPOINTS = {
  TRENDING_MOVIES: "/trending/movie/week",
  POPULAR_MOVIES: "/movie/popular",
  TOP_RATED_MOVIES: "/movie/top_rated",
  NOW_PLAYING: "/movie/now_playing",
  UPCOMING: "/movie/upcoming",
  SEARCH_MOVIES: "/search/movie",
  MOVIE_DETAILS: "/movie",
  GENRES: "/genre/movie/list",
};

export const IMAGE_SIZES = {
  POSTER: {
    SMALL: "w185",
    MEDIUM: "w342",
    LARGE: "w500",
    ORIGINAL: "original",
  },
  BACKDROP: {
    SMALL: "w300",
    MEDIUM: "w780",
    LARGE: "w1280",
    ORIGINAL: "original",
  },
};
