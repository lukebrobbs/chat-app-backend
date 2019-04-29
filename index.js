const { GraphQLServer, PubSub } = require("graphql-yoga");
const { startDB, models } = require("./db");
const resolvers = require("./graphql/resolvers");
require("dotenv").config();

const db = startDB({
  user: process.env.DB_USER,
  pwd: process.env.DB_PASSWORD,
  db: process.env.DATABASE,
  url: process.env.DB_URL
});
const pubsub = new PubSub();

const context = {
  models,
  db,
  pubsub
};

const Server = new GraphQLServer({
  typeDefs: `${__dirname}/graphql/schema.graphql`,
  resolvers,
  context
});

// options
const opts = {
  port: process.env.PORT
};

Server.start(opts, () => {
  console.log(`Server is running on http://localhost:${opts.port} 🚀`);
});
