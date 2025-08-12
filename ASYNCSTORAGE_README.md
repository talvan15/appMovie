# AsyncStorage Implementation Guide

## 📱 Visão Geral

Este projeto implementa persistência de dados usando `@react-native-async-storage/async-storage` para:

- **Autenticação**: Salvar dados do usuário logado
- **Preferências**: Configurações do usuário
- **Estado da aplicação**: Dados que devem persistir entre sessões

## 🚀 Instalação

O AsyncStorage já foi instalado:

```bash
npm install @react-native-async-storage/async-storage
```

## 📁 Estrutura dos Serviços

### 1. **StorageService** (`src/services/storage.ts`)

Gerencia dados de autenticação:

```typescript
import { StorageService } from "../services/storage";

// Salvar usuário
await StorageService.saveUser(user);

// Recuperar usuário
const user = await StorageService.getUser();

// Verificar se está logado
const isLoggedIn = await StorageService.isUserLoggedIn();

// Limpar dados de autenticação
await StorageService.clearAuthData();
```

### 2. **UserPreferencesService** (`src/services/userPreferences.ts`)

Gerencia preferências do usuário:

```typescript
import { UserPreferencesService } from "../services/userPreferences";

// Carregar todas as preferências
const preferences = await UserPreferencesService.loadPreferences();

// Salvar preferência específica
await UserPreferencesService.setPreference("theme", "dark");

// Verificar primeira execução
const isFirstRun = await UserPreferencesService.isFirstRun();
```

## 🔐 Autenticação com Persistência

### Login

```typescript
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login(email, password);
    // Dados são automaticamente salvos no AsyncStorage
    router.replace("/(tabs)");
  } catch (error) {
    // Tratar erro
  }
};
```

### Verificação Automática

O app verifica automaticamente se o usuário está logado ao abrir:

```typescript
// Em AuthContext.tsx
useEffect(() => {
  const checkAuthState = async () => {
    const savedUser = await StorageService.getUser();
    const savedAuthState = await StorageService.getAuthState();

    if (savedUser && savedAuthState) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  };

  checkAuthState();
}, []);
```

## 🎨 Preferências do Usuário

### Exemplo de Uso

```typescript
import { UserPreferencesService } from "../services/userPreferences";

// Salvar tema preferido
await UserPreferencesService.setPreference("theme", "dark");

// Carregar configuração de notificações
const notificationsEnabled = await UserPreferencesService.getPreference(
  "notifications"
);

// Resetar para padrão
await UserPreferencesService.resetPreferences();
```

### Preferências Disponíveis

- `theme`: 'light' | 'dark' | 'system'
- `language`: string (ex: 'pt-BR', 'en-US')
- `notifications`: boolean
- `autoPlay`: boolean
- `quality`: 'low' | 'medium' | 'high'

## 🔄 Watchlist Persistente

A watchlist do usuário é automaticamente salva:

```typescript
const { addToWatchlist, removeFromWatchlist } = useAuth();

// Adicionar filme (salva automaticamente)
await addToWatchlist(movieId);

// Remover filme (salva automaticamente)
await removeFromWatchlist(movieId);
```

## 🛡️ Tratamento de Erros

Todos os serviços incluem tratamento de erros robusto:

```typescript
try {
  await StorageService.saveUser(user);
} catch (error) {
  console.error("Erro ao salvar usuário:", error);
  // Tratar erro adequadamente
}
```

## 📱 Tela de Loading

O app mostra uma tela de loading enquanto verifica a autenticação:

```typescript
// Em _layout.tsx
if (isLoading || !isReady) {
  return <LoadingScreen message="Verificando autenticação..." />;
}
```

## 🧪 Testando

### Limpar Dados

```typescript
// Limpar autenticação
await StorageService.clearAuthData();

// Resetar preferências
await UserPreferencesService.resetPreferences();
```

### Verificar Estado

```typescript
// Verificar se está logado
const isLoggedIn = await StorageService.isUserLoggedIn();

// Verificar primeira execução
const isFirstRun = await UserPreferencesService.isFirstRun();
```

## 🔧 Configuração Avançada

### Chaves de Storage

As chaves são prefixadas para evitar conflitos:

```typescript
const STORAGE_KEYS = {
  USER: "@movieapp_user",
  AUTH_TOKEN: "@movieapp_auth_token",
  IS_AUTHENTICATED: "@movieapp_is_authenticated",
};
```

### Migração de Dados

Para futuras versões, você pode implementar migração:

```typescript
const migrateUserData = async (oldVersion: string, newVersion: string) => {
  // Lógica de migração
};
```

## 📚 Recursos Adicionais

- **Persistência automática**: Dados são salvos automaticamente
- **Fallback para padrões**: Se falhar, usa valores padrão
- **Performance otimizada**: Usa `useCallback` e `useEffect`
- **TypeScript**: Totalmente tipado para segurança

## 🚨 Considerações de Segurança

- **Tokens**: Em produção, use tokens JWT reais
- **Criptografia**: Considere criptografar dados sensíveis
- **Expiração**: Implemente expiração de tokens
- **Validação**: Valide dados antes de salvar

## 🔄 Próximos Passos

1. **Implementar API real** para autenticação
2. **Adicionar criptografia** para dados sensíveis
3. **Implementar sincronização** com servidor
4. **Adicionar backup** de dados
5. **Implementar migração** de versões
