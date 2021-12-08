const DB = require("../models");
const getIdUser = require("../utils/decodeToken");

module.exports = (req, res, next) => {
  DB.users.findOne({ where: { id: getIdUser(req), role: "admin" } })
    .then((data) => {
      if (data.role === "admin") return next();

      return res.status(401).send({ message: "Pas admin" });
    })
    .catch(() => {
      res.status(500).send({
        message: "L'utilisateur n'est pas admin ce chien!",
      });
    });
};