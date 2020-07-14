var express = require("express");
var router = express.Router();
require("dotenv").config();

const { MongoClient } = require("mongodb");

const mongo_uri =
  "mongodb+srv://justin:alhambra1@iwashere.yap7b.mongodb.net/IWasHere?retryWrites=true&w=majority";
const client = new MongoClient(mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function listDatabases(client) {
  await client.connect();
  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  client.close();
}

async function insertToDataBase(client, user) {
  await client.connect();

  console.log("Connected correctly to server");
  const db = client.db("IWasHere");
  db.collection("Entries").insertOne(user, function (err, r) {
    if (err) throw err;
    console.log(r);
    client.close();
  });
}

const fs = require("fs");
const fetch = require("isomorphic-fetch");

const { throws } = require("assert");

const dataFile = require("./dataFile");

let users = dataFile.getUsers();
const formIds = new Set();

router.get("/", function (req, res, next) {
  sendIndex(res);
});

router.post("/data", function (req, res, next) {
  if (isRequestValid(req)) {
    formIds.delete(req.body.formId);
    fetchGoogle(req, res);
  } else {
    sendIndex(res);
    res.end();
  }
});

function isRequestValid(req) {
  return formIds.has(req.body.formId);
}

const fetchGoogle = (req, res) => {
  const secret_key = process.env.CAPTCHA_SECRET;
  const token = req.body.token;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${token}`;

  fetch(url, {
    method: "post",
  })
    .then((response) => response.json())
    .then((google_response) => {
      if (google_response.success) {
        addUser(req.body);
        sendIndex(res);
      } else {
        res.json({ google_response });
      }
    })
    .catch((error) => res.json({ error }));
};
function addUser(query) {
  let newUser = new dataFile.User(query.name, Date.now(), query.message);
  insertToDataBase(client, newUser);
  dataFile.addUserToFile(newUser);
  users = [newUser, ...users];
}

function sendIndex(res) {
  const id = getRandomId();
  formIds.add(id);
  res.render("index", {
    title: "We were here",
    formId: id,
    users: users,
    googleReCaptcha: process.env.CAPTCHA_PUBLIC,
  });
}

function getRandomId() {
  return (
    generateRandomNumber() +
    "" +
    generateRandomNumber() +
    "" +
    generateRandomNumber()
  );
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 10000);
}

module.exports = router;
