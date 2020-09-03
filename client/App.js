import React from 'react';
import { ApolloClient } from '@apollo/client';
import { InMemoryCache } from 'apollo-boost';
import { createUploadLink } from 'apollo-upload-client';
import { ApolloProvider } from '@apollo/react-hooks';
import ImageUploader from './ImageUploader';

// Use your computer's IP address if you're running the app in a simulator/emulator
// Or the IP address of the server you're running the node backend
const IP = '0.0.0.0'
const uri = `http://${IP}:4000/graphql`;

const client = new ApolloClient({
  link: createUploadLink({ uri }),
  cache: new InMemoryCache(),
});

export default function App() {

  return (
    <ApolloProvider client={client}>
      <ImageUploader />
    </ApolloProvider>
  );
}