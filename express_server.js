const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const app = express();

const PORT = 8080; //default port 8080
const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  }
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

function findUser(email) {
  for (let i = 0; i < Object.values(users).length; i++) {
    if (Object.values(users)[i].email === email) {
      return true;
    }
  }
  return false;
}
// i can use for in loop to make loading faster,
// for (let id in users) {
//  if (users[id].email === email)
// }

function findUserId(email) {
  for (let i = 0; i < Object.values(users).length; i++) {
    if (Object.values(users)[i].email === email) {
      return Object.values(users)[i].id;
    }
  }
  return null;
}

function findUserPassword(email) {
  for (let i = 0; i < Object.values(users).length; i++) {
    if (Object.values(users)[i].email === email) {
      return Object.values(users)[i].password;
    }
  }
  return null;
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");

app.post("/urls", (req, res) => {
  console.log(req.body); // Log the POST request body to the console
  const shorturl = generateRandomString();
  urlDatabase[shorturl] = {
    longURL: req.body.longURL,
    userID: req.cookies.user_id
  };
  console.log(urlDatabase);
  res.redirect(`/urls/${shorturl}`); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const shorturl = req.params.shortURL;
  delete urlDatabase[shorturl];
  res.redirect("/urls");
});

app.post("/urls/:shortURL/edit", (req, res) => {
  const shorturl = req.params.shortURL;
  urlDatabase[shorturl] = req.body.longURL;
  res.redirect(`/urls/${shorturl}`);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let randomID = generateRandomString();

  users[randomID] = {
    id: randomID,
    email: email,
    password: password
  };
  const userId = findUserId(req.body.email);

  if (findUserPassword(email) !== password) {
    res.status(403);
    res.send("The email or password does not match, please try again!");
  } else {
    res.cookie("user_id", userId);
    res.redirect("/urls");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("user_id", "");
  res.redirect("/urls");
});

app.post("/register", (req, res) => {
  let email = req.body.email;
  //let password = req.body.password;
  const password = bcrypt.hashSync(req.body.password, 10);
  //console.log(bcrypt.compareSync(req.body.password, password));
  let randomID = generateRandomString();

  if (email === "" && password === "") {
    res.status(400);
    res.send("email and password are empty");
    return;
  } else if (findUser(email)) {
    res.status(400);
    res.send("email is already register");
    return;
  } else {
    users[randomID] = {
      id: randomID,
      email: email,
      password: password
    };

    res.cookie("user_id", randomID);
    res.redirect("/urls");
  }
});

app.get("/register", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("registration", templateVars);
});

app.get("/login", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  res.render("login", templateVars);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls/new", (req, res) => {
  let templateVars = { user: users[req.cookies.user_id] };
  if (req.cookies.user_id) {
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/:shortURL", (req, res) => {
  let shortUrl = req.params.shortURL;
  // findUser(id) some function that runs and gets me the user object;

  //req.cookies.user_id = 'userRandomID'

  let templateVars = {
    shortURL: shortUrl,
    longURL: urlDatabase[shortUrl].longURL,
    user: users[req.cookies.user_id]
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let shortUrl = req.params.shortURL;
  const longURL = urlDatabase[shortUrl].longURL;
  res.redirect(longURL);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  if (req.cookies.user_id) {
    let filteredUrls = {};
    for (const item of Object.keys(urlDatabase)) {
      console.log(item);
      console.log(urlDatabase[item].userID);
      if (urlDatabase[item].userID === req.cookies.user_id) {
        filteredUrls[item] = urlDatabase[item].longURL;
      }
    }
    let templateVars = { urls: filteredUrls, user: users[req.cookies.user_id] };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
