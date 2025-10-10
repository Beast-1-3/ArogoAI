import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";

const Toast = ({ message, type = "success", onClose }) => {
  return (
    <AnimatePresence>
      {message && (
        <ToastContainer
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          type={type}
        >
          {message}
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ToastContainer>
      )}
    </AnimatePresence>
  );
};

export default Toast;

const ToastContainer = styled(motion.div)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: ${(props) => (props.type === "success" ? "#28a745" : "#dc3545")};
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 1rem;
  z-index: 1000;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
`;
