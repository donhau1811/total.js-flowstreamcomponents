const jsonServer = require("json-server");
const clone = require("clone");
const data = require("./db1.json");

const cors = require('cors');

const isProductionEnv = process.env.NODE_ENV === "production";
const server = jsonServer.create();

server.use(cors());

// For mocking the POST request, POST request won't make any changes to the DB in production environment
const router = jsonServer.router(isProductionEnv ? clone(data) : "db1.json", {
  _isFake: isProductionEnv,
});
const middlewares = jsonServer.defaults();

server.use(middlewares);

server.use((req, res, next) => {
  if (req.path !== "/") router.db.setState(clone(data));
  next();
});

server.use(router);
server.listen(process.env.PORT || 8100, () => {
  console.log("JSON Server is running");
});

// Export the Server API
module.exports = server;
