// const { query } = require("../utils/database");

// /**
//  * Comment model for managing post comments
//  * TODO: Implement this model for the comment functionality
//  */

// // TODO: Implement createComment function
// // TODO: Implement updateComment function
// // TODO: Implement deleteComment function
// // TODO: Implement getPostComments function
// // TODO: Implement getCommentById function

// module.exports = {
// 	// Functions will be implemented here
// };




const { query } = require("../utils/database");

/**
 * Comment model for managing post comments
 */

async function createComment(userId, postId, content) {
	try {
		const result = await query(
			`INSERT INTO comments (user_id, post_id, content) 
			 VALUES ($1, $2, $3) RETURNING *`,
			[userId, postId, content]
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
}

async function updateComment(commentId, userId, content) {
	try {
		const result = await query(
			`UPDATE comments 
			 SET content = $1, updated_at = NOW() 
			 WHERE id = $2 AND user_id = $3 
			 RETURNING *`,
			[content, commentId, userId]
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
}

async function deleteComment(commentId, userId) {
	try {
		const result = await query(
			`DELETE FROM comments 
			 WHERE id = $1 AND user_id = $2 
			 RETURNING *`,
			[commentId, userId]
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
}

async function getPostComments(postId) {
	try {
		const result = await query(
			`SELECT c.*, u.username, u.email 
			 FROM comments c
			 JOIN users u ON c.user_id = u.id
			 WHERE c.post_id = $1
			 ORDER BY c.created_at ASC`,
			[postId]
		);
		return result.rows;
	} catch (error) {
		throw error;
	}
}

async function getCommentById(commentId) {
	try {
		const result = await query(
			`SELECT c.*, u.username, u.email 
			 FROM comments c
			 JOIN users u ON c.user_id = u.id
			 WHERE c.id = $1`,
			[commentId]
		);
		return result.rows[0];
	} catch (error) {
		throw error;
	}
}

module.exports = {
	createComment,
	updateComment,
	deleteComment,
	getPostComments,
	getCommentById,
};






// const { query } = require("../utils/database");

// /**
//  * Create a comment
//  */
// const createComment = async ({ user_id, post_id, content }) => {
//   const result = await query(
//     `INSERT INTO comments (user_id, post_id, content)
//      VALUES ($1, $2, $3)
//      RETURNING id, user_id, post_id, content, created_at`,
//     [user_id, post_id, content]
//   );
//   return result.rows[0];
// };

// /**
//  * Update a comment
//  */
// const updateComment = async ({ comment_id, user_id, content }) => {
//   const result = await query(
//     `UPDATE comments 
//      SET content = $1, updated_at = NOW() 
//      WHERE id = $2 AND user_id = $3 AND is_deleted = FALSE
//      RETURNING id, content, updated_at`,
//     [content, comment_id, user_id]
//   );
//   return result.rows[0];
// };

// /**
//  * Delete a comment (soft delete)
//  */
// const deleteComment = async (comment_id, user_id) => {
//   const result = await query(
//     `UPDATE comments 
//      SET is_deleted = TRUE, updated_at = NOW() 
//      WHERE id = $1 AND user_id = $2 AND is_deleted = FALSE`,
//     [comment_id, user_id]
//   );
//   return result.rowCount > 0;
// };

// /**
//  * Get comments for a post
//  */
// const getPostComments = async (post_id) => {
//   const result = await query(
//     `SELECT c.id, c.content, c.user_id, u.username, c.created_at
//      FROM comments c
//      JOIN users u ON c.user_id = u.id
//      WHERE c.post_id = $1 AND c.is_deleted = FALSE
//      ORDER BY c.created_at ASC`,
//     [post_id]
//   );
//   return result.rows;
// };

// /**
//  * Get a single comment by ID
//  */
// const getCommentById = async (comment_id) => {
//   const result = await query(
//     `SELECT id, user_id, post_id, content, created_at, updated_at, is_deleted
//      FROM comments
//      WHERE id = $1`,
//     [comment_id]
//   );
//   return result.rows[0];
// };

// module.exports = {
//   createComment,
//   updateComment,
//   deleteComment,
//   getPostComments,
//   getCommentById,
// };
