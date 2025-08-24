// // TODO: Implement likes controller
// // This controller should handle:
// // - Liking posts
// // - Unliking posts
// // - Getting likes for a post
// // - Getting posts liked by a user

// const logger = require("../utils/logger");

// // TODO: Implement likePost function
// // TODO: Implement unlikePost function
// // TODO: Implement getPostLikes function
// // TODO: Implement getUserLikes function

// module.exports = {
// 	// Functions will be implemented here
// };




const {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
} = require("../models/like");
const logger = require("../utils/logger");

/**
 * Like a post
 */
const like = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id: postId } = req.body;

    const success = await likePost(userId, postId);
    if (!success) {
      return res.status(400).json({ message: "Post already liked" });
    }

    res.json({ message: "Post liked successfully" });
  } catch (error) {
    logger.critical("Like post error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Unlike a post
 */
const unlike = async (req, res) => {
  try {
    const userId = req.user.id;
    const { post_id: postId } = req.params;

    const success = await unlikePost(userId, postId);
    if (!success) {
      return res.status(404).json({ message: "Post not liked or not found" });
    }

    res.json({ message: "Post unliked successfully" });
  } catch (error) {
    logger.critical("Unlike post error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get likes for a post
 */
const getLikesForPost = async (req, res) => {
  try {
    const { post_id: postId } = req.params;

    const likes = await getPostLikes(postId);
    res.json({ likes });
  } catch (error) {
    logger.critical("Get post likes error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * Get posts liked by a user
 */
const getLikesByUser = async (req, res) => {
  try {
    const { user_id: userId } = req.params;

    const posts = await getUserLikes(userId);
    res.json({ posts });
  } catch (error) {
    logger.critical("Get user likes error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  like,
  unlike,
  getLikesForPost,
  getLikesByUser,
};
