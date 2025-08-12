import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryTabs } from "../../components/CategoryTabs";
import { MovieCard } from "../../components/MovieCard";
import { SearchBar } from "../../components/SearchBar";
import { useAuth } from "../../contexts/AuthContext";
import { useMovies } from "../../hooks/useMovies";
import { Movie } from "../../types/movie";

const categories = ["Novo", "Melhores", "Popular", "Estreias"];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("Popular");
  const { logout } = useAuth();
  const {
    movies,
    featuredMovies,
    newMovies,
    topRatedMovies,
    upcomingMovies,
    loading,
    error,
    refreshMovies,
    // pagination
    loadingMore,
    loadMorePopular,
    loadMoreTopRated,
    loadMoreUpcoming,
  } = useMovies();

  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);

  useEffect(() => {
    switch (selectedCategory) {
      case "Novo":
        setFilteredMovies(newMovies);
        break;
      case "Melhores":
        setFilteredMovies(topRatedMovies);
        break;
      case "Popular":
        setFilteredMovies(movies);
        break;
      case "Estreias":
        setFilteredMovies(upcomingMovies);
        break;
      default:
        setFilteredMovies(movies);
    }
  }, [selectedCategory, movies, newMovies, topRatedMovies, upcomingMovies]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push({
        pathname: "/(tabs)/search",
        params: { query },
      });
    }
  };

  const handleMoviePress = (movie: Movie) => {
    router.push({
      pathname: "/movie/[id]",
      params: { id: movie.id },
    });
  };

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Sair",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const renderFeaturedMovie = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={handleMoviePress} size="large" />
  );

  const renderMovie = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={handleMoviePress} size="small" />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Carregando filmes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.replace("/(tabs)")}
          >
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const listHeader = (
    <View>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Início</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={{ color: "#ee1212ff" }}>Sair</Text>
          <Ionicons name="log-out-outline" size={24} color="#ee1212ff" />
        </TouchableOpacity>
      </View>

      <SearchBar onSearch={handleSearch} />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Em destaque</Text>
        <FlatList
          data={featuredMovies}
          renderItem={renderFeaturedMovie}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>
        {selectedCategory === "Novo" && "Filmes Novos"}
        {selectedCategory === "Melhores" && "Melhores Filmes"}
        {selectedCategory === "Popular" && "Filmes Populares"}
        {selectedCategory === "Estreias" && "Próximas Estreias"}
      </Text>
    </View>
  );

  const loadMoreForSelectedCategory =
    selectedCategory === "Melhores"
      ? loadMoreTopRated
      : selectedCategory === "Popular"
      ? loadMorePopular
      : loadMoreUpcoming; // "Novo" e "Estreias" usam upcoming

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={filteredMovies}
        renderItem={renderMovie}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.movieRow}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.listContent}
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (!loadingMore) {
            loadMoreForSelectedCategory();
          }
        }}
        ListFooterComponent={
          loadingMore ? (
            <View style={{ paddingVertical: 16 }}>
              <ActivityIndicator size="small" color="#ffffff" />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#242A32",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logoutButton: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  content: {
    flex: 1,
  },
  list: { flex: 1 },
  listContent: {
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    marginLeft: 16,
    marginBottom: 12,
  },
  featuredList: {
    paddingHorizontal: 12,
  },
  movieRow: {
    justifyContent: "space-between",
    paddingHorizontal: 12,
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
