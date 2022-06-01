import { useState } from "react";

export default () => {
  const [count, setCount] = useState(0);
  return (
    <button type="button" onClick={() => setCount((c) => c + 1)}>
      Increment {count}
    </button>
  );
};
