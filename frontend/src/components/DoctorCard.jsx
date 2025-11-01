import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

const DoctorCard = ({ doctor }) => {
  return (
    <Card
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <AvatarCircle>{doctor.user.name.charAt(0)}</AvatarCircle>

      <DoctorName>{doctor.user.name}</DoctorName>
      <Specialty>{doctor.specialty}</Specialty>

      <InfoContainer>
        <InfoItem>
          <InfoLabel>Experience</InfoLabel>
          <InfoValue>{doctor.experience} years</InfoValue>
        </InfoItem>

        <Divider />

        <InfoItem>
          <InfoLabel>Location</InfoLabel>
          <InfoValue>
            {doctor.location.city}, {doctor.location.state}
          </InfoValue>
        </InfoItem>
      </InfoContainer>

      <ViewProfileButton
        to={`/doctors/${doctor._id}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        View Profile
      </ViewProfileButton>
    </Card>
  );
};

export default DoctorCard;

const Card = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
  max-width: 320px;
  margin: 0 auto;
  transform-origin: center bottom;
`;

const AvatarCircle = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(37, 117, 252, 0.2);
`;

const DoctorName = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 0.2rem 0;
`;

const Specialty = styled.div`
  color: #2575fc;
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
`;

const InfoContainer = styled.div`
  width: 100%;
  background: #f8faff;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem 0;
`;

const InfoLabel = styled.span`
  font-size: 0.8rem;
  color: #777;
  margin-bottom: 0.3rem;
`;

const InfoValue = styled.span`
  font-weight: 500;
  color: #333;
  text-align: center;
`;

const Divider = styled.div`
  height: 1px;
  width: 80%;
  background: #e8e8e8;
  margin: 0.5rem auto;
`;

const ViewProfileButton = styled(motion(Link))`
  display: inline-block;
  padding: 0.8rem 0;
  width: 100%;
  background: linear-gradient(135deg, #2575fc 0%, #6a11cb 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 5px 15px rgba(37, 117, 252, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;
