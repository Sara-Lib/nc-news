const db = require("../db/connection")

const selectTopics = () => {
    return db.query('SELECT slug, description FROM topics;')
      .then((result) => {
        return result.rows;
      })
  };
  //no need for catch (next ) here, its in the controller
  
  module.exports = { selectTopics };