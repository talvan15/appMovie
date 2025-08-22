import axios from "axios";

const API_KEY = "SUA API KEY"; // Substitua pela sua chave da API do TMDB
const BASE_URL = "https://api.themoviedb.org/3";

export const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: "pt-BR",
    include_adult: false,
  },
  timeout: 10000,
});

export const getPopularMovies = async (page = 1) => {
  const response = await api.get("/movie/popular", { params: { page } });
  return response.data.results;
};

export const getTopRatedMovies = async (page = 1) => {
  const response = await api.get("/movie/top_rated", { params: { page } });
  return response.data.results;
};

export const getUpcomingMovies = async (page = 1) => {
  const response = await api.get("/movie/upcoming", { params: { page } });
  return response.data.results;
};

export const getMovieDetails = (id: number) => api.get(`/movie/${id}`);

export const searchMovies = async (query: string, page = 1) => {
  const response = await api.get("/search/movie", { params: { query, page } });
  return response.data.results;
};
