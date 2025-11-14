/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../services/api";
import AuthContext from "../../context/AuthContext";
import Loader from "../../components/Loader";
import Modal from "../../components/Modal";
import { FiTrash2, FiCalendar, FiMapPin, FiUser } from "react-icons/fi";

const PatientAppointments = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await API.get(`/appointments/patient`);
      setAppointments(data.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
    // console.log(selectedAppointment);
  };

  const confirmCancellation = async () => {
    try {
      await API.post(`/appointments/cancel`, {
        appointmentId: selectedAppointment._id,
      });

      setAppointments(
        appointments.map((a) =>
          a._id === selectedAppointment._id ? { ...a, status: "cancelled" } : a
        )
      );
    } catch (error) {
      console.error("Error canceling appointment", error);
    }
    setShowModal(false);
  };

  if (loading) return <Loader />;

  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <PageTitle>Your Appointments</PageTitle>

      <AnimatePresence>
        {appointments.length > 0 ? (
          <AppointmentsList>
            {appointments.map((appointment, index) => (
              <AppointmentCard
                key={appointment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                whileHover={{
                  y: -5,
                  boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                }}
                cancelled={appointment.status === "cancelled"}
              >
                <DoctorInfo>
                  <DoctorName>
                    <FiUser />
                    <span>{appointment?.doctor?.user?.name}</span>
                  </DoctorName>
                  <InfoItem>
                    <strong>Specialty:</strong> {appointment?.doctor?.specialty}
                  </InfoItem>
                  <InfoItem>
                    <FiMapPin />
                    <span>
                      {appointment?.doctor?.location?.city},{" "}
                      {appointment.doctor.location.state}
                    </span>
                  </InfoItem>
                </DoctorInfo>

                <SlotInfo>
                  <AppointmentTime>
                    <FiCalendar />
                    <span>{`${appointment?.time} on ${appointment?.date}`}</span>
                  </AppointmentTime>

                  {appointment.status !== "cancelled" && (
                    <CancelButton
                      onClick={() => handleCancelClick(appointment)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiTrash2 /> Cancel
                    </CancelButton>
                  )}
                  <StatusBadge status={appointment.status}>
                    {appointment.status === "cancelled"
                      ? "Cancelled"
                      : "Booked"}
                  </StatusBadge>
                </SlotInfo>
              </AppointmentCard>
            ))}
          </AppointmentsList>
        ) : (
          <NoAppointments
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p>No appointments found.</p>
            <BookNowLink
              href="/search"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Book your appointment now
            </BookNowLink>
          </NoAppointments>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showModal && (
          <Modal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title="Cancel Appointment"
          >
            <ModalContent
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p>Are you sure you want to cancel this appointment?</p>
              <ModalButtons>
                <CancelConfirm
                  onClick={confirmCancellation}
                  whileHover={{ scale: 1.05, backgroundColor: "#c82333" }}
                  whileTap={{ scale: 0.95 }}
                >
                  Yes, Cancel
                </CancelConfirm>
                <CancelClose
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.05, backgroundColor: "#5a6268" }}
                  whileTap={{ scale: 0.95 }}
                >
                  No, Keep
                </CancelClose>
              </ModalButtons>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default PatientAppointments;

const StatusBadge = styled.span`
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  background-color: ${(props) =>
    props.status === "cancelled" ? "#f3f4f6" : "#ebf8ff"};
  color: ${(props) => (props.status === "cancelled" ? "#9ca3af" : "#3182ce")};
  border: 1px solid
    ${(props) => (props.status === "cancelled" ? "#e5e7eb" : "#bee3f8")};
`;

const Container = styled(motion.div)`
  padding: 2.5rem;
  width: 85%;

  /* max-width: 1200px; */
  width: 70vw;
  margin: auto;
  background: linear-gradient(to bottom, #f9fafc, #ffffff);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
`;

const PageTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e2e8f0;
`;

const AppointmentsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const AppointmentCard = styled(motion.div)`
  background: white;
  padding: 1.75rem;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-left: 4px solid ${(props) => (props.cancelled ? "#cbd5e0" : "#3182ce")};
  transition: all 0.3s ease;
  opacity: ${(props) => (props.cancelled ? 0.6 : 1)};
`;

const DoctorInfo = styled.div`
  h3 {
    margin-bottom: 0.75rem;
  }
`;

const DoctorName = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 0.75rem;

  svg {
    color: #3182ce;
  }
`;

const InfoItem = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.4rem 0;
  color: #4a5568;
  font-size: 0.95rem;

  svg {
    color: #718096;
  }

  strong {
    color: #2d3748;
  }
`;

const SlotInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1rem;
`;

const AppointmentTime = styled.p`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  color: #4a5568;
  background: #f7fafc;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;

  svg {
    color: #3182ce;
  }
`;

const CancelButton = styled(motion.button)`
  background: #fff;
  color: #e53e3e;
  border: 1px solid #e53e3e;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: #e53e3e;
    color: white;
  }
`;

const NoAppointments = styled(motion.div)`
  text-align: center;
  color: #718096;
  font-size: 1.1rem;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const BookNowLink = styled(motion.a)`
  display: inline-block;
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  color: white;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 5px 15px rgba(37, 117, 252, 0.2);
  transition: all 0.3s ease;
`;

const ModalContent = styled(motion.div)`
  text-align: center;
  p {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: #4a5568;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const CancelConfirm = styled(motion.button)`
  background: #e53e3e;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(229, 62, 62, 0.3);
`;

const CancelClose = styled(motion.button)`
  background: #718096;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(113, 128, 150, 0.3);
`;
