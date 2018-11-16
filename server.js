const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

let countries = [];

app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/codes", (req, res) => {
  res.send(countries);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`app running on port ${port}`);
  fs.readFile("./countries.json", "utf8", (err, data) => {
    if (err) throw err;
    countries = JSON.parse(data);
    console.log(
      `Worked! countries array now includes ${countries.length} countries`
    );
  });
});
