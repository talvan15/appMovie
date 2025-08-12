import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../contexts/AuthContext";
import { useMovies } from "../../hooks/useMovies";
import { Movie } from "../../types/movie";

export default function WatchlistScreen() {
  const { user, removeFromWatchlist } = useAuth();
  const { getMovieById } = useMovies();
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWatchlistMovies = async () => {
      if (user?.watchlist && user.watchlist.length > 0) {
        setLoading(true);
        try {
          const movies = await Promise.all(
            user.watchlist.map((id) => getMovieById(id))
          );
          const validMovies = movies.filter(
            (movie): movie is Movie => movie !== null
          );
          setWatchlistMovies(validMovies);
        } catch (error) {
          console.error("Error loading watchlist movies:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setWatchlistMovies([]);
        setLoading(false);
      }
    };

    loadWatchlistMovies();
  }, [user?.watchlist, getMovieById]);

  const handleMoviePress = (movie: Movie) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id },
    });
  };

  const handleRemoveFromWatchlist = (movieId: string) => {
    removeFromWatchlist(movieId);
  };

  const renderWatchlistItem = ({ item }: { item: Movie }) => (
    <View style={styles.watchlistItem}>
      <TouchableOpacity
        style={styles.movieInfo}
        onPress={() => handleMoviePress(item)}
      >
        <Image
          source={{ uri: item.poster }}
          style={styles.moviePoster}
          resizeMode="cover"
        />
        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <View style={styles.movieMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#888888" />
              <Text style={styles.metaText}>{item.year}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="star-outline" size={14} color="#888888" />
              <Text style={styles.metaText}>{item.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="pricetag-outline" size={14} color="#888888" />
              <Text style={styles.metaText}>{item.genre}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => handleRemoveFromWatchlist(item.id)}
      >
        <Ionicons name="close-circle" size={24} color="#ff6b6b" />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="bookmark-outline" size={64} color="#888888" />
      <Text style={styles.emptyStateTitle}>Sua watchlist está vazia</Text>
      <Text style={styles.emptyStateSubtitle}>
        Adicione filmes à sua lista para assistir depois
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Watch List</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando watchlist...</Text>
        </View>
      ) : watchlistMovies.length > 0 ? (
        <FlatList
          data={watchlistMovies}
          renderItem={renderWatchlistItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.watchlist}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        renderEmptyState()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242A32",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  watchlist: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  watchlistItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  movieInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  moviePoster: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#3a3a3a",
  },
  movieDetails: {
    flex: 1,
    marginLeft: 12,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  movieMeta: {
    gap: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#888888",
    marginLeft: 4,
  },
  removeButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    color: "#888888",
    textAlign: "center",
    lineHeight: 22,
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
