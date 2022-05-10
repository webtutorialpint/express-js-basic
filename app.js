const express = require("express");
const app = express();

var bodyParser = require("body-parser");
var cors = require("cors");

var fs = require("fs");

app.use(express.urlencoded({ extended: true }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "50000mb",
    parameterLimit: 50000,
  })
);

//To parse json data
app.use(express.json());

app.use(cors());

var whitelist = ["http://localhost", "http://www.abc.com"]; //white list consumers
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true, //Credentials are cookies, authorization headers or TLS client certificates.
};
app.use(cors(corsOptions)); //adding cors middleware to the express with above configurations

app.get("/", (req, res) => {
  res.json("Welcome to Express JS");
});

// START BASIC ROUTING
let products = [];

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.post("/api/products", (req, res) => {
  let product = {};
  product = req.body;
  products.push({ ...product });
  res.json(products);
});

app.put("/api/products", (req, res) => {
  let product = {};
  product = req.body;
  products.map((prod, index) => {
    if (prod.id == product.id) {
      products[index] = { ...product };
    }
  });
  res.json(products);
});
app.delete("/api/products/:id", (req, res) => {
  let ID = 0;
  ID = req.params.id;
  products = products.filter((prod) => prod.id.toString() !== ID.toString());
  res.json(products);
});
// END BASIC ROUTING

// START FILE SYSTEM

app.get("/api/file/write", (req, res) => {
  const content = "Test file content";

  fs.writeFile("./test.txt", content, (err) => {
    if (err) {
      console.error(err);
      return;
    } else {
      res.json("file written successfully");
    }
  });
});

app.get("/api/file/read", (req, res) => {
  const content = "Test file content";
  fs.readFile("./test.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    } else {
      res.json(data);
    }
  });
});

// END FILE SYSTEM

app.listen(process.env.port || 2000);
console.log("Web Server is listening at port " + (process.env.port || 2000));
