const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const PORT = 3000;
const currentTaken = "";
const currentPassword = "";

const authenticateToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.redirect("/identify");
  }
  try {
    jwt.verify(token, process.env.TOKEN_KEY);
    next();
  } catch (error) {
    res.status(403).redirect("/identify");
  }
};

const getUserFromToken = async (req) => {
  const token = req.cookies.jwt;
  console.log("token", token);
  const decToken = jwt.verify(token, process.env.TOKEN_KEY);
  const user = await db.getUser(decToken.name);
  console.log("user", user);
  return user;
};

const authRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await getUserFromToken(req);
      if (role.includes(user.role)) {
        next();
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
};
const roles = ["student", "teacher", "admin"];

app.get("/", authenticateToken, authRole(roles), (req, res) => {
  res.render("identify.ejs");
});

app.get("/identify", authenticateToken, authRole(roles), (req, res) => {
  res.render("identify.ejs");
});
app.get("/student1", authenticateToken, authRole(roles), (req, res) => {
  res.render("student1.ejs");
});
app.get("/student2", authenticateToken, authRole(roles), (req, res) => {
  res.render("student2.ejs");
});
app.get("/teacher", authenticateToken, authRole(roles), (req, res) => {
  res.render("teacher.ejs");
});
app.get("/start", authenticateToken, authRole(roles), (req, res) => {
  res.render("start.ejs");
});

app.get("/admin", authenticateToken, authRole("admin"), async (req, res) => {
  const users = await db.getUsers();
  res.render("admin.ejs", { users });
});

app.get("/admin", authenticateToken, authRole("admin"), async (req, res) => {
  const users = await db.getUsers();
  res.render("admin.ejs", { users });
});

app.get("/users/:userId", authenticateToken, async (req, res) => {
  const cookies_token = req.cookies.jwt;
  const decToken = jwt.verify(cookies_token, process.env.TOKEN_KEY);
  const user = await db.getUser(decToken.name);
  console.log("user dynamic", req.params.userId);

  if (req.params.userId !== decToken.name) {
    return res.sendStatus(401);
  }
  if (user.role == "student" && user.name == "student1") {
    res.render("student1.ejs");
  } else if (user.role == "student" && user.name !== "student1") {
    res.render("student2.ejs", { user: user });
  }
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
    getUserFromToken(req);
    res.redirect("/start");
  } else {
    const mg = `incorrect username  or  password`;
    console.log("false");
    res.status(401).render("fail.ejs", { mg });
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

app.listen(PORT, () => {
  console.log(`Listen on port ${PORT}`);
});
