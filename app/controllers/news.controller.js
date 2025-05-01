const { articleData } = require('../../db/data/test-data');
const endpoints = require('../../endpoints.json');
const { selectTopics, selectArticleById, selectAllArticles, selectCommentsByArticleId, insertComment, updateArticleVotesById, deleteCommentById, selectAllUsers} = require('../../models/news.model');
const { use } = require('../api');

const getApiDocumentation = (req, res) => {
    res.status(200).send({endpoints});
  };

const getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({topics});
    })
    .catch(next);
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
      const {sort_by, order} = req.query;

        selectAllArticles(sort_by, order)
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
    
    const postComment = (req, res, next) => {
        const {article_id} = req.params;
        const {username, body} = req.body;
        
        insertComment(article_id, username, body)
        .then((comment) => {
            res.status(201).send(({ comment }));
        })
        .catch(next);
    };
    
    const patchArticleVotes = (req, res, next) => {
      const {article_id} = req.params;
      const {inc_votes} = req.body;

    updateArticleVotesById(article_id, inc_votes)
        .then((updatedArticle) => {
            if (!updatedArticle) {
                return res.status(404).send({ msg: 'Article not found' });
              }
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
  };

  const removeComment = (req, res, next) => {
    const {comment_id} = req.params;

    deleteCommentById(comment_id)
        .then(() => {
            res.status(204).send();
        })
        .catch(next);
  };

  const getUsers = (req, res, next) => {
    selectAllUsers()
        .then((users) => {
            res.status(200).send({users});
        })
        .catch(next);
  };


module.exports = {
  getApiDocumentation,
  getTopics,
  getArticleById,
  getArticles,
  getCommentsByArticleId,
  postComment,
  patchArticleVotes,
  removeComment,
  getUsers
};