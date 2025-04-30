const db = require("../db/connection")

const selectTopics = () => {
    return db.query('SELECT slug, description FROM topics;')
      .then((result) => {
        return result.rows;
      })
  };
  //no need for catch (next ) here, its in the controller

  const selectArticleById = (article_id) => {
    if (isNaN(Number(article_id))) {
      return Promise.reject({ status: 400, msg: 'Invalid article ID' });
    }
  
    return db.query('SELECT * FROM articles WHERE article_id = $1;', [article_id])
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: 'Article not found' });
        }
        return rows[0];
      });
  };

  const selectAllArticles = () => {
    const queryStr = `
      SELECT articles.author, articles.title, articles.article_id, articles.topic,
             articles.created_at, articles.votes, articles.article_img_url,
             COUNT(comments.comment_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;
    `;
  //use ::INT to cast as int quickly like with CAST(), otherwise it will be a string
    return db.query(queryStr).then(({ rows }) => {
      return rows;
    });
  };

  const selectCommentsByArticleId = (article_id) => {
    if (isNaN(Number(article_id))) {
        return Promise.reject({ status:400, msg:"Invalid article ID"})
    }
    
    return db.query(`
        SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
        WHERE article_id = $1
        ORDER BY created_at DESC;
        `,
        [article_id]
        
    )
    .then(({rows}) => rows);
};

const insertComment = (article_id, username, body) => {
      if (isNaN(Number(article_id))) {
          return Promise.reject({ status:400, msg:"Invalid article ID"})
      }
    if (!body || !username) {
        return Promise.reject({ status: 400, msg: 'Missing required fields' });
      }
    
      return db.query(`
          INSERT INTO comments (author, body, article_id)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
          [username, body, article_id]
        )
        .then(({ rows }) => rows[0])
        .catch((err) => {
            if (err.code === '23503') {
                return Promise.reject({ status: 404, msg: 'Article not found' });
              }
        })
  };

const updateArticleVotesById = (article_id, inc_votes) => {
         if (isNaN(Number(article_id))) {
        return Promise.reject({ status: 400, msg: 'Invalid article ID' });
         }
         if (typeof inc_votes !== 'number') {
        return Promise.reject({ status: 400, msg: 'Missing or invalid inc_votes' });
         }

        return db.query(`
            UPDATE articles
            SET votes = votes + $1
            WHERE article_id = $2
            RETURNING *;
        `,
        [inc_votes, article_id]
        )
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article not found' });
            }
            return rows[0]
        })
        .catch((err) => {
            if (err.code === '23503') {
                return Promise.reject({ status: 404, msg: 'Article not found' });
              }
        })
    };
    
const deleteCommentById = (comment_id) => {
        return db.query(`
            DELETE FROM comments
            WHERE comment_id = $1
            RETURNING *;
            `,
            [comment_id]
        )
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Comment not found' });
            }
            return rows[0]; //I think I don't need it here?
        })
        .catch((err) => {
            if (err.code === '22P02') {
                return Promise.reject({ status: 400, msg: 'Invalid comment ID' });
              }
              return Promise.reject(err);
        });
  };

  const selectAllUsers = () => {
    return db.query(`
        SELECT * FROM users;
        `)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'User not found' });
            }
            return rows;
        })
        .catch();
  };

  
  module.exports = { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertComment, updateArticleVotesById, deleteCommentById, selectAllUsers};