const sqlite3 = require("sqlite3").verbose();

//connect to the database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("connected to library db in sqlite");
});

const insertUser = () => {
  console.log("insert user");
};

module.exports = {
  insertUser,
};
