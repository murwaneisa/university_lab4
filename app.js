const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./database");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const PORT = 3000;
const currentTaken = "";
const currentPassword = "";

const userFromToken = async (token) => {
  token = req.cookies.jwt;
  const decryptedToken = jwt.verify(token, process.env.TOKEN);
  const user = await db.getUser(decryptedToken.user);
  return user;
};
const authenticateToken = (req, res, nex) => {};

app.get("/", (req, res) => {
  res.render("identify.ejs");
});

app.get("/identify", (req, res) => {
  res.render("identify.ejs");
});
app.get("/student1", (req, res) => {
  res.render("student1.ejs");
});
app.get("/student2", (req, res) => {
  res.render("student2.ejs");
});
app.get("/teacher", (req, res) => {
  res.render("teacher.ejs");
});
app.get("/start", (req, res) => {
  res.render("start.ejs");
});

app.post("/identify", async (req, res) => {
  const { username, password } = req.body;
  //encrypt the password
  const user = await db.getUser(username);
  //console.log("username", user.password);

  //if user is found
  if (await bcrypt.compare(password, user.password)) {
    console.log("true");
    const cookieOptions = {
      httpOnly: true, // Set cookie to httpOnly it can only be accessed by the server and not by client-side scripts.
      maxAge: 86400000, // Set cookie to expire after 1 day (in milliseconds)
    };
    const token = jwt.sign(user, process.env.TOKEN_KEY);
    console.log("TOKEN", token);
    res.cookie("jwt", token, cookieOptions);
    res.status(200);
    res.redirect("/start");
  } else {
    const mg = `incorrect username  or  password`;
    console.log("false");
    res.status(401).render("fail.ejs", mg);
  }
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const { username, role, password } = req.body;
  console.log(username, role, password);
  try {
    if (req.body !== "") {
      //encrypt the password
      const bcryptPass = await bcrypt.hash(password, 10);
      db.insertUser(username, role, bcryptPass);
    }
    res.redirect("/");
  } catch (error) {
    res.render("fail.ejs");
  }
});

app.get("/admin", async (req, res) => {
  const users = await db.getUsers();

  res.render("admin.ejs", { users });
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
