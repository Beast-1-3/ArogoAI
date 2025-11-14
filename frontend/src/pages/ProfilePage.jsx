import { useContext } from "react";
import styled from "styled-components";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import {
    FiMail,
    FiCalendar,
    FiClock,
    FiUser,
    FiActivity,
    FiHeart,
    FiShield,
} from "react-icons/fi";

const ProfilePage = () => {
    const { user, isLoading } = useContext(AuthContext);

    // Fetch appointments for patient stats
    const { data: appointments = [] } = useQuery({
        queryKey: ["appointments", user?._id],
        queryFn: async () => {
            const { data } = await API.get(`/appointments/patient`);
            return data.data || [];
        },
        enabled: !!user && user.role === "patient",
        staleTime: 1000 * 60 * 5,
    });

    if (isLoading) {
        return (
            <Container>
                <LoadingText>Loading profile...</LoadingText>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container>
                <ErrorText>Please log in to view your profile.</ErrorText>
            </Container>
        );
    }

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    // Calculate patient stats
    const totalAppointments = appointments.length;
    const completedAppointments = appointments.filter(
        (apt) => apt.status !== "cancelled" && new Date(apt.date) < new Date()
    ).length;

    return (
        <Container>
            {/* Hero Section */}
            <HeroCard
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <HeroBackground />
                <HeroContent>
                    <LargeAvatar
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        {user.name ? user.name[0].toUpperCase() : "U"}
                    </LargeAvatar>
                    <UserName>{user.name}</UserName>
                    <RoleBadge>
                        <FiShield />
                        {user.role === "doctor" ? "Doctor" : "Patient"}
                    </RoleBadge>
                </HeroContent>
            </HeroCard>

            {/* Stats Grid for Patient */}
            {user.role === "patient" && (
                <StatsGrid>
                    <StatCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <StatIcon color="#667eea">
                            <FiCalendar />
                        </StatIcon>
                        <StatValue>{totalAppointments}</StatValue>
                        <StatLabel>Total Appointments</StatLabel>
                    </StatCard>

                    <StatCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <StatIcon color="#10B981">
                            <FiHeart />
                        </StatIcon>
                        <StatValue>{completedAppointments}</StatValue>
                        <StatLabel>Completed Visits</StatLabel>
                    </StatCard>

                    <StatCard
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <StatIcon color="#F59E0B">
                            <FiActivity />
                        </StatIcon>
                        <StatValue>Active</StatValue>
                        <StatLabel>Account Status</StatLabel>
                    </StatCard>
                </StatsGrid>
            )}

            {/* Info Cards */}
            <InfoGrid>
                <InfoCard
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <InfoCardHeader>
                        <FiUser />
                        <span>Personal Information</span>
                    </InfoCardHeader>
                    <InfoCardContent>
                        <InfoItem>
                            <InfoIcon>
                                <FiMail />
                            </InfoIcon>
                            <InfoDetails>
                                <InfoLabel>Email Address</InfoLabel>
                                <InfoValue>{user.email}</InfoValue>
                            </InfoDetails>
                        </InfoItem>
                        <InfoItem>
                            <InfoIcon>
                                <FiUser />
                            </InfoIcon>
                            <InfoDetails>
                                <InfoLabel>Full Name</InfoLabel>
                                <InfoValue>{user.name}</InfoValue>
                            </InfoDetails>
                        </InfoItem>
                    </InfoCardContent>
                </InfoCard>

                <InfoCard
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <InfoCardHeader>
                        <FiCalendar />
                        <span>Account Details</span>
                    </InfoCardHeader>
                    <InfoCardContent>
                        <InfoItem>
                            <InfoIcon>
                                <FiCalendar />
                            </InfoIcon>
                            <InfoDetails>
                                <InfoLabel>Member Since</InfoLabel>
                                <InfoValue>{formatDate(user.createdAt)}</InfoValue>
                            </InfoDetails>
                        </InfoItem>
                        <InfoItem>
                            <InfoIcon>
                                <FiClock />
                            </InfoIcon>
                            <InfoDetails>
                                <InfoLabel>Last Login</InfoLabel>
                                <InfoValue>{formatDate(user.lastLogin)}</InfoValue>
                            </InfoDetails>
                        </InfoItem>
                    </InfoCardContent>
                </InfoCard>
            </InfoGrid>

            {/* Doctor-specific info */}
            {user.role === "doctor" && (
                <DoctorCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <InfoCardHeader>
                        <FiActivity />
                        <span>Professional Details</span>
                    </InfoCardHeader>
                    <DoctorGrid>
                        <DoctorItem>
                            <DoctorLabel>Specialty</DoctorLabel>
                            <DoctorValue>{user.specialty || "Not specified"}</DoctorValue>
                        </DoctorItem>
                        <DoctorItem>
                            <DoctorLabel>Experience</DoctorLabel>
                            <DoctorValue>
                                {user.experience ? `${user.experience} years` : "Not specified"}
                            </DoctorValue>
                        </DoctorItem>
                        <DoctorItem>
                            <DoctorLabel>Location</DoctorLabel>
                            <DoctorValue>
                                {user.location
                                    ? `${user.location.city}, ${user.location.state}`
                                    : "Not specified"}
                            </DoctorValue>
                        </DoctorItem>
                    </DoctorGrid>
                </DoctorCard>
            )}
        </Container>
    );
};

export default ProfilePage;

const Container = styled.div`
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
`;

const LoadingText = styled.p`
  text-align: center;
  color: #718096;
  font-size: 1.1rem;
  padding: 4rem;
`;

const ErrorText = styled.p`
  text-align: center;
  color: #e53e3e;
  font-size: 1.1rem;
  padding: 4rem;
`;

const HeroCard = styled(motion.div)`
  position: relative;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
`;

const HeroBackground = styled.div`
  height: 120px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2rem 2rem;
  margin-top: -50px;
`;

const LargeAvatar = styled(motion.div)`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  border: 4px solid white;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
`;

const UserName = styled.h1`
  margin: 1rem 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
`;

const RoleBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const StatIcon = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: ${(props) => `${props.color}15`};
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto 1rem;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
  margin-top: 0.25rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const InfoCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #2d3748;

  svg {
    color: #667eea;
  }
`;

const InfoCardContent = styled.div`
  padding: 1rem 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #f0f4f8;

  &:last-child {
    border-bottom: none;
  }
`;

const InfoIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f0f4f8;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
`;

const InfoDetails = styled.div``;

const InfoLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
  font-weight: 500;
  color: #2d3748;
`;

const DoctorCard = styled(motion.div)`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
`;

const DoctorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  padding: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DoctorItem = styled.div`
  text-align: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 12px;
`;

const DoctorLabel = styled.div`
  font-size: 0.8rem;
  color: #718096;
  margin-bottom: 0.5rem;
`;

const DoctorValue = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
`;
