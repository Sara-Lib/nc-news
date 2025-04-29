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
  
  module.exports = { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId};