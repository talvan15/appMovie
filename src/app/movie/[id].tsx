import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useMovies } from "../../hooks/useMovies";
import { getMovieDetails } from "../../services/tmdbApi";
import { Movie } from "../../types/movie";

const { width } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const params = useLocalSearchParams();
  const rawId = params && (params as any).id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const { user, addToWatchlist, removeFromWatchlist } = useAuth();
  const { getMovieById } = useMovies();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovie = async () => {
      if (id) {
        setLoading(true);
        setError(null);
        try {
          const movieData = await getMovieById(id);
          if (movieData) {
            setMovie(movieData);
          } else {
            // Fallback: buscar detalhes diretamente da API quando não estiver em memória
            const detailsResponse = await getMovieDetails(Number(id));
            const data = detailsResponse.data;
            const mapped: Movie = {
              id: data.id.toString(),
              title: data.title,
              originalTitle: data.original_title,
              year: new Date(data.release_date).getFullYear(),
              genre:
                data.genres && data.genres.length > 0
                  ? data.genres[0].name
                  : "Ação",
              poster: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
              description: data.overview || "Sem descrição",
              rating: data.vote_average,
              duration: data.runtime ? `${data.runtime} min` : undefined,
            };
            setMovie(mapped);
          }
        } catch (err) {
          setError("Erro ao carregar detalhes do filme");
        } finally {
          setLoading(false);
        }
      }
    };

    loadMovie();
  }, [id, getMovieById]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando filme...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !movie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || "Filme não encontrado"}
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isInWatchlist = user?.watchlist.includes(movie.id) || false;

  const handleToggleWatchlist = () => {
    if (isInWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie.id);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header com botão voltar */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Detalhes</Text>
          <TouchableOpacity
            style={styles.watchlistButton}
            onPress={handleToggleWatchlist}
          >
            <Ionicons
              name={isInWatchlist ? "bookmark" : "bookmark-outline"}
              size={24}
              color={isInWatchlist ? "#4a9eff" : "#ffffff"}
            />
          </TouchableOpacity>
        </View>

        {/* Banner do filme */}
        {movie.poster && (
          <Image
            source={{ uri: movie.poster }}
            style={styles.banner}
            resizeMode="cover"
          />
        )}

        {/* Informações do filme */}
        <View style={styles.movieInfo}>
          <View style={styles.posterAndTitle}>
            <Image
              source={{ uri: movie.poster }}
              style={styles.poster}
              resizeMode="cover"
            />
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{movie.title}</Text>
              {movie.originalTitle && movie.originalTitle !== movie.title && (
                <Text style={styles.originalTitle}>{movie.originalTitle}</Text>
              )}
            </View>
          </View>

          {/* Metadados */}
          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color="#888888" />
              <Text style={styles.metaText}>{movie.year}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#888888" />
              <Text style={styles.metaText}>{movie.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={16} color="#888888" />
              <Text style={styles.metaText}>{movie.genre}</Text>
            </View>
            {movie.rating && (
              <View style={styles.metaItem}>
                <Ionicons name="star" size={16} color="#ffd700" />
                <Text style={styles.metaText}>{movie.rating}</Text>
              </View>
            )}
          </View>

          {/* Descrição */}
          {movie.description && (
            <View style={styles.descriptionSection}>
              <Text style={styles.descriptionTitle}>Sobre o Filme</Text>
              <Text style={styles.description}>{movie.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242A32",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#242A32",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  watchlistButton: {
    padding: 8,
  },
  banner: {
    width: "100%",
    height: 200,
    backgroundColor: "#2a2a2a",
  },
  movieInfo: {
    padding: 16,
  },
  posterAndTitle: {
    flexDirection: "row",
    marginBottom: 20,
  },
  poster: {
    width: 100,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
  },
  titleContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    lineHeight: 28,
  },
  originalTitle: {
    fontSize: 16,
    color: "#888888",
    fontStyle: "italic",
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 80,
  },
  metaText: {
    fontSize: 14,
    color: "#888888",
    marginLeft: 4,
  },
  descriptionSection: {
    marginTop: 8,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#cccccc",
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: "#ffffff",
    marginBottom: 20,
  },
  backButtonText: {
    color: "#4a9eff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 16,
  },
});
