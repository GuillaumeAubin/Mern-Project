const bcrypt = require("bcrypt");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "users",
    {
      id: {
        primaryKey: true,
        allowNull: false,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true,
      },
      description: {
        type: Sequelize.STRING(64),
        defaultValue: "Nouveau",
      },
      role: {
        type: Sequelize.ENUM("user", "admin"),
        defaultValue: "user",
      },
      password: {
        type: Sequelize.STRING(128),
        allowNull: false,
        validate: {
          is: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
        },
      },
    },
    {
      instanceMethods: {
        validPassword(password) {
          return bcrypt.compare(password, this.password);
        },
      },
      hooks: {
        beforeCreate: (user, options) => {
          return new Promise((resolve, reject) => {
            bcrypt.hash(user.password, 8, (err, data) => {
              if (err) reject(err);
              user.password = data;
              resolve();
            });
          });
        },
      },
    }
  );

  return User;
};
