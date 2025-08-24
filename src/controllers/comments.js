// // TODO: Implement comments controller
// // This controller should handle:
// // - Creating comments on posts
// // - Editing user's own comments
// // - Deleting user's own comments
// // - Getting comments for a post
// // - Pagination for comments

// const logger = require("../utils/logger");

// // TODO: Implement createComment function
// // TODO: Implement updateComment function
// // TODO: Implement deleteComment function
// // TODO: Implement getPostComments function

// module.exports = {
// 	// Functions will be implemented here
// };


const {
  createComment,
  updateComment,
  deleteComment,
  getPostComments,
} = require("../models/comment");
const logger = require("../utils/logger");

/**
 * Create a comment
 */
const create = async (req, res) => {
  try {
    const { post_id, content } = req.body;
    const user_id = req.user.id;

    const comment = await createComment( user_id, post_id, content );

    res.status(201).json({ message: "Comment created", comment });
  } catch (error) {
    logger.critical("Create comment error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Update a comment
 */
const update = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const { content } = req.body;
    const user_id = req.user.id;

    const updatedComment = await updateComment( comment_id, user_id, content );

    if (!updatedComment) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    res.json({ message: "Comment updated", comment: updatedComment });
  } catch (error) {
    logger.critical("Update comment error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Delete a comment
 */
const remove = async (req, res) => {
  try {
    const { comment_id } = req.params;
    const user_id = req.user.id;

    const success = await deleteComment(comment_id, user_id);
    if (!success) {
      return res.status(404).json({ error: "Comment not found or unauthorized" });
    }

    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    logger.critical("Delete comment error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get comments for a post
 */
const getByPost = async (req, res) => {
  try {
    const { post_id } = req.params;

    const comments = await getPostComments(post_id);
    res.json({ comments });
  } catch (error) {
    logger.critical("Get post comments error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  create,
  update,
  remove,
  getByPost,
};
