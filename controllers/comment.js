const getIdUser = require("../utils/decodeToken");
const DB = require("../models");
const COMMENTS = DB.comments;

exports.create = (req, res) => {
  if (!req.body.comment) {
    return res.status(400).send({
      message: "body cannot be empty!",
    });
  }
  if (!getIdUser(req)) {
    return res.status(400).send({
      message: "Empty post id has been received !",
    });
  }

  const comment = {
    comment: req.body.comment,
    postId: req.body.postId,
    userId: getIdUser(req),
  };

  COMMENTS.create(comment)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the comment.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  COMMENTS.update(req.body, {
    where: { id, userId: getIdUser(req) },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Comment was updated successfully.",
        });
      }

      res.send({
        message: `Cannot update comment with id=${id}. Maybe comment was not found or req.body is empty!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating comment with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  COMMENTS.destroy({
    where: { id, userId: getIdUser(req) },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Comment was deleted successfully!",
        });
      }

      res.status(400).send({
        message: `Cannot delete comment with id=${id}. Maybe comment was not found! Or the comment does not belong to the user`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete comment with id=" + id,
      });
    });
};

exports.adminDelete = (req, res) => {
  const id = req.params.id;

  COMMENTS.destroy({
    where: { id },
  })
    .then((execute) => {
      if (execute == 1) {
        return res.send({
          message: "Comment was deleted successfully!",
        });
      }

      res.status(404).send({
        message: `Cannot delete comment with id=${id}. Maybe comment was not found!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete comment with id=" + id,
      });
    });
};
