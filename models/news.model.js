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
  
  module.exports = { selectTopics, selectArticleById };