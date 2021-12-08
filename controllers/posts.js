const getIdUser = require("../utils/decodeToken");
const DB = require("../models");
const fs = require("fs");
const POSTS = DB.posts;
const VOTES = DB.votes;

exports.create = (req, res) => {
  const post = {
    text: req.body.text,
    userId: getIdUser(req),
    imgUrl: req.file
      ? ` ${req.protocol}://${req.get("host")}/assets/img/${req.file.filename}`
      : null,
  };

  if (!post.text && !post.imgUrl) {
    res.status(400).send({
      message: "Content cannot be empty!",
    });
    return;
  }
  if (!getIdUser(req)) {
    res.status(400).send({
      message: "userId cannot be empty",
    });
    return;
  }

  POSTS.create(post)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the post.",
      });
    });
};

exports.userVote = async (req, res) => {
  const votePost = req.body.vote;
  const userId = getIdUser(req);
  const postId = req.params.id;
  const vote = {
    vote: votePost,
    userId: userId,
    postId: postId,
  };

  if (votePost !== "none" && votePost !== "upVote" && votePost !== "downVote") {
    return res.status(400).send({
      message: `User vote must be egual to (none / upVote / downVote) and not be : ${votePost}`,
    });
  }

  const valueVote = async () => {
    const numberVote = {
      upVote: await VOTES.count({ where: { postId, vote: "upVote" } }),
      downVote: await VOTES.count({ where: { postId, vote: "downVote" } }),
    };

    return numberVote;
  };

  const updatePostVote = async () => {
    await POSTS.update(await valueVote(), {
      where: { id: postId },
    })
      .then((execute) => {
        if (execute == 1) {
          return res.send({
            message: "Post was updated successfully.",
          });
        }
        return res.status(404).send({
          message: "Post not found.",
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err || "Some error occurred while creating the vote.",
        });
      });
  };

  const upsert = (values, condition) => {
    return VOTES.findOne({ where: condition }).then((obj) => {
      if (obj) return obj.update(values);

      return VOTES.create(values);
    });
  };

  await upsert(vote, { userId, postId });
  updatePostVote();
};

exports.findAll = async (req, res) => {
  const orderPost = req.query.order ?? "DESC";
  const offsetPost = Number(req.query.offset) ? Number(req.query.offset) : 0;
  const limitPost = Number(req.query.limit) ? Number(req.query.limit) : 5;

  if (orderPost !== "DESC" && orderPost !== "ASC") {
    return res.status(400).send({
      message: `orderPost can only match DESC or ASC and cannot equal : ${orderPost}`,
    });
  }

  POSTS.findAll({
    order: [["createdAt", orderPost]],
    offset: offsetPost,
    limit: limitPost,
    include: [
      { model: DB.users, attributes: ["id", "name", "description", "role"] },
      {
        model: DB.comments,
        attributes: ["id", "comment", "createdAt", "updatedAt", "userId"],
        limit: 5,
        include: [
          {
            model: DB.users,
            attributes: ["name", "description", "role"],
          },
        ],
      },
      {
        model: VOTES,
        required: false,
        where: { userId: getIdUser(req) },
        nest: true,
        include: [
          {
            model: DB.users,
            attributes: ["name"],
          },
        ],
        attributes: ["vote", "userId"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving post.",
      });
    });
};

exports.findAllByUserId = (req, res) => {
  const offsetPost = Number(req.query.offset) ? Number(req.query.offset) : 0;
  const limitPost = Number(req.query.limit) ? Number(req.query.limit) : 5;

  POSTS.findAll({
    where: { userId: req.params.id },
    order: [["createdAt", "DESC"]],
    offset: offsetPost,
    limit: limitPost,
    include: [
      { model: DB.users, attributes: ["name", "description", "role"] },
      {
        model: DB.comments,
        attributes: ["id", "comment", "createdAt", "updatedAt", "userId"],
        limit: 5,
        include: [
          {
            model: DB.users,
            attributes: ["name", "description", "role"],
          },
        ],
      },
      {
        model: VOTES,
        required: false,
        where: { userId: getIdUser(req) },
        nest: true,
        attributes: ["vote", "userId"],
      },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  POSTS.findByPk(id, {
    attributes: { exclude: ["userId"] },
    include: [
      {
        model: DB.comments,
        attributes: ["comment", "createdAt", "updatedAt"],
        include: [
          {
            model: DB.users,
            attributes: ["name", "desc", "role"],
          },
        ],
      },
      { model: DB.users, attributes: ["name", "desc", "role"] },
    ],
  })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving post with id=" + id,
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  POSTS.update(req.body, {
    where: { id },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Post was updated successfully.",
        });
      }
      res.send({
        message: `Cannot update post with id=${id}. Maybe post was not found or req.body is empty!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating post with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  const imgUrl = async () => {
    const postContent = await POSTS.findByPk(id);
    return postContent.imgUrl;
  };

  (async () =>
    fs.unlink(`${await imgUrl()}`, (err) => {
      if (err) return res.send({ message: err });
    }))();

  POSTS.destroy({
    where: { id, userId: getIdUser(req) },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Post was deleted successfully!",
        });
      }

      res.status(400).send({
        message: `Cannot delete post with id=${id}. Maybe post was not found! Or the post does not belong to the user`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err || "Could not delete post with id=" + id,
      });
    });
};

exports.adminDelete = (req, res) => {
  const id = req.params.id;

  const imgUrl = async () => {
    const postContent = await POSTS.findByPk(id);
    return postContent.imgUrl.split("/assets/img/")[1];
  };

  (async () =>
    fs.unlink(`assets/img/${await imgUrl()}`, (err) => {
      if (err) return res.send({ message: err });
    }))();

  POSTS.destroy({
    where: { id },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Post was deleted successfully!",
        });
      }

      res.status(404).send({
        message: `Cannot delete post with id=${id}. Maybe post was not found!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete post with id=" + id,
      });
    });
};
