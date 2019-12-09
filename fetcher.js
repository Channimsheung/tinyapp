const request = require("request");
const fs = require("fs");
const arg = process.argv;
const path = arg[3];

function callback(body, error) {
  fs.writeFile("page_fetch.txt", body, function(error) {
    if (error) throw error;
    else {
      let size = fs.statSync(path).size;
      console.log(`Downloaded and saved ${size} bytes to ${path}`);
    }
  });
}

request(arg[2], (error, response, body) => {
  let html = body;
  callback(arg[1], html);
});

// request(arg[2], (error, response, body) => {
//   if (error) {
//     console.log("error");
//   } else {
//     callback(body);
//   }
// });
