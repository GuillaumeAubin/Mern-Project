'use strict'
const express = require("express")
const dbDatabase = require("./models")
const { Model } = require('sequelize')
/*const app = express()
app.listen(8080,() => {
  console.log("le serveur tourne sur le porte 8080")
});*/
dbDatabase.sequelize.sync({ force: true }).then(() => {
  console.log("Connecté à MySQL");
});
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      })
      models.Post.hasMany(models.Comment)
    }
  }
  Post.init(
    {
      userId: DataTypes.INTEGER,
      message: DataTypes.STRING,
      image: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Post',
    }
  )
  return Post
}