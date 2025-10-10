import styled, { keyframes } from "styled-components";

const Loader = () => {
  return <Spinner />;
};

export default Loader;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid rgba(0, 119, 182, 0.3);
  border-top: 4px solid #0077b6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: auto;
`;
