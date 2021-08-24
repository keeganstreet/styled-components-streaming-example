import styled from "styled-components";

export const Box = styled.div`
  background: yellow;
  margin-top: 1em;
  border: 1px solid black;
  padding: 0 1em;

  & > * {
    text-decoration: underline;
  }
`;
