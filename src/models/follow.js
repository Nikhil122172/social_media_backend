// const { query } = require("../utils/database");

// /**
//  * Follow model for managing user relationships
//  * TODO: Implement this model for the follow functionality
//  */

// // TODO: Implement followUser function
// // TODO: Implement unfollowUser function
// // TODO: Implement getFollowing function
// // TODO: Implement getFollowers function
// // TODO: Implement getFollowCounts function

// module.exports = {
// 	// Functions will be implemented here
// };


const { query } = require("../utils/database");

/**
 * Follow model for managing user relationships
 * Each row in `follows` table represents a follow relationship
 * follower_id -> user who follows
 * following_id -> user who is being followed
 */

const followUser = async (followerId, followingId) => {
  if (followerId === followingId) {
    throw new Error("Users cannot follow themselves");
  }

  const result = await query(
    `INSERT INTO follows (follower_id, following_id)
     VALUES ($1, $2)
     ON CONFLICT (follower_id, following_id) DO NOTHING`,
    [followerId, followingId]
  );

  return result.rowCount > 0;
};

const unfollowUser = async (followerId, followingId) => {
  const result = await query(
    `DELETE FROM follows 
     WHERE follower_id = $1 AND following_id = $2`,
    [followerId, followingId]
  );

  return result.rowCount > 0;
};

const getFollowing = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.email
     FROM follows f
     JOIN users u ON f.following_id = u.id
     WHERE f.follower_id = $1`,
    [userId]
  );

  return result.rows;
};

const getFollowers = async (userId) => {
  const result = await query(
    `SELECT u.id, u.username, u.email
     FROM follows f
     JOIN users u ON f.follower_id = u.id
     WHERE f.following_id = $1`,
    [userId]
  );

  return result.rows;
};

const getFollowCounts = async (userId) => {
  const result = await query(
    `SELECT 
        (SELECT COUNT(*) FROM follows WHERE follower_id = $1) AS following_count,
        (SELECT COUNT(*) FROM follows WHERE following_id = $1) AS followers_count`,
    [userId]
  );

  return result.rows[0];
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowing,
  getFollowers,
  getFollowCounts,
};
