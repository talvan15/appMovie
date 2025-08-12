import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { LoadingScreen } from "../components/LoadingScreen";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady && !isLoading) {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [isAuthenticated, isLoading, isReady]);

  // Mostrar tela de loading enquanto verifica autenticação
  if (isLoading || !isReady) {
    return <LoadingScreen message="Verificando autenticação..." />;
  }

  return (
   
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/loguin" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
      </Stack>
   
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
