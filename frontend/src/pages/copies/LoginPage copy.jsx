/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import API from "../../services/api";

// Styled components with modern design
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
`;

const LoginBox = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  width: 380px;

  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
    font-weight: 600;
    color: #2d3748;
    text-align: left;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
  }

  p {
    margin-top: 1.5rem;
    color: #718096;
    font-size: 0.95rem;
  }
`;

const StyledButton = styled(motion.button)`
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 8rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 0.5rem;
  transition: background 0.2s ease;

  &:hover {
    background: #4338ca;
  }
`;

const LoadingButton = styled(StyledButton)`
  background: #7c3aed;
  cursor: not-allowed;
  opacity: 0.7;
`;

const ErrorText = styled(motion.p)`
  color: #e53e3e;
  font-size: 0.85rem;
  margin: 0.25rem 0 0 0;
  text-align: left;
`;

const SignUpText = styled.p`
  text-align: center;

  a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #4338ca;
      text-decoration: underline;
    }
  }
`;

const InputWrapper = styled.div`
  margin-bottom: 0.5rem;
`;

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await API.post("/auth/login", data);
      localStorage.setItem("token", response.data.token);

      // Fetch user details to determine role
      const userResponse = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${response.data.token}` },
      });

      const userRole = userResponse.data.data.role;
      if (userRole === "patient") {
        navigate("/dashboard/patient");
      } else if (userRole === "doctor") {
        navigate("/dashboard/doctor");
      } else {
        navigate("/"); // Default to home if role is unclear
      }
    } catch (error) {
      setErrorMessage("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const errorVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 },
    },
  };

  return (
    <Container>
      <LoginBox initial="hidden" animate="visible" variants={containerVariants}>
        <h2>Welcome</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputWrapper>
            <InputField
              label="Email"
              type="email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <ErrorText
                initial="hidden"
                animate="visible"
                variants={errorVariants}
              >
                Email is required
              </ErrorText>
            )}
          </InputWrapper>

          <InputWrapper>
            <InputField
              label="Password"
              type="password"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <ErrorText
                initial="hidden"
                animate="visible"
                variants={errorVariants}
              >
                Password is required
              </ErrorText>
            )}
          </InputWrapper>

          {errorMessage && (
            <ErrorText
              initial="hidden"
              animate="visible"
              variants={errorVariants}
            >
              {errorMessage}
            </ErrorText>
          )}

          {loading ? (
            <LoadingButton disabled>Logging in...</LoadingButton>
          ) : (
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <StyledButton
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                Log in
              </StyledButton>
            </motion.div>
          )}
        </form>

        <SignUpText>
          Don't have an account? <Link to="/register">Sign Up</Link>
        </SignUpText>
      </LoginBox>
    </Container>
  );
};

export default LoginPage;
