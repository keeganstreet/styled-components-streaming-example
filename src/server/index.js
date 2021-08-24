import path from "path";
import express from "express";
import { renderToNodeStream } from "react-dom/server";
import { ServerStyleSheet } from "styled-components";
import { App } from "../app";
const app = express();
const port = 3000;

const staticPath = path.join(__dirname, "../client");

app.use("/public", express.static(staticPath));

app.get("/", (req, res) => {
  res.write(`<html>
    <head>
      <title>Test</title>
      <script src="/public/index.js" defer></script>
    </head>
    <body>
    <div id="app">`);
  const sheet = new ServerStyleSheet();
  const jsx = sheet.collectStyles(<App />);
  const stream = sheet.interleaveWithNodeStream(renderToNodeStream(jsx));
  stream.pipe(res, { end: false });
  stream.on("end", () => res.end("</div></body></html>"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
