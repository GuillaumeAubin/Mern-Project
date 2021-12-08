const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.posts = require("./posts.js")(sequelize, Sequelize);
db.comments = require("./comment.js")(sequelize, Sequelize);
db.users = require("./users.js")(sequelize, Sequelize);
db.votes = require("./vote.js")(sequelize, Sequelize);


//Associations
db.users.hasMany(db.posts);
db.posts.belongsTo(db.users);

db.users.hasMany(db.comments);
db.posts.hasMany(db.comments);
db.comments.belongsTo(db.posts);
db.comments.belongsTo(db.users);

db.users.hasMany(db.votes);
db.posts.hasMany(db.votes);
db.votes.belongsTo(db.users);
db.votes.belongsTo(db.posts);

module.exports = db;