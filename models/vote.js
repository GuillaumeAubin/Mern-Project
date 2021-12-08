module.exports = (sequelize, Sequelize) => {
  const Vote = sequelize.define("votes", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      validate: {
        notNull: true,
      },
    },
    vote: {
      type: Sequelize.ENUM("none", "upVote", "downVote"),
      allowNull: false,
      defaultValue: "none",
    },
    postId: {
      //foreignKey of posts table
      type: Sequelize.UUID,
      required: true,
      allowNull: false,
    },
    userId: {
      //foreignKey of posts table
      type: Sequelize.UUID,
      required: true,
      allowNull: false,
    },
  });

  return Vote;
};
