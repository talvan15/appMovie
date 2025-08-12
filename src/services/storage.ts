import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types/movie";

const STORAGE_KEYS = {
  USER: "@movieapp_user",
  AUTH_TOKEN: "@movieapp_auth_token",
  IS_AUTHENTICATED: "@movieapp_is_authenticated",
};

export const StorageService = {
  // Salvar usuário
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      throw new Error("Falha ao salvar dados do usuário");
    }
  },

  // Recuperar usuário
  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Erro ao recuperar usuário:", error);
      return null;
    }
  },

  // Salvar token de autenticação
  async saveAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
      throw new Error("Falha ao salvar token de autenticação");
    }
  },

  // Recuperar token de autenticação
  async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (error) {
      console.error("Erro ao recuperar token:", error);
      return null;
    }
  },

  // Salvar estado de autenticação
  async saveAuthState(isAuthenticated: boolean): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.IS_AUTHENTICATED,
        JSON.stringify(isAuthenticated)
      );
    } catch (error) {
      console.error("Erro ao salvar estado de autenticação:", error);
      throw new Error("Falha ao salvar estado de autenticação");
    }
  },

  // Recuperar estado de autenticação
  async getAuthState(): Promise<boolean> {
    try {
      const authState = await AsyncStorage.getItem(
        STORAGE_KEYS.IS_AUTHENTICATED
      );
      return authState ? JSON.parse(authState) : false;
    } catch (error) {
      console.error("Erro ao recuperar estado de autenticação:", error);
      return false;
    }
  },

  // Limpar todos os dados de autenticação
  async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER,
        STORAGE_KEYS.AUTH_TOKEN,
        STORAGE_KEYS.IS_AUTHENTICATED,
      ]);
    } catch (error) {
      console.error("Erro ao limpar dados de autenticação:", error);
      throw new Error("Falha ao limpar dados de autenticação");
    }
  },

  // Verificar se o usuário está logado
  async isUserLoggedIn(): Promise<boolean> {
    try {
      const [user, token, authState] = await Promise.all([
        this.getUser(),
        this.getAuthToken(),
        this.getAuthState(),
      ]);
      return !!(user && token && authState);
    } catch (error) {
      console.error("Erro ao verificar estado de login:", error);
      return false;
    }
  },
};
