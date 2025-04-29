const endpoints = require('../../endpoints.json');
const { selectTopics } = require('../../models/news.model');

const getApiDocumentation = (req, res) => {
    res.status(200).send({ endpoints });
  };

const getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
    //this is where we catch errors
};

module.exports = {
  getApiDocumentation,
  getTopics
};