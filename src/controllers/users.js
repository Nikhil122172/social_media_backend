// TODO: Implement users controller
// This controller should handle:
// - Following a user
// - Unfollowing a user
// - Getting users that the current user is following
// - Getting users that follow the current user
// - Getting follow counts for a user

// const logger = require("../utils/logger");

// TODO: Implement follow function
// TODO: Implement unfollow function
// TODO: Implement getMyFollowing function
// TODO: Implement getMyFollowers function

// module.exports = {
	// Functions will be implemented here
// };


// controllers/users.controller.js
// const User = require("../models/user"); // Assuming you have User model
// const logger = require("../utils/logger");

// // Follow a user
// const follow = async (req, res) => {
// 	try {
// 		const { userId } = req.body; // user to follow
// 		const currentUserId = req.user.id; // from auth middleware

// 		if (userId === currentUserId) {
// 			return res.status(400).json({ message: "You cannot follow yourself" });
// 		}

// 		const user = await User.findById(userId);
// 		const currentUser = await User.findById(currentUserId);

// 		if (!user || !currentUser) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		if (currentUser.following.includes(userId)) {
// 			return res.status(400).json({ message: "Already following this user" });
// 		}

// 		currentUser.following.push(userId);
// 		user.followers.push(currentUserId);

// 		await currentUser.save();
// 		await user.save();

// 		res.status(200).json({ message: "Followed successfully" });
// 	} catch (error) {
// 		logger.error(error.message);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };

// // Unfollow a user
// const unfollow = async (req, res) => {
// 	try {
// 		const { userId } = req.body;
// 		const currentUserId = req.user.id;

// 		const user = await User.findById(userId);
// 		const currentUser = await User.findById(currentUserId);

// 		if (!user || !currentUser) {
// 			return res.status(404).json({ message: "User not found" });
// 		}

// 		currentUser.following = currentUser.following.filter(id => id.toString() !== userId);
// 		user.followers = user.followers.filter(id => id.toString() !== currentUserId);

// 		await currentUser.save();
// 		await user.save();

// 		res.status(200).json({ message: "Unfollowed successfully" });
// 	} catch (error) {
// 		logger.error(error.message);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };

// // Get my following
// const getMyFollowing = async (req, res) => {
// 	try {
// 		const currentUser = await User.findById(req.user.id).populate("following", "name email");
// 		res.status(200).json(currentUser.following);
// 	} catch (error) {
// 		logger.error(error.message);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };

// // Get my followers
// const getMyFollowers = async (req, res) => {
// 	try {
// 		const currentUser = await User.findById(req.user.id).populate("followers", "name email");
// 		res.status(200).json(currentUser.followers);
// 	} catch (error) {
// 		logger.error(error.message);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };

// // Get follow stats
// const getFollowStats = async (req, res) => {
// 	try {
// 		const user = await User.findById(req.user.id);
// 		res.status(200).json({
// 			followers: user.followers.length,
// 			following: user.following.length,
// 		});
// 	} catch (error) {
// 		logger.error(error.message);
// 		res.status(500).json({ message: "Server error" });
// 	}
// };

// module.exports = {
// 	follow,
// 	unfollow,
// 	getMyFollowing,
// 	getMyFollowers,
// 	getFollowStats,
// };



// controllers/users.js
// const { query } = require("../db");
// const logger = require("../utils/logger");

// /**
//  * Follow a user
//  */
// const follow = async (req, res) => {
// 	try {
// 		const { user_id: followingId } = req.body; // user to follow
// 		const followerId = req.user.id; // from auth

// 		if (followerId === followingId) {
// 			return res.status(400).json({ error: "You cannot follow yourself" });
// 		}

// 		await query(
// 			`INSERT INTO follows (follower_id, following_id) 
// 			 VALUES ($1, $2) 
// 			 ON CONFLICT (follower_id, following_id) DO NOTHING`,
// 			[followerId, followingId]
// 		);

// 		res.json({ message: "Followed successfully" });
// 	} catch (error) {
// 		logger.critical("Follow error:", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// /**
//  * Unfollow a user
//  */
// const unfollow = async (req, res) => {
// 	try {
// 		const { user_id: followingId } = req.body;
// 		const followerId = req.user.id;

