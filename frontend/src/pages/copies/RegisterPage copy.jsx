/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../../components/Button";
import InputField from "../../components/InputField";
import API from "../../services/api";
import Toast from "../../components/Toast";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [toastMessage, setToastMessage] = useState("");
  const navigate = useNavigate();

  const role = watch("role", "patient"); // Watch the role selection

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

      const response = await API.post("/auth/register", requestData);
      localStorage.setItem("token", response.data.token);

      // Redirect based on role
      if (data.role === "doctor") {
        navigate("/dashboard/doctor");
      } else {
        navigate("/dashboard/patient");
      }
    } catch (error) {
      setToastMessage("Registration failed. Try again.");
    }
  };

  return (
    <Container>
      <RegisterBox>
        <h2>Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <InputField label="Name" {...register("name", { required: true })} />
          {errors.name && <ErrorText>Name is required</ErrorText>}

          <InputField
            label="Email"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && <ErrorText>Email is required</ErrorText>}

          <InputField
            label="Password"
            type="password"
            {...register("password", { required: true })}
          />
          {errors.password && <ErrorText>Password is required</ErrorText>}

          <label>Role:</label>
          <select {...register("role", { required: true })}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
          {errors.role && <ErrorText>Role is required</ErrorText>}

          {/* Additional Fields for Doctors */}
          {role === "doctor" && (
            <>
              <InputField
                label="Specialty"
                {...register("specialty", { required: true })}
              />
              {errors.specialty && <ErrorText>Specialty is required</ErrorText>}

              <InputField
                label="Experience (in years)"
                type="number"
                {...register("experience", { required: true, min: 1 })}
              />
              {errors.experience && (
                <ErrorText>Experience must be at least 1 year</ErrorText>
              )}

              <label>Location:</label>
              <InputField
                label="City"
                {...register("city", { required: true })}
              />
              {errors.city && <ErrorText>City is required</ErrorText>}

              <InputField
                label="State"
                {...register("state", { required: true })}
              />
              {errors.state && <ErrorText>State is required</ErrorText>}
            </>
          )}

          <Button type="submit">Register</Button>
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

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const RegisterBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 400px;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 0.9rem;
  margin: 0.5rem 0;
`;
