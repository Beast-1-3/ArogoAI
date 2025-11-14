/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import API from "../services/api";
import AuthContext from "../context/AuthContext";
import { useAuth } from "../context/AuthContext";
import Toast from "../components/Toast";
import { useQueryClient } from "@tanstack/react-query";

const BookAppointment = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isLoading: isAuthLoading } = useAuth();
  const [bookingLoading, setBookingLoading] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const { data } = await API.get(`/doctors/${id}`);
        setDoctor(data.data);
      } catch (error) {
        console.error("Error fetching doctor details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, [id]);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      <Toast message="Please select a date and time slot!" type="error" />;
      return;
    }

    setBookingLoading(true);

    try {
      const response = await API.post("/appointments/book", {
        doctorId: id,
        date: selectedDate,
        time: selectedTime,
      });

      if (response.status === 201) {
        <Toast message="Appointment booked successfully!" />;
        // alert("Appointment booked successfully!");
        queryClient.invalidateQueries(["appointments"]);
        navigate("/dashboard/patient/appointments");
      }
    } catch (error) {
      // Toast.error("Failed to book appointment. Try again.");
      alert("Error booking appointment.");
      console.error("Booking error:", error);
    } finally {
      setBookingLoading(false);
    }
  };

  if (isAuthLoading || loading)
    return (
      <LoadingContainer>
        <Spinner />
        <LoadingText>Loading doctor's availability...</LoadingText>
      </LoadingContainer>
    );

  return (
    <Container
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BookingHeader>
        <Avatar>{doctor?.user.name.charAt(0)}</Avatar>
        <BookingTitle>Book Appointment</BookingTitle>
        <DoctorName>{doctor?.user.name}</DoctorName>
        <DoctorDetails>
          <Badge>{doctor?.specialty}</Badge>
          <LocationBadge>
            {doctor?.location.city}, {doctor?.location.state}
          </LocationBadge>
        </DoctorDetails>
      </BookingHeader>

      <FormSection>
        <FormTitle>Select Your Appointment</FormTitle>

        <FormGroup>
          <Label>Select Date</Label>
          <StyledSelect
            onChange={(e) => setSelectedDate(e.target.value)}
            value={selectedDate}
            whileTap={{ scale: 0.98 }}
          >
            <option value="">Choose a date</option>
            {doctor?.availability.map((slot, index) => (
              <option key={index} value={slot.date}>
                {slot.date}
              </option>
            ))}
          </StyledSelect>
        </FormGroup>

        <FormGroup>
          <Label>Select Time Slot</Label>
          <StyledSelect
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!selectedDate}
            value={selectedTime}
            whileTap={{ scale: 0.98 }}
          >
            <option value="">Choose a time</option>
            {selectedDate &&
              doctor?.availability
                .find((slot) => slot.date === selectedDate)
                ?.slots.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
          </StyledSelect>
        </FormGroup>

        {selectedDate && selectedTime && (
          <AppointmentPreview>
            <PreviewTitle>Your Appointment</PreviewTitle>
            <PreviewDetail>
              Date: <span>{selectedDate}</span>
            </PreviewDetail>
            <PreviewDetail>
              Time: <span>{selectedTime}</span>
            </PreviewDetail>
          </AppointmentPreview>
        )}

        <ConfirmButton
          onClick={handleConfirmBooking}
          whileHover={!bookingLoading ? { scale: 1.02 } : {}}
          whileTap={!bookingLoading ? { scale: 0.98 } : {}}
          disabled={bookingLoading || !selectedDate || !selectedTime}
        >
          {bookingLoading ? "Booking..." : "Confirm Booking"}
        </ConfirmButton>

        <CancelButton
          onClick={() => navigate(-1)}
          whileHover={{ backgroundColor: "#f1f1f1" }}
        >
          Cancel
        </CancelButton>
      </FormSection>
    </Container>
  );
};

export default BookAppointment;

const Container = styled(motion.div)`
  max-width: 700px;
  margin: 2rem auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  gap: 1rem;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #eaeaea;
  border-top: 3px solid #2575fc;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  color: #666;
  font-size: 1rem;
`;

const BookingHeader = styled.div`
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  padding: 2.5rem 2rem;
  color: white;
  text-align: center;
`;

const Avatar = styled.div`
  width: 70px;
  height: 70px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 2rem;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
`;

const BookingTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  opacity: 0.9;
`;

const DoctorName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1rem;
`;

const DoctorDetails = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Badge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
`;

const LocationBadge = styled(Badge)``;

const FormSection = styled.div`
  padding: 2rem;
`;

const FormTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: #555;
  font-size: 0.95rem;
`;

const StyledSelect = styled(motion.select)`
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  font-size: 1rem;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem top 50%;
  background-size: 0.65rem auto;
  cursor: pointer;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #2575fc;
    box-shadow: 0 0 0 3px rgba(37, 117, 252, 0.1);
  }

  &:disabled {
    background-color: #f0f0f0;
    color: #999;
    cursor: not-allowed;
  }
`;

const AppointmentPreview = styled(motion.div)`
  background: #f8faff;
  border: 1px solid #e8f0fe;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 2rem 0;
  animation: fadeIn 0.3s ease-in;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const PreviewTitle = styled.h5`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1rem;
  text-align: center;
`;

const PreviewDetail = styled.p`
  display: flex;
  justify-content: space-between;
  margin: 0.7rem 0;
  color: #555;
  font-size: 0.95rem;

  span {
    font-weight: 600;
    color: #2575fc;
  }
`;

const ConfirmButton = styled(motion.button)`
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  width: 100%;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(37, 117, 252, 0.2);
  margin-bottom: 1rem;
  transition: all 0.3s ease;

  &:disabled {
    background: linear-gradient(135deg, #a0a0a0 0%, #767676 100%);
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const CancelButton = styled(motion.button)`
  background: transparent;
  color: #666;
  border: 1px solid #e0e0e0;
  padding: 0.8rem;
  border-radius: 10px;
  font-size: 0.9rem;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
`;
