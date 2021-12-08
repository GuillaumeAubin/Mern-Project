module.exports = (app) => {
  const votes = require("../controllers/vote.js");

  let router = require("express").Router();

  router.post("/", votes.create);

  router.get("/", votes.findAll);
  router.get("/:id", votes.findOne);

  router.put("/:id", votes.update);

  router.delete("/:id", votes.delete);

  app.use("/api/votes", router);
};