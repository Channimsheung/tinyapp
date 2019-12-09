const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const PORT = 8080; //default port 8080
const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  let input = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  let output = "";
  for (let i = 0; i < 6; i++) {
    let rnum = Math.floor(Math.random() * input.length);
    output += input.substring(rnum, rnum + 1);
  }
  return output;
}

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let shortUrl = req.params.shortURL;
  let templateVars = { shortURL: shortUrl, longURL: urlDatabase[shortUrl] };
  res.render("urls_show", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
