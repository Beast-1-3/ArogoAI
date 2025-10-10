import styled from "styled-components";
import { motion } from "framer-motion";

const InputField = ({ label, type = "text", error, ...props }) => {
  return (
    <InputContainer>
      <LabelWrapper>
        <Label htmlFor={props.id || props.name}>{label}</Label>
        {props.required && <RequiredIndicator>*</RequiredIndicator>}
      </LabelWrapper>

      <InputWrapper>
        <StyledInput
          type={type}
          {...props}
          as={motion.input}
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          hasError={error}
        />
        {props.icon && <InputIcon>{props.icon}</InputIcon>}
      </InputWrapper>

      {error && <ErrorMessage>{error}</ErrorMessage>}
    </InputContainer>
  );
};

export default InputField;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Label = styled.label`
  font-size: 0.9rem;
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.25rem;
  transition: color 0.2s ease;
`;

const RequiredIndicator = styled.span`
  color: #e63946;
  font-size: 0.9rem;
  line-height: 1;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.hasError ? "#e63946" : "#dee2e6")};
  font-size: 1rem;
  transition: all 0.2s ease;
  background-color: ${(props) => (props.disabled ? "#f8f9fa" : "white")};
  color: #212529;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);

  &::placeholder {
    color: #adb5bd;
    font-size: 0.95rem;
  }

  &:hover:not(:disabled) {
    border-color: ${(props) => (props.hasError ? "#e63946" : "#adb5bd")};
  }

  &:focus {
    border-color: ${(props) => (props.hasError ? "#e63946" : "#0096c7")};
    box-shadow: 0 0 0 3px
      ${(props) =>
        props.hasError ? "rgba(230, 57, 70, 0.2)" : "rgba(0, 150, 199, 0.2)"};
    outline: none;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  ${(props) =>
    props.icon &&
    `
    padding-right: 2.5rem;
  `}
`;

const InputIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  pointer-events: none;
`;

const ErrorMessage = styled.span`
  color: #e63946;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;
