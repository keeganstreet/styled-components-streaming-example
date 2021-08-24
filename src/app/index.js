import { Box } from "./Box";
import { Circle } from "./Circle";

export const App = () => (
  <>
    <p>
      This page is streamed with ServerStyleSheet.interleaveWithNodeStream and
      ReactDOM.renderToNodeStream.
    </p>
    <p>
      The following circles are inline SVG elements. Due to the number of
      elements, ServerStyleSheet.interleaveWithNodeStream will create multiple
      stylesheets.
    </p>
    {[...Array(120)].map((x, i) => (
      <Circle key={i} />
    ))}

    <Box>
      <p>Text in this box should be underlined.</p>
      <p>
        The underline disappears because the stylesheet is inserted as a child
        of an SVG.
      </p>
      <p>
        This means its styles are encoded incorrectly when read from the DOM
        during hydration.
      </p>
    </Box>
  </>
);
