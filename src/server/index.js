import path from "path";
import { Writable } from "stream";
import express from "express";
import { renderToPipeableStream } from "react-dom/server";
import { ABORT_DELAY, API_DELAY, JS_BUNDLE_DELAY } from "./delays";
import { App } from "../app";
import { DataProvider } from "../app/data";
const app = express();
const port = 3000;

const staticPath = path.join(__dirname, "../client");

app.use((req, res, next) => {
  if (req.url.startsWith("/public")) {
    // Artificially delay serving JS
    // to demonstrate streaming HTML.
    setTimeout(next, JS_BUNDLE_DELAY);
  } else {
    next();
  }
});

app.use("/public", express.static(staticPath));

app.get("/", (req, res) => {
  res.socket.on("error", (error) => {
    console.error("Fatal", error);
  });
  let didError = false;
  const data = createServerData();

  const stream = new Writable({
    write(chunk, _encoding, cb) {
      res.write(chunk, cb);
    },
    final() {
      const comments = data.read();
      res.write(`<script>
        window.ExchangeComments = ${JSON.stringify(comments)};
      </script>`)
      res.end("</div></body></html>");
    },
  });

  const pipeableStream = renderToPipeableStream(
    <DataProvider data={data}>
      <App />
    </DataProvider>,
    {
      bootstrapScripts: ["/public/index.js"],
      onShellReady() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        res.write(`<html>
          <head>
            <title>Test</title>
          </head>
          <body>
          <div id="app">`
        );
        pipeableStream.pipe(stream);
      },
      onError(x) {
        didError = true;
        console.error(x);
      }
    }
  );
  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(() => pipeableStream.abort(), ABORT_DELAY);
});

// Simulate a delay caused by data fetching.
// We fake this because the streaming HTML renderer
// is not yet integrated with real data fetching strategies.
function createServerData() {
  let done = false;
  let promise = null;
  const fakeData = [
    "Wait, it doesn't wait for React to load?",
    "How does this even work?",
    "I like marshmallows",
  ];

  return {
    read() {
      if (done) {
        return fakeData;
      }
      if (promise) {
        throw promise;
      }
      promise = new Promise((resolve) => {
        setTimeout(() => {
          done = true;
          promise = null;
          resolve();
        }, API_DELAY);
      });
      throw promise;
    },
  };
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
