// const { query } = require("../utils/database");

// /**
//  * Like model for managing post likes
//  * TODO: Implement this model for the like functionality
//  */

// // TODO: Implement likePost function
// // TODO: Implement unlikePost function
// // TODO: Implement getPostLikes function
// // TODO: Implement getUserLikes function
// // TODO: Implement hasUserLikedPost function

// module.exports = {
// 	// Functions will be implemented here
// };


const { query } = require("../utils/database");

/**
 * Like model for managing post likes
 */

// Like a post
const likePost = async (postId, userId) => {
  const result = await query(
    `INSERT INTO likes (post_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT (post_id, user_id) DO NOTHING
     RETURNING *`,
    [postId, userId]
  );
  return result.rows[0] || null; // returns the like row if inserted, null if already liked
};

// Unlike a post
const unlikePost = async (postId, userId) => {
  const result = await query(
    `DELETE FROM likes
     WHERE post_id = $1 AND user_id = $2`,
    [postId, userId]
  );
  return result.rowCount > 0; // true if deleted, false otherwise
};

// Get all users who liked a specific post
const getPostLikes = async (postId) => {
  const result = await query(
    `SELECT users.id, users.username
     FROM likes
     JOIN users ON likes.user_id = users.id
     WHERE likes.post_id = $1`,
    [postId]
  );
  return result.rows;
};

// Get all posts liked by a specific user
const getUserLikes = async (userId) => {
  const result = await query(
    `SELECT posts.id, posts.content
     FROM likes
     JOIN posts ON likes.post_id = posts.id
     WHERE likes.user_id = $1`,
    [userId]
  );
  return result.rows;
};

// Check if a user has liked a specific post
const hasUserLikedPost = async (postId, userId) => {
  const result = await query(
    `SELECT 1
     FROM likes
     WHERE post_id = $1 AND user_id = $2`,
    [postId, userId]
  );
  return result.rowCount > 0;
};

module.exports = {
  likePost,
  unlikePost,
  getPostLikes,
  getUserLikes,
  hasUserLikedPost,
};



// const { query } = require("../utils/database");

// /**
//  * Like a post
//  */
// const likePost = async (userId, postId) => {
//   const result = await query(
//     `INSERT INTO likes (user_id, post_id)
//      VALUES ($1, $2)
//      ON CONFLICT (user_id, post_id) DO NOTHING`,
//     [userId, postId]
//   );
//   return result.rowCount > 0;
// };

// /**
//  * Unlike a post
//  */
// const unlikePost = async (userId, postId) => {
//   const result = await query(
//     `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
//     [userId, postId]
//   );
//   return result.rowCount > 0;
// };

// /**
//  * Get likes for a post
//  */
// const getPostLikes = async (postId) => {
//   const result = await query(
//     `SELECT u.id, u.username, u.full_name
//      FROM likes l
//      JOIN users u ON l.user_id = u.id
//      WHERE l.post_id = $1`,
//     [postId]
//   );
//   return result.rows;
// };

// /**
//  * Get posts liked by a user
//  */
// const getUserLikes = async (userId) => {
//   const result = await query(
//     `SELECT p.id, p.content, p.media_url, p.created_at
//      FROM likes l
//      JOIN posts p ON l.post_id = p.id
//      WHERE l.user_id = $1`,
//     [userId]
//   );
//   return result.rows;
// };

// module.exports = {
//   likePost,
//   unlikePost,
//   getPostLikes,
//   getUserLikes,
// };
