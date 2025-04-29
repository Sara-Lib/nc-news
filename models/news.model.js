const db = require("../db/connection")

const selectTopics = (next) => {
    return db.query('SELECT slug, description FROM topics;')
      .then((result) => {
        return result.rows;
      })
      .catch(next);
  };
  
  module.exports = { selectTopics };