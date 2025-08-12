import { useCallback, useEffect, useState } from "react";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
} from "../services/tmdbApi";
import { Movie } from "../types/movie";

// Função para converter ID do gênero em nome
const getGenreName = (genreId: number): string => {
  const genres: { [key: number]: string } = {
    28: "Ação",
    12: "Aventura",
    16: "Animação",
    35: "Comédia",
    80: "Crime",
    99: "Documentário",
    18: "Drama",
    10751: "Família",
    14: "Fantasia",
    36: "História",
    27: "Terror",
    10402: "Música",
    9648: "Mistério",
    10749: "Romance",
    878: "Ficção Científica",
    10770: "Filme para TV",
    53: "Suspense",
    10752: "Guerra",
    37: "Western",
  };
  return genres[genreId] || "Ação";
};

export const useMovies = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [newMovies, setNewMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [upcomingMovies, setUpcomingMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [popularPage, setPopularPage] = useState(1);
  const [topRatedPage, setTopRatedPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);

  const convertApiMovieToDomain = (movie: any): Movie => ({
    id: movie.id.toString(),
    title: movie.title,
    year: new Date(movie.release_date).getFullYear(),
    genre:
      movie.genre_ids?.length > 0 ? getGenreName(movie.genre_ids[0]) : "Ação",
    poster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    description: movie.overview || "Sem descrição",
    rating: movie.vote_average,
  });

  const appendAndDedup = (current: Movie[], next: Movie[]): Movie[] => {
    const seen = new Set(current.map((m) => m.id));
    const merged: Movie[] = [...current];
    for (const m of next) {
      if (!seen.has(m.id)) {
        merged.push(m);
        seen.add(m.id);
      }
    }
    return merged;
  };

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar filmes populares para a lista principal
      const popularMovies = await getPopularMovies();

      // Buscar filmes em destaque (top rated) para o carrossel
      const topRatedMovies = await getTopRatedMovies();

      // Buscar filmes que estão por vir (estreias)
      const upcomingMovies = await getUpcomingMovies();

      // Converter para o formato da interface com gêneros reais
      const convertedPopular = popularMovies.map(convertApiMovieToDomain);

      const convertedTopRated = topRatedMovies.map(convertApiMovieToDomain);

      const convertedUpcoming = upcomingMovies.map(convertApiMovieToDomain);

      // Definir filmes para cada categoria
      setMovies(convertedPopular); // Popular (padrão)
      setFeaturedMovies(convertedTopRated.slice(0, 5)); // Em destaque (top 5)
      setTopRatedMovies(convertedTopRated); // Melhores (todos)
      setUpcomingMovies(convertedUpcoming); // Estreias
      setNewMovies(convertedUpcoming.slice(0, 20)); // Novos (primeiros 20 das estreias)

      // resetar paginações
      setPopularPage(1);
      setTopRatedPage(1);
      setUpcomingPage(1);
    } catch (err) {
      setError("Erro ao carregar filmes");
      console.error("Error loading movies:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMorePopular = useCallback(async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = popularPage + 1;
      const more = await getPopularMovies(nextPage);
      const converted = more.map(convertApiMovieToDomain);
      setMovies((prev) => appendAndDedup(prev, converted));
      setPopularPage(nextPage);
    } catch (err) {
      console.error("Error loading more popular movies:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, popularPage]);

  const loadMoreTopRated = useCallback(async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = topRatedPage + 1;
      const more = await getTopRatedMovies(nextPage);
      const converted = more.map(convertApiMovieToDomain);
      setTopRatedMovies((prev) => appendAndDedup(prev, converted));
      setTopRatedPage(nextPage);
    } catch (err) {
      console.error("Error loading more top rated movies:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, topRatedPage]);

  const loadMoreUpcoming = useCallback(async () => {
    if (isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const nextPage = upcomingPage + 1;
      const more = await getUpcomingMovies(nextPage);
      const converted = more.map(convertApiMovieToDomain);
      setUpcomingMovies((prev) => {
        const updated = appendAndDedup(prev, converted);
        // manter "Novo" em sincronia com as estreias
        setNewMovies(updated);
        return updated;
      });
      setUpcomingPage(nextPage);
    } catch (err) {
      console.error("Error loading more upcoming movies:", err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, upcomingPage]);

  const searchMoviesByQuery = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        return [];
      }

      try {
        // Resultados locais (rápido) + remotos (completos)
        const local = [
          ...movies,
          ...featuredMovies,
          ...topRatedMovies,
          ...upcomingMovies,
          ...newMovies,
        ];

        const localFiltered = local.filter((movie) => {
          const searchTerm = query.toLowerCase();
          return (
            movie.title.toLowerCase().includes(searchTerm) ||
            movie.genre.toLowerCase().includes(searchTerm) ||
            movie.description.toLowerCase().includes(searchTerm)
          );
        });

        const remote = await searchMovies(query, 1);
        const remoteConverted: Movie[] = remote.map((m: any) => ({
          id: m.id.toString(),
          title: m.title,
          year: m.release_date ? new Date(m.release_date).getFullYear() : 0,
          genre: m.genre_ids?.length ? getGenreName(m.genre_ids[0]) : "Ação",
          poster: m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : "",
          description: m.overview || "Sem descrição",
          rating: m.vote_average ?? 0,
        }));

        // Deduplicar com prioridade para itens locais
        const mapById = new Map<string, Movie>();
        for (const m of localFiltered) mapById.set(m.id, m);
        for (const m of remoteConverted)
          if (!mapById.has(m.id)) mapById.set(m.id, m);

        return Array.from(mapById.values());
      } catch (err) {
        console.error("Error searching movies:", err);
        return [];
      }
    },
    [movies, featuredMovies, topRatedMovies, upcomingMovies, newMovies]
  );

  const getMovieById = useCallback(
    async (id: string) => {
      try {
        // Buscar em todas as categorias
        const allMovies = [
          ...movies,
          ...featuredMovies,
          ...topRatedMovies,
          ...upcomingMovies,
          ...newMovies,
        ];
        const movie = allMovies.find((m) => m.id === id);
        return movie || null;
      } catch (err) {
        setError("Erro ao carregar detalhes do filme");
        console.error("Error loading movie details:", err);
        return null;
      }
    },
    [movies, featuredMovies, topRatedMovies, upcomingMovies, newMovies]
  );

  const loadMoviesByGenre = useCallback(
    async (genre: string) => {
      try {
        setLoading(true);
        // Filtrar filmes por gênero de todas as categorias
        const allMovies = [
          ...movies,
          ...topRatedMovies,
          ...upcomingMovies,
          ...newMovies,
        ];
        const genreMovies = allMovies.filter((movie) =>
          movie.genre.toLowerCase().includes(genre.toLowerCase())
        );
        return genreMovies;
      } catch (err) {
        setError("Erro ao carregar filmes por gênero");
        console.error("Error loading movies by genre:", err);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [movies, topRatedMovies, upcomingMovies, newMovies]
  );

  const refreshMovies = useCallback(() => {
    loadMovies();
  }, [loadMovies]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  return {
    movies,
    featuredMovies,
    newMovies,
    topRatedMovies,
    upcomingMovies,
    loading,
    error,
    searchMoviesByQuery,
    getMovieById,
    loadMoviesByGenre,
    refreshMovies,
    // pagination
    loadingMore: isLoadingMore,
    loadMorePopular,
    loadMoreTopRated,
    loadMoreUpcoming,
  };
};
