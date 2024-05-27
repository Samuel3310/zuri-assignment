const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  if (req.method === "POST" && req.url === "/data") {
    let data = "";

    req.on("data", (chunk) => {
      data += chunk.toString();
    });

    req.on("end", () => {
      try {
        const parsedData = JSON.parse(data);
        res.writeHead(201, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(
          JSON.stringify({
            message: "Form data received successfully",
            data: parsedData,
          }),
          console.log(JSON.stringify(parsedData)),
          fs.writeFile(
            "database.json",
            JSON.stringify(parsedData),
            (err, data) => {
              if (err) {
                console.error(err);
                res.statusCode = 500;
                res.end("Error writing to file");
              } else {
                res.end(
                  JSON.stringify({
                    message: "Form data submitted successfully",
                    data: parsedData,
                  })
                );
              }
            }
          )
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        });
        res.end(JSON.stringify({ error: "Invalid JSON" }));
      }
    });
  } else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
      "Access-Control-Allow-Origin": "*",
    });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
