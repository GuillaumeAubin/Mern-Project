module.exports = (app) => {
  require("./posts")(app);
  require("./comments")(app);
  require("./users")(app);
  require("./votes")(app);
}