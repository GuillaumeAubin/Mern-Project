const auth = require("../middleware/auth");
const admin = require("../middleware/isAdmin");
const cors = require("cors");

module.exports = (app) => {
  const users = require("../controllers/users.js");

  const router = require("express").Router();

  router.post("/SignIn", users.login);
  router.post("/SignUp", users.create);

  router.get("/:id", auth, users.findOne);

  router.get("/", auth, users.findAll);

  router.put("/:id", auth, users.update);

  router.delete("/admin/:id", auth, admin, users.delete);
  router.delete("/:id", auth, users.delete);

  app.use("/api/users", cors(), router);
};
