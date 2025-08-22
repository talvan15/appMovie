# Movie App - React Native + TypeScript + Expo

Um aplicativo de listagem de filmes desenvolvido com React Native, TypeScript e Expo, baseado no design do Figma fornecido.

## 🎬 Funcionalidades

- **Autenticação**: Sistema de login e cadastro de usuários
- **Home**: Tela principal com filmes em destaque e categorias
- **Pesquisa**: Busca por filmes por título ou gênero
- **Watchlist**: Lista de filmes favoritos do usuário
- **Detalhes**: Tela completa com informações do filme
- **Navegação**: Sistema de tabs na parte inferior

## 🔧 Tecnologias Utilizadas

- **React Native**: Framework principal
- **TypeScript**: Tipagem estática
- **Expo**: Plataforma de desenvolvimento
- **Expo Router**: Navegação baseada em arquivos
- **TMDB API**: Dados reais de filmes
- **React Hooks**: Gerenciamento de estado e efeitos

## 📱 Navegação

O app utiliza o **Expo Router** com a seguinte estrutura:

- **Auth Stack**: Login e registro
- **Tabs Stack**: Home, pesquisa e watchlist
- **Movie Stack**: Detalhes do filme

## 🔐 Autenticação

Sistema de autenticação simulado com:

- Contexto React para estado global
- Funções de login/registro
- Gerenciamento de watchlist por usuário
- Navegação condicional baseada no estado de autenticação


## 🏗️ Estrutura do Projeto

```
src/
├── app/
│   ├── auth/           # Telas de autenticação
│   │   ├── login.tsx
│   │   └── register.tsx
│   ├── (tabs)/         # Navegação por tabs
│   │   ├── _layout.tsx
│   │   ├── index.tsx   # Home
│   │   ├── search.tsx  # Pesquisa
│   │   └── watchlist.tsx
│   ├── movie/          # Detalhes do filme
│   │   └── [id].tsx
│   └── _layout.tsx     # Layout principal
├── components/          # Componentes reutilizáveis
│   ├── MovieCard.tsx
│   ├── SearchBar.tsx
│   └── CategoryTabs.tsx
├── contexts/            # Contextos React
│   └── AuthContext.tsx
├── config/              # Configurações da API
│   ├── api.ts          # Configuração TMDB
│   └── env.ts          # Variáveis de ambiente
├── hooks/               # Hooks customizados
│   └── useMovies.ts    # Hook para gerenciar filmes
├── services/            # Serviços da API
│   └── tmdbApi.ts      # Integração com TMDB
├── types/               # Tipos TypeScript
│   └── movie.ts
└── constants/           # Constantes e temas
    └── theme.ts
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI instalado globalmente

### Configuração da API TMDB

Para que o app funcione com dados reais de filmes, você precisa configurar a API do TMDB:

1. **Acesse [TMDB Settings](https://www.themoviedb.org/settings/api)**
2. **Crie uma conta gratuita se não tiver**
3. **Solicite uma API Key (v3 auth)**
4. **Crie um arquivo `.env` na raiz do projeto:**
   ```bash
   EXPO_PUBLIC_TMDB_API_KEY=sua_api_key_aqui
   ```

### Instalação

```bash
# Instalar dependências
npm install

# Iniciar o projeto
npm start
```

### Comandos Disponíveis

```bash
npm start          # Inicia o servidor de desenvolvimento
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa na web
npm run lint       # Executa o linter
```

## 📱 Telas do App

### 1. **Autenticação**

- Login com email e senha
- Cadastro de nova conta
- Validação de campos

### 2. **Home**

- Barra de pesquisa
- Seção "Em destaque" com filmes principais
- Abas de categorias (Novo, Melhores, Popular, Estreias)
- Grid de filmes organizados

### 3. **Pesquisa**

- Busca em tempo real
- Filtros por título, gênero ou ator
- Resultados organizados em grid

### 4. **Watchlist**

- Lista de filmes favoritos
- Opção de remover filmes
- Estado vazio com mensagem informativa

### 5. **Detalhes do Filme**

- Informações completas do filme
- Banner e poster
- Metadados (ano, duração, gênero, avaliação)
- Descrição detalhada
- Botão para adicionar/remover da watchlist

## 🎨 Design System

### Cores

- **Fundo principal**: `#1a1a1a` (preto escuro)
- **Superfícies**: `#2a2a2a` e `#3a3a3a` (tons de cinza)
- **Primária**: `#4a9eff` (azul)
- **Texto**: `#ffffff` (branco) e `#888888` (cinza)

### Tipografia

- Títulos: 24-28px, peso bold
- Corpo: 16px, peso normal
- Caption: 12-14px, peso normal

### Espaçamentos

- Padrão: 16px
- Pequeno: 8px
- Grande: 24px


## 🎬 Integração TMDB API

O app agora consome dados reais da API do TMDB:

- **Filmes em Destaque**: Dados dos filmes mais populares da semana
- **Pesquisa**: Busca em tempo real na base de dados do TMDB
- **Detalhes**: Informações completas incluindo sinopse, avaliações e metadados
- **Imagens**: Posters e banners em alta qualidade
- **Gêneros**: Categorização automática baseada nos dados da API
- **Idioma**: Suporte para português brasileiro (pt-BR)

### Endpoints Utilizados

- `/trending/movie/week` - Filmes em tendência
- `/movie/popular` - Filmes populares
- `/search/movie` - Pesquisa de filmes
- `/movie/{id}` - Detalhes do filme
- `/genre/movie/list` - Lista de gêneros

## 🎯 Próximos Passos

- [x] Integração com API real de filmes (TMDB)
- [ ] Sistema de avaliações
- [ ] Filtros avançados
- [ ] Modo offline
- [ ] Notificações push
- [ ] Testes automatizados
- [ ] Internacionalização (i18n)

## 📄 Licença

Este projeto é de uso educacional e demonstrativo.
