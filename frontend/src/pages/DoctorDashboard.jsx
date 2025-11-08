import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import API from "../services/api";
import AuthContext from "../context/AuthContext";

const DoctorProfile = () => {
  const { user } = useContext(AuthContext);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const { data } = await API.get("/auth/me");
        setDoctor(data.data);
      } catch (error) {
        console.error("Error fetching doctor details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorDetails();
  }, []);

  if (loading) return <LoadingIndicator>Loading...</LoadingIndicator>;

  return (
    <ProfileContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ProfileCard>
        <AvatarCircle>{user?.name?.charAt(0) || "D"}</AvatarCircle>

        <ProfileHeader>
          <DoctorName>Dr. {user?.name}</DoctorName>
          <EmailDisplay>{user?.email}</EmailDisplay>
        </ProfileHeader>

        <Divider />

        <InfoSection>
          <SectionTitle>Doctor Information</SectionTitle>
          <ProfileDetails>
            <DetailItem>
              <DetailLabel>Specialty</DetailLabel>
              <DetailValue>{doctor?.specialty || "Not specified"}</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Experience</DetailLabel>
              <DetailValue>{doctor?.experience || "0"} years</DetailValue>
            </DetailItem>

            <DetailItem>
              <DetailLabel>Location</DetailLabel>
              <DetailValue>
                {doctor?.location?.city || "City"},{" "}
                {doctor?.location?.state || "State"}
              </DetailValue>
            </DetailItem>
          </ProfileDetails>
        </InfoSection>

        <Divider />

        <InfoSection>
          <SectionTitle>Availability</SectionTitle>
          {doctor?.availability?.length > 0 ? (
            <AvailabilityList>
              {doctor.availability.map((slot, index) => (
                <AvailabilityItem
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <SlotDate>{slot.date}</SlotDate>
                  <SlotTimes>{slot.slots.join(" • ")}</SlotTimes>
                </AvailabilityItem>
              ))}
            </AvailabilityList>
          ) : (
            <EmptyState
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No availability slots set.
            </EmptyState>
          )}
        </InfoSection>
      </ProfileCard>
    </ProfileContainer>
  );
};

export default DoctorProfile;

// Styled Components
const ProfileContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  /* padding: 2rem; */
  /* width: 100%; */
  min-width: 76vw;
  /* height: 100%; */
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 16px;
  /* box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06); */
  padding: 2rem;
  width: 100%;
  /* max-width: 600px; */
  position: relative;
  overflow: hidden;
`;

const AvatarCircle = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2c7be5 0%, #1a5bb6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 auto 1.5rem;
  box-shadow: 0 4px 12px rgba(42, 123, 229, 0.3);
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const DoctorName = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const EmailDisplay = styled.p`
  color: #64748b;
  font-size: 1rem;
`;

const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 1.5rem 0;
`;

const InfoSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: #f8fafc;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    transform: translateY(-2px);
  }
`;

const DetailLabel = styled.span`
  font-weight: 600;
  color: #475569;
  min-width: 100px;
`;

const DetailValue = styled.span`
  color: #0f172a;
  font-weight: 500;
`;

const AvailabilityList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AvailabilityItem = styled(motion.li)`
  background: #f0f9ff;
  padding: 1rem;
  border-radius: 12px;
  border-left: 4px solid #0ea5e9;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: #e0f2fe;
    transform: translateX(4px);
  }
`;

const SlotDate = styled.div`
  font-weight: 600;
  color: #0c4a6e;
`;

const SlotTimes = styled.div`
  color: #0369a1;
  font-size: 0.95rem;
`;

const EmptyState = styled(motion.p)`
  text-align: center;
  color: #94a3b8;
  font-style: italic;
  padding: 1.5rem;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
`;

const LoadingIndicator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 500;
`;
