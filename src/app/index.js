import { Suspense, lazy } from "react";
import Counter from "./Counter";
const Comments = lazy(() => import("./Comments" /* webpackPrefetch: true */));

export const App = () => (
  <>
    <p>This page is streamed with ReactDOM.renderToPipeableStream.</p>
    <Counter />
    <section className="comments">
      <h2>Comments</h2>
      <Suspense fallback={<div>Loading...</div>}>
        <Comments />
      </Suspense>
    </section>
  </>
);
