import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { StorageService } from "../services/storage";
import { AuthContextType, User } from "../types/movie";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se o usuário já está logado ao inicializar
  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const savedUser = await StorageService.getUser();
        const savedAuthState = await StorageService.getAuthState();

        if (savedUser && savedAuthState) {
          setUser(savedUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Erro ao verificar estado de autenticação:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthState();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "1",
        email,
        name: "Usuário Teste",
        watchlist: [],
      };

      // Gerar token mock
      const mockToken = `token_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Salvar no AsyncStorage
      await StorageService.saveUser(mockUser);
      await StorageService.saveAuthToken(mockToken);
      await StorageService.saveAuthState(true);

      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error("Falha no login");
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "1",
        email,
        name,
        watchlist: [],
      };

      // Gerar token mock (em produção seria da API)
      const mockToken = `token_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      // Salvar no AsyncStorage
      await StorageService.saveUser(mockUser);
      await StorageService.saveAuthToken(mockToken);
      await StorageService.saveAuthState(true);

      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      throw new Error("Falha no registro");
    }
  };

  const logout = async () => {
    try {
       console.log("Chamando logout...");
      // Limpar dados do AsyncStorage
      await StorageService.clearAuthData();

      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpar o estado local
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const addToWatchlist = async (movieId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        watchlist: [...user.watchlist, movieId],
      };

      setUser(updatedUser);

      // Salvar no AsyncStorage
      try {
        await StorageService.saveUser(updatedUser);
      } catch (error) {
        console.error("Erro ao salvar watchlist:", error);
      }
    }
  };

  const removeFromWatchlist = async (movieId: string) => {
    if (user) {
      const updatedUser = {
        ...user,
        watchlist: user.watchlist.filter((id) => id !== movieId),
      };

      setUser(updatedUser);

      // Salvar no AsyncStorage
      try {
        await StorageService.saveUser(updatedUser);
      } catch (error) {
        console.error("Erro ao salvar watchlist:", error);
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    addToWatchlist,
    removeFromWatchlist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
