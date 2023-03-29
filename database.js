const { raw } = require("express");

const sqlite3 = require("sqlite3").verbose();

//connect to the database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("connected to library db in sqlite");
});

const insertUser = () => {
  /*  db.run(
    `INSERT INTO USERS (name, email, username, password) VALUES(?,?,?,?)`,
    [name, email, password, bcrypt],
    function (err) {
      if (err) {
        return console.log("errror" + err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with rowid ${this.lastID}`);
    }
  ); */
};

const getUsers = async (username) => {
  const queryBook = "SELECT * FROM users";
  return new Promise((resolve, reject) => {
    db.all(queryBook, [], (err, row) => {
      if (err) reject();
      else resolve(row);
      //console.log("raw", row);
    });
  });
};

module.exports = {
  insertUser,
  getUsers,
};
