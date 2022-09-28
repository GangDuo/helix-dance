const fs = require('fs');
let json = JSON.parse(fs.readFileSync("history.json"));

console.log(json)