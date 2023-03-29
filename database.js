const { raw } = require("express");

const sqlite3 = require("sqlite3").verbose();

//connect to the database
const db = new sqlite3.Database("./users.db", (err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("connected to library db in sqlite");
});

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

const getUser = async (username) => {
  const queryBook = "SELECT * FROM USERS WHERE username LIKE ?";
  return new Promise((resolve, reject) => {
    db.each(queryBook, [username], (err, row) => {
      if (err) reject();
      else resolve(row);
    });
  });
};

const insertUser = (name, role, encryptedPAss) => {
  db.run(
    `INSERT INTO users (name, role, password) VALUES(?,?,?)`,
    [name, role, encryptedPAss],
    function (err) {
      if (err) {
        return console.log("error" + err.message);
      }
      // get the last insert id
      console.log(`A row has been inserted with row id ${this.lastID}`);
    }
  );
};

module.exports = {
  insertUser,
  getUsers,
  getUser,
};
