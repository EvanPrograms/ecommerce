import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context'

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

const queryClient = new QueryClient()

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:5000/graphql',});

const apolloClient = new ApolloClient({
  cache:new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getUserCart: {
            keyArgs: ["userId"], // Ensure cache keys are based on `userId`
            merge(existing = [], incoming) {
              // Handle merging of existing and incoming data
              return [...incoming];
            },
          },
          getProducts: {
            keyArgs: false,
            merge(existing = [], incoming) {
              return incoming
            }
          }
        },
      },
      CartItem: {
        keyFields: ["id"], // Normalize `CartItem` by its `id`
      },
    },
  }),
  link: authLink.concat(httpLink)
})

root.render(
  <QueryClientProvider client={queryClient}>
    <ApolloProvider client={apolloClient}>
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <App />
        </ThemeProvider>
      </React.StrictMode>
    </ApolloProvider>
  </QueryClientProvider>
);
