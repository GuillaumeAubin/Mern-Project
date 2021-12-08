const auth = require("../middleware/auth");
const admin = require("../middleware/isAdmin");
const cors = require("cors");

module.exports = (app) => {
  const Comments = require("../controllers/comment.js");

  const router = require("express").Router();

  router.post("/", auth, Comments.create);

  router.put("/:id", auth, Comments.update);

  router.delete("/admin/:id", auth, admin, Comments.adminDelete);
  router.delete("/:id", auth, Comments.delete);

  app.use("/api/comments", cors(), router);
};
