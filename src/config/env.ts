// Environment Configuration
// To use the TMDB API, you need to:
// 1. Get an API key from: https://www.themoviedb.org/settings/api
// 2. Create a .env file in your project root
// 3. Add: EXPO_PUBLIC_TMDB_API_KEY=your_api_key_here

export const ENV_CONFIG = {
  TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY || "",
};

// Check if API key is configured
export const isTMDBConfigured = () => {
  return ENV_CONFIG.TMDB_API_KEY.length > 0;
};
