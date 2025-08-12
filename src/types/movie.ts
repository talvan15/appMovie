export interface Movie {
  id: string;
  title: string;
  year: number;
  genre: string;
  poster: string;
  description: string;
  rating: number;
  duration?: string;
  originalTitle?: string; 
}

export interface User {
  id: string;
  email: string;
  name: string;
  watchlist: string[];
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  addToWatchlist: (movieId: string) => Promise<void>;
  removeFromWatchlist: (movieId: string) => Promise<void>;
}
