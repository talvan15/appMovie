import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  size?: "small" | "medium" | "large";
}

const { width } = Dimensions.get("window");

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPress,
  size = "medium",
}) => {
  const getCardSize = () => {
    switch (size) {
      case "small":
        return { width: width * 0.28, height: width * 0.42 };
      case "large":
        return { width: width * 0.4, height: width * 0.6 };
      default:
        return { width: width * 0.32, height: width * 0.48 };
    }
  };

  const cardSize = getCardSize();

  return (
    <TouchableOpacity
      style={[styles.container, { width: cardSize.width }]}
      onPress={() => onPress(movie)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: movie.poster }}
        style={[styles.poster, { height: cardSize.height }]}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={styles.year}>{movie.year}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  poster: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: "#2a2a2a",
  },
  info: {
    marginTop: 8,
  },
  title: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
  },
  year: {
    color: "#888888",
    fontSize: 10,
  },
});
