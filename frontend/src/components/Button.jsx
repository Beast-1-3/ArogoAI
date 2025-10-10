import styled from "styled-components";

const Button = ({ children, variant = "primary", ...props }) => {
  return (
    <StyledButton variant={variant} {...props}>
      {children}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.button`
  background: ${({ variant }) => (variant === "primary" ? "#0077b6" : "white")};
  color: ${({ variant }) => (variant === "primary" ? "white" : "#0077b6")};
  border: 1px solid #0077b6;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background: ${({ variant }) =>
      variant === "primary" ? "#005f8f" : "#0077b6"};
    color: white;
  }
`;
