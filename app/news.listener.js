const app = require("./api")

server = app.listen(9090, () => console.log("Listening on port 9090"))

module.exports = server