const endpoints = require('../../endpoints.json');
const { selectTopics, selectArticleById } = require('../../models/news.model');

const getApiDocumentation = (req, res) => {
    res.status(200).send({ endpoints });
  };

const getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
    //this is where we catch errors!
};

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
  
    selectArticleById(article_id)
      .then((article) => {
        if (!article) {
            return Promise.reject({ status: 404, msg: 'Article not found' });
          }
        res.status(200).send({ article });
      })
      .catch(next);
  };

module.exports = {
  getApiDocumentation,
  getTopics,
  getArticleById
};