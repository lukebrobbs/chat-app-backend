const { GraphQLServer, PubSub } = require("graphql-yoga");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { startDB, models } = require("./db");
const resolvers = require("./graphql/resolvers");
require("dotenv").config();

const db = startDB({
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
  context: req => ({ ...req, ...context })
});

Server.express.use(cookieParser());

Server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }
  next();
});
// options
const opts = {
  port: process.env.PORT,

  cors: {
    credentials: true,
    origin: process.env.FRONTEND_URL
  }
};

Server.start(opts, () => {
  console.log(`Server is running on http://localhost:${opts.port} 🚀`);
});
