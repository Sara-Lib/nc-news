const express = require("express");
const db = require("../db/connection");
const { getApiDocumentation, getTopics } = require('./controllers/news.controller');

const app = express()
app.use(express.json())

app.get('/api', getApiDocumentation);

app.get('/api/topics', getTopics);

module.exports = app;
