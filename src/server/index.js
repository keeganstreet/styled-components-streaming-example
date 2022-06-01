import path from "path";
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
  const stream = renderToPipeableStream(
    <DataProvider data={data}>
      <App />
    </DataProvider>,
    {
      bootstrapScripts: ["/public/index.js"],
      onShellReady() {
        // If something errored before we started streaming, we set the error code appropriately.
        res.statusCode = didError ? 500 : 200;
        res.setHeader("Content-type", "text/html");
        stream.pipe(res);
      },
      onError(x) {
        didError = true;
        console.error(x);
      },
    }
  );
  // Abandon and switch to client rendering if enough time passes.
  // Try lowering this to see the client recover.
  setTimeout(() => stream.abort(), ABORT_DELAY);
});

// Simulate a delay caused by data fetching.
// We fake this because the streaming HTML renderer
// is not yet integrated with real data fetching strategies.
function createServerData() {
  let done = false;
  let promise = null;
  return {
    read() {
      if (done) {
        return;
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
