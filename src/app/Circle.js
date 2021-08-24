import React from "react";
import styled from "styled-components";

const StyledSVG = styled.svg`
  width: 1.5rem;
  height: 1.5rem;
`;

export const Circle = React.forwardRef((props, ref) => (
  <StyledSVG viewBox="0 0 24 24" fill="none" ref={ref} {...props}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 23c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11z"
      fill="currentColor"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </StyledSVG>
));
