const auth = require("../middleware/auth");
const admin = require("../middleware/isAdmin");
const multer = require("../middleware/multer-config")
const cors = require("cors");

module.exports = (app) => {
  const Posts = require("../controllers/posts.js");

  const router = require("express").Router();

  router.put("/:id/vote", auth, Posts.userVote);
  router.post("/", auth, multer, Posts.create);

  router.get("/user/:id", auth, Posts.findAllByUserId);
  router.get("/:id", auth, Posts.findOne);
  router.get("/", auth, Posts.findAll);

  router.put("/:id", auth, Posts.update);

  router.delete("/admin/:id", auth, admin, Posts.adminDelete);
  router.delete("/:id", auth, Posts.delete);

  app.use("/api/posts", cors(), router);
};
