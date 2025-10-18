/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../components/Button";
import InputField from "../components/InputField";
import API from "../services/api";
import Toast from "../components/Toast";

// Styled components with modern design
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
`;

const RegisterBox = styled(motion.div)`
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
  width: 450px;
  max-width: 90vw;

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
    gap: 1rem;
  }
`;

const StyledButton = styled(motion.button)`
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.9rem 8rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin-top: 1rem;
  transition: background 0.2s ease;

  &:hover {
    background: #4338ca;
  }
`;

const ErrorText = styled(motion.p)`
  color: #e53e3e;
  font-size: 0.85rem;
  margin: 0.25rem 0 0 0;
  text-align: left;
`;

const FormGroup = styled.div`
  margin-bottom: 0.5rem;
`;

const FormSection = styled(motion.div)`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #edf2f7;
`;

const FieldLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  color: #4a5568;
  text-align: left;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  background-color: white;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  }
`;

const RoleSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const RoleOption = styled(motion.div)`
  flex: 1;
  padding: 1rem;
  border: 1px solid ${(props) => (props.selected ? "#4f46e5" : "#e2e8f0")};
  border-radius: 8px;
  background: ${(props) =>
    props.selected ? "rgba(79, 70, 229, 0.05)" : "white"};
  color: ${(props) => (props.selected ? "#4f46e5" : "#4a5568")};
  font-weight: ${(props) => (props.selected ? "500" : "normal")};
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4f46e5;
  }
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
`;

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const role = watch("role", "patient");
  const queryClient = useQueryClient();
  const { login } = useAuth();

  // const onSubmit = async (data) => {
  //   try {
  //     const requestData = {
  //       name: data.name,
  //       email: data.email,
  //       password: data.password,
  //       role: data.role,
  //     };

  //     if (data.role === "doctor") {
  //       requestData.specialty = data.specialty;
  //       requestData.experience = parseInt(data.experience, 10);
  //       requestData.location = {
  //         city: data.city,
  //         state: data.state,
  //       };
  //     }

  //     // 🔴 check
  //     console.log("Sending registration data:", requestData);

  //     const response = await API.post("/auth/register", requestData);

  //     // 🔴 check
  //     console.log("Registration response:", response);

  //     const token = response.data.token;
  //     localStorage.setItem("token", token);
  //     console.log(token);

  //     API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  //     // Immediately set user in AuthContext & invalidate user cache
  //     await login(token);
  //     queryClient.invalidateQueries(["user"]);

  //     // Redirect based on role
  //     if (data.role === "doctor") {
  //       navigate("/dashboard/doctor");
  //     } else {
  //       navigate("/dashboard/patient");
  //     }
  //   } catch (error) {
  //     setToastMessage("Registration failed. Try again.");
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      const requestData = {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      };

      if (data.role === "doctor") {
        requestData.specialty = data.specialty;
        requestData.experience = parseInt(data.experience, 10);
        requestData.location = {
          city: data.city,
          state: data.state,
        };
      }

      // Log the request data to verify what's being sent
      console.log("Sending registration data:", requestData);

      const response = await API.post("/auth/register", requestData);

      // Log the entire response to see its structure
      console.log("Registration response:", response);

      // Check if token exists in the expected location
      if (response.data && response.data.token) {
        const token = response.data.token;

        // Log the token to verify it's not undefined
        console.log("Token received:", token);

        localStorage.setItem("token", token);

        // Verify token was properly set in localStorage
        console.log("Token in localStorage:", localStorage.getItem("token"));

        // Make sure authorization header is set
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        // Proceed with login and redirection

        // 🔴 Check
        try {
          // Call login with the token
          await login(token);
          queryClient.invalidateQueries(["user"]);
        } catch (error) {
          console.error("Error during login after registration:", error);
          setToastMessage(
            "Account created but login failed. Please log in manually."
          );
        }

        // Redirect based on role
        if (data.role === "doctor") {
          navigate("/dashboard/doctor");
        } else {
          navigate("/dashboard/patient");
        }
      } else {
        console.error("No token in response:", response.data);
        setToastMessage(
          "Registration successful but login failed. Please log in manually."
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setToastMessage("Registration failed. Try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
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

  const doctorFieldsVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const handleRoleSelect = (selectedRole) => {
    setValue("role", selectedRole);
  };

  return (
    <Container>
      <RegisterBox
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <InputField
              label="Full Name"
              {...register("name", { required: true })}
            />
            <AnimatePresence>
              {errors.name && (
                <ErrorText
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={errorVariants}
                >
                  Name is required
                </ErrorText>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup>
            <InputField
              label="Email Address"
              type="email"
              {...register("email", { required: true })}
            />
            <AnimatePresence>
              {errors.email && (
                <ErrorText
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={errorVariants}
                >
                  Email is required
                </ErrorText>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup>
            <InputField
              label="Password"
              type="password"
              {...register("password", { required: true })}
            />
            <AnimatePresence>
              {errors.password && (
                <ErrorText
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={errorVariants}
                >
                  Password is required
                </ErrorText>
              )}
            </AnimatePresence>
          </FormGroup>

          <FormGroup>
            <FieldLabel>Select your role:</FieldLabel>
            <RoleSelector>
              <RoleOption
                selected={role === "patient"}
                onClick={() => handleRoleSelect("patient")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Patient
              </RoleOption>
              <RoleOption
                selected={role === "doctor"}
                onClick={() => handleRoleSelect("doctor")}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Doctor
              </RoleOption>
            </RoleSelector>
            <input type="hidden" {...register("role", { required: true })} />
            <AnimatePresence>
              {errors.role && (
                <ErrorText
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={errorVariants}
                >
                  Role is required
                </ErrorText>
              )}
            </AnimatePresence>
          </FormGroup>

          {/* Additional Fields for Doctors */}
          <AnimatePresence>
            {role === "doctor" && (
              <FormSection
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={doctorFieldsVariants}
              >
                <motion.div variants={itemVariants}>
                  <FormGroup>
                    <InputField
                      label="Medical Specialty"
                      placeholder="e.g., Cardiology, Pediatrics"
                      {...register("specialty", {
                        required: role === "doctor",
                      })}
                    />
                    <AnimatePresence>
                      {errors.specialty && (
                        <ErrorText
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={errorVariants}
                        >
                          Specialty is required
                        </ErrorText>
                      )}
                    </AnimatePresence>
                  </FormGroup>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FormGroup>
                    <InputField
                      label="Years of Experience"
                      type="number"
                      placeholder="e.g., 5"
                      {...register("experience", {
                        required: role === "doctor",
                        min: 1,
                      })}
                    />
                    <AnimatePresence>
                      {errors.experience && (
                        <ErrorText
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          variants={errorVariants}
                        >
                          Experience must be at least 1 year
                        </ErrorText>
                      )}
                    </AnimatePresence>
                  </FormGroup>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <FieldLabel>Practice Location:</FieldLabel>
                  <LocationGrid>
                    <FormGroup>
                      <InputField
                        placeholder="City"
                        {...register("city", { required: role === "doctor" })}
                      />
                      <AnimatePresence>
                        {errors.city && (
                          <ErrorText
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={errorVariants}
                          >
                            City is required
                          </ErrorText>
                        )}
                      </AnimatePresence>
                    </FormGroup>

                    <FormGroup>
                      <InputField
                        placeholder="State"
                        {...register("state", { required: role === "doctor" })}
                      />
                      <AnimatePresence>
                        {errors.state && (
                          <ErrorText
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={errorVariants}
                          >
                            State is required
                          </ErrorText>
                        )}
                      </AnimatePresence>
                    </FormGroup>
                  </LocationGrid>
                </motion.div>
              </FormSection>
            )}
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <StyledButton type="submit">Create Account</StyledButton>
          </motion.div>
        </form>
      </RegisterBox>

      {toastMessage && (
        <Toast
          message={toastMessage}
          type="error"
          onClose={() => setToastMessage("")}
        />
      )}
    </Container>
  );
};

export default RegisterPage;
