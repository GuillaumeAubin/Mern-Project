module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define("comments", {
    id: {
      primaryKey: true,
      allowNull: false,
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      validate: {
        notNull: true,
      },
    },
    comment: {
      type: Sequelize.STRING,
      allowNull: false,
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

  return Comment;
};
