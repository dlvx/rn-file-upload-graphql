const express = require('express');
const Storage = require('./storage');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

const PORT = process.env.SERVER_PORT || 4000;

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({
    req,
    res,
  }) => ({
    req,
    res,
    Storage
  }),
  playground: {
    endpoint: `http://localhost:${PORT}/graphql`
  },
});

server.applyMiddleware({
  app
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
})