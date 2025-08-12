# 🚀 Guia de Configuração - TMDB API

## 📋 Pré-requisitos

- Conta no TMDB (The Movie Database)
- Node.js e npm instalados
- Expo CLI configurado

## 🔑 Configurando a API Key

### 1. Obter API Key do TMDB

1. Acesse [TMDB Settings](https://www.themoviedb.org/settings/api)
2. Faça login ou crie uma conta gratuita
3. Clique em "Create" para uma nova API Key
4. Selecione "Developer" como tipo
5. Preencha as informações solicitadas
6. Copie a API Key (v3 auth) gerada

### 2. Configurar no Projeto

1. Na raiz do projeto, crie um arquivo `.env`:

   ```bash
   touch .env
   ```

2. Adicione sua API Key:

   ```bash
   EXPO_PUBLIC_TMDB_API_KEY=sua_api_key_aqui
   ```

3. **IMPORTANTE**: Nunca commite o arquivo `.env` no Git!

### 3. Verificar Configuração

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o projeto:

   ```bash
   npm start
   ```

3. O app deve carregar filmes reais do TMDB

## 🐛 Solução de Problemas

### Erro: "Erro ao carregar filmes"

- Verifique se a API Key está correta
- Confirme se o arquivo `.env` está na raiz do projeto
- Reinicie o servidor após criar o `.env`

### Erro: "Filme não encontrado"

- Verifique se a API Key tem permissões corretas
- Confirme se está usando a API Key v3 (não v4)

### Imagens não carregam

- Verifique se a API Key está configurada
- As imagens são servidas diretamente pelo TMDB

## 📱 Testando a Integração

1. **Home Screen**: Deve mostrar filmes reais em destaque
2. **Pesquisa**: Digite o nome de um filme para testar
3. **Detalhes**: Toque em um filme para ver informações completas
4. **Watchlist**: Adicione filmes à sua lista pessoal

## 🔒 Segurança

- **NUNCA** compartilhe sua API Key
- **NUNCA** commite o arquivo `.env`
- Use variáveis de ambiente para configurações sensíveis
- A API Key é pública e pode ser usada no cliente

## 📚 Recursos Adicionais

- [Documentação TMDB API](https://developers.themoviedb.org/3)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [React Native Fetch](https://reactnative.dev/docs/network)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique se a API Key está correta
2. Confirme se o arquivo `.env` está configurado
3. Verifique a conexão com a internet
4. Consulte os logs do console para erros específicos
