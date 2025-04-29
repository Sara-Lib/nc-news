const endpoints = require('../../endpoints.json');
const { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId } = require('../../models/news.model');

const getApiDocumentation = (req, res) => {
    res.status(200).send({endpoints});
  };

const getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({topics});
    })
    .catch(next);
    //this is where we catch errors! not in the model
};

const getArticleById = (req, res, next) => {
    const { article_id } = req.params;
  
    selectArticleById(article_id)
      .then((article) => {
        if (!article) {
            return Promise.reject({ status: 404, msg: 'Article not found' });
          }
        res.status(200).send({article});
      })
      .catch(next);
  };


  const getArticles = (req, res, next) => {
    selectAllArticles()
      .then((articles) => {
        res.status(200).send({articles});
      })
      .catch(next);
  };

  const getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;

    selectCommentsByArticleId(article_id)
    .then((comments) => {
        res.status(200).send({ comments });
    })
    .catch(next);
  };


module.exports = {
  getApiDocumentation,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId
};