const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const db = require("./database");
const jwt = require("jsonwebtoken");
//require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

db.insertUser();
