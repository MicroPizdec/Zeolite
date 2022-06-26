const fs = require("fs");

const buildTimestamp = Date.now();

fs.writeFile("./dist/buildDate.txt", buildTimestamp.toString(), (err) => {
  if (err) throw err;
  console.log("ok");
});