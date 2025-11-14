/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import API from "../services/api";
import AuthContext from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiMail,
  FiUser,
  FiRefreshCw,
} from "react-icons/fi";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("upcoming"); // upcoming, past, all
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/appointments/doctor");
      setAppointments(data.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Filter appointments based on selected view
  const filteredAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(`${appointment.date} ${appointment.time}`);
    const today = new Date();

    if (view === "upcoming") return appointmentDate >= today;
    if (view === "past") return appointmentDate < today;
    return true; // "all" view
  });

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Header>
        <Title>Your Appointments</Title>
        <RefreshButton
          onClick={fetchAppointments}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiRefreshCw /> Refresh
        </RefreshButton>
      </Header>

      <ViewSelector>
        <ViewButton
          active={view === "upcoming"}
          onClick={() => setView("upcoming")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Upcoming
        </ViewButton>
        <ViewButton
          active={view === "past"}
          onClick={() => setView("past")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Past
        </ViewButton>
        <ViewButton
          active={view === "all"}
          onClick={() => setView("all")}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          All
        </ViewButton>
      </ViewSelector>

      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingContainer
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <LoadingSpinner>
              <FiRefreshCw />
            </LoadingSpinner>
            <LoadingText>Loading appointments...</LoadingText>
          </LoadingContainer>
        ) : filteredAppointments.length > 0 ? (
          <AppointmentsList
            key="appointments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {filteredAppointments.map((appointment, index) => (
              <AppointmentCard
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <AppointmentHeader>
                  <PatientName>
                    <FiUser />
                    {appointment.patient.name}
                  </PatientName>
                  <AppointmentStatus>
                    {new Date(`${appointment.date} ${appointment.time}`) >
                    new Date()
                      ? "Upcoming"
                      : "Completed"}
                  </AppointmentStatus>
                </AppointmentHeader>

                <AppointmentDetails>
                  <DetailItem>
                    <DetailIcon>
                      <FiMail />
                    </DetailIcon>
                    <DetailText>{appointment.patient.email}</DetailText>
                  </DetailItem>

                  <DetailItem>
                    <DetailIcon>
                      <FiCalendar />
                    </DetailIcon>
                    <DetailText>{formatDate(appointment.date)}</DetailText>
                  </DetailItem>

                  <DetailItem>
                    <DetailIcon>
                      <FiClock />
                    </DetailIcon>
                    <DetailText>{appointment.time}</DetailText>
                  </DetailItem>
                </AppointmentDetails>
              </AppointmentCard>
            ))}
          </AppointmentsList>
        ) : (
          <EmptyState
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <EmptyIcon>
              <FiCalendar />
            </EmptyIcon>
            <EmptyText>No {view} appointments found.</EmptyText>
          </EmptyState>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default DoctorAppointments;

const Container = styled(motion.div)`
  /* max-width: 900px; */
  width: 76vw;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
`;

const RefreshButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #4299e1;
  border: 1px solid #e2e8f0;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  svg {
    font-size: 1rem;
  }
`;

const ViewSelector = styled.div`
  display: flex;
  background: #f7fafc;
  border-radius: 10px;
  padding: 0.3rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const ViewButton = styled(motion.button)`
  flex: 1;
  padding: 0.7rem;
  border: none;
  border-radius: 8px;
  background: ${(props) => (props.active ? "white" : "transparent")};
  color: ${(props) => (props.active ? "#4299e1" : "#718096")};
  font-weight: ${(props) => (props.active ? "600" : "500")};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${(props) =>
    props.active ? "0 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

const LoadingContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
`;

const LoadingSpinner = styled.div`
  margin-bottom: 1rem;
  font-size: 2rem;
  color: #4299e1;
  animation: spin 1.5s linear infinite;

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
  color: #718096;
  font-size: 1rem;
`;

const AppointmentsList = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const AppointmentCard = styled(motion.div)`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
`;

const AppointmentHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f0f4f8;
`;

const PatientName = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    color: #4299e1;
    font-size: 1rem;
  }
`;

const AppointmentStatus = styled.span`
  padding: 0.3rem 0.8rem;
  background: #ebf8ff;
  color: #3182ce;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const AppointmentDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
`;

const DetailIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border-radius: 8px;
  color: #4299e1;
`;

const DetailText = styled.p`
  color: #4a5568;
  font-size: 0.95rem;
`;

const EmptyState = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  color: #e2e8f0;
  margin-bottom: 1rem;
`;

const EmptyText = styled.p`
  color: #718096;
  font-size: 1rem;
`;