// 		const result = await query(
// 			`DELETE FROM follows 
// 			 WHERE follower_id = $1 AND following_id = $2`,
// 			[followerId, followingId]
// 		);

// 		if (result.rowCount === 0) {
// 			return res.status(404).json({ error: "Not following this user" });
// 		}

// 		res.json({ message: "Unfollowed successfully" });
// 	} catch (error) {
// 		logger.critical("Unfollow error:", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// /**
//  * Get my following
//  */
// const getMyFollowing = async (req, res) => {
// 	try {
// 		const userId = req.user.id;

// 		const result = await query(
// 			`SELECT u.id, u.username, u.full_name
// 			 FROM follows f
// 			 JOIN users u ON f.following_id = u.id
// 			 WHERE f.follower_id = $1`,
// 			[userId]
// 		);

// 		res.json({ following: result.rows });
// 	} catch (error) {
// 		logger.critical("Get following error:", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// /**
//  * Get my followers
//  */
// const getMyFollowers = async (req, res) => {
// 	try {
// 		const userId = req.user.id;

// 		const result = await query(
// 			`SELECT u.id, u.username, u.full_name
// 			 FROM follows f
// 			 JOIN users u ON f.follower_id = u.id
// 			 WHERE f.following_id = $1`,
// 			[userId]
// 		);

// 		res.json({ followers: result.rows });
// 	} catch (error) {
// 		logger.critical("Get followers error:", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// /**
//  * Get follow stats (counts)
//  */
// const getFollowStats = async (req, res) => {
// 	try {
// 		const userId = req.user.id;

// 		const followersCount = await query(
// 			`SELECT COUNT(*) FROM follows WHERE following_id = $1`,
// 			[userId]
// 		);

// 		const followingCount = await query(
// 			`SELECT COUNT(*) FROM follows WHERE follower_id = $1`,
// 			[userId]
// 		);

// 		res.json({
// 			followers: parseInt(followersCount.rows[0].count, 10),
// 			following: parseInt(followingCount.rows[0].count, 10),
// 		});
// 	} catch (error) {
// 		logger.critical("Get follow stats error:", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

// module.exports = {
// 	follow,
// 	unfollow,
// 	getMyFollowing,
// 	getMyFollowers,
// 	getFollowStats,
// };


// controllers/users.js
const followModel = require("../models/follow");
const logger = require("../utils/logger");

/**
 * Follow a user
 */
const follow = async (req, res) => {
	try {
		const { user_id: followingId } = req.body; // user to follow
		const followerId = req.user.id; // from auth

		if (followerId === followingId) {
			return res.status(400).json({ error: "You cannot follow yourself" });
		}

		await followModel.followUser(followerId, followingId);

		res.json({ message: "Followed successfully" });
	} catch (error) {
		logger.critical("Follow error:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Unfollow a user
 */
const unfollow = async (req, res) => {
	try {
		const { user_id: followingId } = req.body;
		const followerId = req.user.id;

		const success = await followModel.unfollowUser(followerId, followingId);

		if (!success) {
			return res.status(404).json({ error: "Not following this user" });
		}

		res.json({ message: "Unfollowed successfully" });
	} catch (error) {
		logger.critical("Unfollow error:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get my following
 */
const getMyFollowing = async (req, res) => {
	try {
		const userId = req.user.id;
		const following = await followModel.getFollowing(userId);
		res.json({ following });
	} catch (error) {
		logger.critical("Get following error:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get my followers
 */
const getMyFollowers = async (req, res) => {
	try {
		const userId = req.user.id;
		const followers = await followModel.getFollowers(userId);
		res.json({ followers });
	} catch (error) {
		logger.critical("Get followers error:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

/**
 * Get follow stats (counts)
 */
const getFollowStats = async (req, res) => {
	try {
		const userId = req.user.id;
		const counts = await followModel.getFollowCounts(userId);

		res.json({
			followers: counts.followers,
			following: counts.following,
		});
	} catch (error) {
		logger.critical("Get follow stats error:", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = {
	follow,
	unfollow,
	getMyFollowing,
	getMyFollowers,
	getFollowStats,
};
