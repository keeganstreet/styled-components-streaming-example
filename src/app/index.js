import { Suspense, lazy } from "react";
import Html from "./Html";
import Counter from "./Counter";
const Comments = lazy(() => import("./Comments" /* webpackPrefetch: true */));

export const App = () => (
  <Html title="Hello">
    <p>This page is streamed with ReactDOM.renderToPipeableStream.</p>
    <Counter />
    <section className="comments">
      <h2>Comments</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Comments />
      </Suspense>
    </section>
  </Html>
);
