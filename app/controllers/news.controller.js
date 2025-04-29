const endpoints = require('../../endpoints.json');
const { selectTopics } = require('../../models/news.model');

const getApiDocumentation = (req, res, next) => {
    res.status(200).send({ endpoints });
  };

const getTopics = (req, res, next) => {
  selectTopics(next)
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

module.exports = {
  getApiDocumentation,
  getTopics
};