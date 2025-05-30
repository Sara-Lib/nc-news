const express = require("express");
const db = require("../db/connection");
const { getApiDocumentation, getTopics, getArticleById, getArticles, getCommentsByArticleId, postComment, patchArticleVotes,removeComment, getUsers } = require('./controllers/news.controller');

const app = express();
const cors = require('cors');

app.use((req, res, next) => {
  console.log('TESTING IF CORS ACTIVE');
  next();
});

app.use(cors());
app.use(express.json());

app.get('/api', getApiDocumentation);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchArticleVotes);
app.delete('/api/comments/:comment_id', removeComment);
app.get('/api/users', getUsers);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      console.error(err);
      res.status(500).send({ msg: 'Internal server error' });
    }
  });
  

module.exports = app;
