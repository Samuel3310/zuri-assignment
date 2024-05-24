// const http = require("node:http");
// const fs = require("fs");
// const path = require("path");

// const server = http.createServer((req, res) => {
//   if (req.method === "POST" && req.url === "/database.json") {
//     let body = "";
//     req.on("data", (chunk) => {
//       body += chunk.toString();
//     });
//     req.on("end", () => {
//       const formData = JSON.parse(body);
//       const filePath = path.join(__dirname, "database.json");
//       fs.writeFile(filePath, JSON.stringify(formData, null, 4), (err) => {
//         if (err) {
//           console.error(err);
//           res.statusCode = 500;
//           res.end("Error writing to file");
//         } else {
//           res.end("Form data submitted successfully");
//         }
//       });
//     });
//   } else {
//     res.end("Invalid request");
//   }
// });

// server.listen(3000, () => {
//   console.log("Server listening on port 3000");
// });
const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/database.json") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const formData = JSON.parse(body);
      const filePath = path.join(__dirname, "database.json");

      // Read the existing data from the file (if it exists)
      fs.readFile(filePath, (err, data) => {
        let existingData = [];
        if (!err && data.length > 0) {
          try {
            existingData = JSON.parse(data);
          } catch (parseErr) {
            console.error("Error parsing existing data", parseErr);
          }
        }

        // Append new form data to existing data
        existingData.push(formData);

        // Write the updated data back to the file
        fs.writeFile(
          filePath,
          JSON.stringify(existingData, null, 4),
          (writeErr) => {
            if (writeErr) {
              console.error(writeErr);
              res.statusCode = 500;
              res.end("Error writing to file");
            } else {
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({ message: "Form data submitted successfully" })
              );
            }
          }
        );
      });
    });
  } else {
    res.statusCode = 404;
    res.end("Invalid request");
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
