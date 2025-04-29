const express = require("express");
const db = require("../db/connection");
const { getApiDocumentation, getTopics, getArticleById, getArticles } = require('./controllers/news.controller');

const app = express()
app.use(express.json())

app.get('/api', getApiDocumentation);
app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles', getArticles)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {
      console.error(err);
      res.status(500).send({ msg: 'Internal server error' });
    }
  });
  

module.exports = app;
