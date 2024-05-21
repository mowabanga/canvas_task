import express from "express";
import mysql from "mysql";
import bodyParser from "body-parser";

const app = express();

const PORT = 3000;

// Create a connection to mySql server
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Fricollo7*",
  database: "learning_management",
});

// Connect to MySql server
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySql database: ", err);
    return;
  }
  console.log("Connected to MySql database");
});

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json("Hello world");
});

app.get("/", (req, res) => {
  const query = "SELECT * FROM courses";

  db.query(1, (err, data) => {
    if (err) {
      return req.json(err);
    }
    return res.json(data);
  });
});

// Define a User representation for clarity
const User = {
  tableName: "users",
  createUser: function (newUser, callback) {
    db.query("INSERT INTO " + this.tableName + " SET ?", newUser, callback);
  },
  getUserByEmail: function (email, callback) {
    db.query(
      "SELECT * FROM " + this.tableName + " WHERE email = ?",
      email,
      callback
    );
  },
  getUserByUsername: function (username, callback) {
    db.query(
      "SELECT * FROM " + this.tableName + " WHERE username = ?",
      username,
      callback
    );
  },
};

// Registration route
app.post("/register", (req, res) => {
  // Create a new user object
  const newUser = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    full_name: req.body.full_name,
  };

  // Insert user into MySQL
  User.createUser(newUser, (error, results, fields) => {
    if (error) {
      console.error("Error inserting user: " + error.message);
      return res.status(500).json({ error: error.message });
    } else {
      console.log("Inserted a new user with id " + results.insertId);
      res.status(201).json(newUser);
    }
  });
});

//http:127.0.0.1:3000
app.listen(PORT, () => {
  console.log("Server is connected successfully");
});
