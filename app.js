const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const { Pool, Client } = require("pg");
const format = require("pg-format");
const products = require("./app/data/products");
const dbconfig = require("./app/config/database");

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger("dev"));

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const pool = new Pool(dbconfig);

const auth = (req, res, next, permission) => {
  // Grab the "Authorization" header.
  const auth = req.get("authorization");

  // On the first request, the "Authorization" header won't exist, so we'll set a Response
  // header that prompts the browser to ask for a username and password.
  if (!auth) {
    res.set("WWW-Authenticate", 'Basic realm="Authorization Required"');
    // If the user cancels the dialog, or enters the password wrong too many times,
    // show the Access Restricted error message.
    return res.status(401).send("Authorization Required");
  }

  // If the user enters a username and password, the browser re-requests the route
  // and includes a Base64 string of those credentials.
  const credentials = new Buffer(auth.split(" ").pop(), "base64")
    .toString("ascii")
    .split(":");

  var sql = "";
  if (permission && permission != null) {
    sql = format(
      "select count(*) from user_permission up inner join public.user u on (u.id = up.user_id) inner join public.permission p on (p.id = up.permission_id) where u.login_id = '%s' and u.password = '%s' and p.name = '%s' ",
      credentials[0],
      credentials[1],
      permission
    );
  } else {
    sql = format(
      "select count(*) from public.user where login_id = '%s' and password = '%s'",
      credentials[0],
      credentials[1]
    );
  }
  console.log(sql);
  pool.query(sql, (err, rslt) => {
    console.log(err, rslt);
    if (
      rslt.rows &&
      rslt.rows[0] &&
      rslt.rows[0].count &&
      rslt.rows[0].count > 0
    ) {
      //pool.end();
      next();
    } else {
      // The user typed in the username or password wrong.
      return res.status(403).send("Access Denied (incorrect credentials)");
    }
  });
};

const guard = (req, res, next) => {
  // we’ll use a case switch statement on the route requested
  switch (req.path) {
    case "/products": {
      next();
      break;
    }
    case "/order": {
      auth(req, res, next, null);
      break;
    }

    case "/pending": {
      auth(req, res, next, "admin");
      break;
    }
  }
};

// existing app.use middleware
app.use(guard);

// routes

// Implement the products API endpoint
app.get("/products", function(req, res) {
  res.json(products);
});

// Implement the order API endpoint
app.post("/order", function(req, res) {
  console.log(req.body);
  var order = {
    orderId: "WEB828738" + Math.floor(Math.random() * 200),
    message:
      "Thank you!. We have received your order, admin will review and approve the order for shipment."
  };
  res.json(order);
});

// Implement the pending API endpoint
app.put("/pending", function(req, res) {
  console.log(req.body);
  res.json({ status: "approved" });
});

module.exports = app;
