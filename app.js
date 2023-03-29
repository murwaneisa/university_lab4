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

const PORT = 3000;
const currentTaken = "";
const currentPassword = "";

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

app.post("/identify", (req, res) => {
  const userPass = req.body.password;
  const token = jwt.sign(userPass, process.env.token);
  console.log("token", token);
  /*  currentPassword = userPass;
  res.redirect("start.ejs"); */
});

app.post("/", async (req, res) => {
  const { username, password } = req.body;
  try {
    if (req.body !== "") {
      //encrypt the password
      const success = await db.getUser(username);
      if (success) {
        //if user is found
        if (await bcrypt.compare(password, success.password)) {
          console.log("true");
          res.render("home.ejs");
          var token = jwt.sign("username", process.env.token);
          console.log(token);
        } else {
          console.log("false");
          res.render("wrongPass.ejs");
        }
      }
    }
  } catch (error) {
    res.render("error.ejs");
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
  console.log("users", users);
  res.render("admin.ejs", { users });
});

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
