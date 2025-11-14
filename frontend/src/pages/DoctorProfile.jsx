/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import API from "../services/api";
import AuthContext from "../context/AuthContext";

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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

  const handleBookAppointment = () => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "patient") {
      alert("Only patients can book appointments.");
    } else {
      navigate(`/book-appointment/${id}`);
    }
  };

  if (loading)
    return (
      <LoadingWrapper>
        <Spinner />
        <span>Loading doctor profile...</span>
      </LoadingWrapper>
    );

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileCard>
        <Avatar>{doctor?.user.name.charAt(0)}</Avatar>

        <ProfileHeader>
          <DoctorName>{doctor?.user.name}</DoctorName>
          <Specialty>{doctor?.specialty}</Specialty>

          <InfoGrid>
            <InfoItem>
              <InfoIcon>⏱️</InfoIcon>
              <InfoContent>
                <InfoLabel>Experience</InfoLabel>
                <InfoValue>{doctor?.experience} years</InfoValue>
              </InfoContent>
            </InfoItem>

            <InfoItem>
              <InfoIcon>📍</InfoIcon>
              <InfoContent>
                <InfoLabel>Location</InfoLabel>
                <InfoValue>
                  {doctor?.location.city}, {doctor?.location.state}
                </InfoValue>
              </InfoContent>
            </InfoItem>
          </InfoGrid>
        </ProfileHeader>

        <Divider />

        <AvailabilitySection>
          <SectionTitle>Available Slots</SectionTitle>
          {doctor?.availability.length > 0 ? (
            <AvailabilityList>
              {doctor.availability.map((slot, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <AvailabilityItem>
                    <DateBadge>{slot.date}</DateBadge>
                    <SlotTimes>
                      {slot.slots.map((time, idx) => (
                        <SlotBadge key={idx}>{time}</SlotBadge>
                      ))}
                    </SlotTimes>
                  </AvailabilityItem>
                </motion.div>
              ))}
            </AvailabilityList>
          ) : (
            <NoSlotsMessage>No available slots at the moment.</NoSlotsMessage>
          )}
        </AvailabilitySection>

        <BookAppointmentButton
          onClick={handleBookAppointment}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Book Appointment
        </BookAppointmentButton>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default DoctorProfile;

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const ProfileContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
`;

const ProfileCard = styled.div`
  width: 100%;
  max-width: 700px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 2.5rem;
  position: relative;
  overflow: hidden;
`;

const Avatar = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  font-size: 2rem;
  font-weight: 600;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 15px rgba(37, 117, 252, 0.2);
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const DoctorName = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.3rem;
`;

const Specialty = styled.h3`
  font-size: 1.1rem;
  color: #2575fc;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 1.5rem 0;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
`;

const InfoIcon = styled.div`
  font-size: 1.2rem;
  margin-right: 0.8rem;
`;

const InfoContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.2rem;
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: #333;
`;

const Divider = styled.div`
  height: 1px;
  background: #eaeaea;
  margin: 1.5rem 0;
`;

const AvailabilitySection = styled.div`
  margin: 2rem 0;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.2rem;
`;

const AvailabilityList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const AvailabilityItem = styled.div`
  background: #f8faff;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid #eef2ff;
`;

const DateBadge = styled.div`
  display: inline-block;
  background: #eef2ff;
  color: #2575fc;
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
`;

const SlotTimes = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SlotBadge = styled.span`
  background: white;
  padding: 0.3rem 0.7rem;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #555;
  border: 1px solid #eaeaea;
`;

const NoSlotsMessage = styled.p`
  color: #777;
  text-align: center;
  padding: 1.5rem;
  background: #f8faff;
  border-radius: 12px;
  font-style: italic;
`;

const BookAppointmentButton = styled(motion.button)`
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 1.5rem;
  cursor: pointer;
  width: 100%;
  box-shadow: 0 4px 15px rgba(37, 117, 252, 0.2);
  transition: all 0.3s ease;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  color: #666;
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
