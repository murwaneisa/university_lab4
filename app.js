const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./database");
const jwt = require("jsonwebtoken");
//require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

/* const filePath = path.join(__dirname, "./views");
app.set("views", filePath);
console.log("first", filePath); */
const PORT = 3000;

app.get("/admin", async (req, res) => {
  const users = await db.getUsers();
  console.log("users", users);
  res.render("admin.ejs", { users });
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
