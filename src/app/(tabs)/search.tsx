import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MovieCard } from "../../components/MovieCard";
import { SearchBar } from "../../components/SearchBar";
import { useMovies } from "../../hooks/useMovies";
import { Movie } from "../../types/movie";

export default function SearchScreen() {
  const { query: initialQuery } = useLocalSearchParams<{ query: string }>();
  const [searchQuery, setSearchQuery] = useState(initialQuery || "");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const { searchMoviesByQuery } = useMovies();

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      setLoading(true);
      try {
        const results = await searchMoviesByQuery(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Erro na pesquisa:", error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setSearchResults([]);
      setLoading(false);
    }
  };

  const handleMoviePress = (movie: Movie) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id },
    });
  };

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={handleMoviePress} size="medium" />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {searchQuery.trim() ? (
        <>
          <Text style={styles.emptyStateTitle}>Nenhum filme encontrado</Text>
          <Text style={styles.emptyStateSubtitle}>
            Tente pesquisar por outro termo
          </Text>
        </>
      ) : (
        <>
          <Text style={styles.emptyStateTitle}>Pesquise por filmes</Text>
          <Text style={styles.emptyStateSubtitle}>
            Digite o nome do filme, gênero ou ator
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesquisar</Text>
      </View>

      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Pesquisando...</Text>
        </View>
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderMovie}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.movieRow}
          contentContainerStyle={styles.movieList}
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
  movieList: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  movieRow: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
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
