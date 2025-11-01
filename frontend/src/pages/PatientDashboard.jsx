import { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import API from "../services/api";
import {
  FiCalendar,
  FiClock,
  FiHeart,
  FiActivity,
  FiSun,
  FiMoon,
  FiDroplet,
  FiZap,
  FiX,
} from "react-icons/fi";

// Curated health tips data
const healthTips = [
  {
    id: 1,
    icon: FiDroplet,
    title: "Stay Hydrated",
    summary: "Drink 8 glasses of water daily for optimal health.",
    details:
      "Water is essential for every cell in your body. Proper hydration helps maintain body temperature, lubricates joints, aids digestion, and flushes out toxins. Start your day with a glass of water and carry a reusable bottle to track your intake throughout the day.",
    color: "#3B82F6",
  },
  {
    id: 2,
    icon: FiMoon,
    title: "Quality Sleep",
    summary: "Aim for 7-9 hours of quality sleep each night.",
    details:
      "Sleep is when your body repairs itself. Poor sleep is linked to weight gain, heart disease, and depression. Create a bedtime routine, avoid screens before bed, keep your room cool and dark, and try to maintain consistent sleep and wake times.",
    color: "#8B5CF6",
  },
  {
    id: 3,
    icon: FiActivity,
    title: "Stay Active",
    summary: "30 minutes of daily exercise boosts your health.",
    details:
      "Regular physical activity reduces the risk of chronic diseases, improves mental health, and increases longevity. You don't need a gym - walking, dancing, gardening, or taking stairs all count. Find activities you enjoy and make movement a daily habit.",
    color: "#10B981",
  },
  {
    id: 4,
    icon: FiSun,
    title: "Get Sunlight",
    summary: "Morning sunlight improves mood and sleep quality.",
    details:
      "Exposure to natural light, especially in the morning, helps regulate your circadian rhythm and boosts vitamin D production. Try to spend at least 15-20 minutes outside each morning. This can improve sleep quality, mood, and overall energy levels.",
    color: "#F59E0B",
  },
  {
    id: 5,
    icon: FiHeart,
    title: "Manage Stress",
    summary: "Practice mindfulness to reduce stress and anxiety.",
    details:
      "Chronic stress affects your immune system, heart, and mental health. Practice deep breathing, meditation, or yoga. Take regular breaks during work, spend time in nature, and maintain social connections. Even 5 minutes of mindfulness daily can make a difference.",
    color: "#EF4444",
  },
  {
    id: 6,
    icon: FiZap,
    title: "Eat Balanced Meals",
    summary: "Include fruits, vegetables, and proteins in your diet.",
    details:
      "A balanced diet provides essential nutrients for energy and disease prevention. Fill half your plate with vegetables, a quarter with lean protein, and a quarter with whole grains. Limit processed foods, sugar, and excessive salt. Eat mindfully and enjoy your meals.",
    color: "#06B6D4",
  },
];

const PatientDashboard = () => {
  const { user, isLoading } = useAuth();
  const [selectedTip, setSelectedTip] = useState(null);

  // Fetch appointments for history
  const { data: appointments = [], isLoading: isLoadingAppointments } =
    useQuery({
      queryKey: ["appointments", user?._id],
      queryFn: async () => {
        const { data } = await API.get(`/appointments/patient`);
        return data.data || [];
      },
      enabled: !!user,
      staleTime: 1000 * 60 * 5,
    });

  if (isLoading) {
    return <LoadingContainer>Loading...</LoadingContainer>;
  }

  // Calculate stats
  const upcomingAppointments = appointments.filter(
    (apt) => apt.status !== "cancelled" && new Date(apt.date) >= new Date()
  );
  const completedAppointments = appointments.filter(
    (apt) => apt.status !== "cancelled" && new Date(apt.date) < new Date()
  );

  return (
    <DashboardContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Welcome Section */}
      <WelcomeCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <WelcomeContent>
          <UserAvatar>{user?.name?.charAt(0) || "U"}</UserAvatar>
          <WelcomeText>
            <Greeting>Welcome back,</Greeting>
            <UserName>{user?.name || "Patient"}</UserName>
          </WelcomeText>
        </WelcomeContent>
        <StatusBadge>Active</StatusBadge>
      </WelcomeCard>

      {/* Stats Cards */}
      <StatsGrid>
        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatIcon color="#3B82F6">
            <FiCalendar />
          </StatIcon>
          <StatInfo>
            <StatValue>{appointments.length}</StatValue>
            <StatLabel>Total Appointments</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatIcon color="#10B981">
            <FiClock />
          </StatIcon>
          <StatInfo>
            <StatValue>{upcomingAppointments.length}</StatValue>
            <StatLabel>Upcoming</StatLabel>
          </StatInfo>
        </StatCard>

        <StatCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatIcon color="#8B5CF6">
            <FiHeart />
          </StatIcon>
          <StatInfo>
            <StatValue>{completedAppointments.length}</StatValue>
            <StatLabel>Completed</StatLabel>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* Recent Appointments */}
      <Section>
        <SectionHeader>
          <FiCalendar />
          <span>Recent Appointment History</span>
        </SectionHeader>
        {isLoadingAppointments ? (
          <LoadingText>Loading appointments...</LoadingText>
        ) : appointments.length > 0 ? (
          <AppointmentList>
            {appointments.slice(0, 5).map((apt, index) => (
              <AppointmentItem
                key={apt._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                cancelled={apt.status === "cancelled"}
              >
                <AppointmentInfo>
                  <DoctorName>{apt?.doctor?.user?.name || "Doctor"}</DoctorName>
                  <Specialty>{apt?.doctor?.specialty}</Specialty>
                </AppointmentInfo>
                <AppointmentMeta>
                  <AppointmentDate>{apt.date}</AppointmentDate>
                  <AppointmentStatus status={apt.status}>
                    {apt.status === "cancelled" ? "Cancelled" : "Booked"}
                  </AppointmentStatus>
                </AppointmentMeta>
              </AppointmentItem>
            ))}
          </AppointmentList>
        ) : (
          <EmptyState>No appointments yet. Book your first appointment!</EmptyState>
        )}
      </Section>

      {/* Health Tips */}
      <Section>
        <SectionHeader>
          <FiHeart />
          <span>Health Tips for You</span>
        </SectionHeader>
        <TipsGrid>
          {healthTips.map((tip, index) => (
            <TipCard
              key={tip.id}
              onClick={() => setSelectedTip(tip)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              <TipIcon color={tip.color}>
                <tip.icon />
              </TipIcon>
              <TipTitle>{tip.title}</TipTitle>
              <TipSummary>{tip.summary}</TipSummary>
              <ReadMore>Click to learn more →</ReadMore>
            </TipCard>
          ))}
        </TipsGrid>
      </Section>

      {/* Tip Detail Modal */}
      <AnimatePresence>
        {selectedTip && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTip(null)}
          >
            <ModalContent
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalClose onClick={() => setSelectedTip(null)}>
                <FiX />
              </ModalClose>
              <ModalIcon color={selectedTip.color}>
                <selectedTip.icon />
              </ModalIcon>
              <ModalTitle>{selectedTip.title}</ModalTitle>
              <ModalDetails>{selectedTip.details}</ModalDetails>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </DashboardContainer>
  );
};

export default PatientDashboard;

// Styled Components
const DashboardContainer = styled(motion.div)`
  width: 100%;
  max-width: 1000px;
  padding: 2rem;
  margin: 0 auto;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  color: #718096;
`;

const LoadingText = styled.p`
  color: #718096;
  text-align: center;
  padding: 2rem;
`;

const WelcomeCard = styled(motion.div)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 2rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const WelcomeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 600;
  border: 2px solid rgba(255, 255, 255, 0.4);
`;

const WelcomeText = styled.div``;

const Greeting = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
`;

const UserName = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const StatusBadge = styled.div`
  background: rgba(255, 255, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
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
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
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
`;

const StatInfo = styled.div``;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a202c;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #718096;
`;

const Section = styled.div`
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
`;

const SectionHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 1.5rem 0;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e2e8f0;

  svg {
    color: #667eea;
  }
`;

const AppointmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const AppointmentItem = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${(props) => (props.cancelled ? "#f7fafc" : "#fafbfc")};
  border-radius: 10px;
  border-left: 3px solid ${(props) => (props.cancelled ? "#cbd5e0" : "#667eea")};
  opacity: ${(props) => (props.cancelled ? 0.7 : 1)};
`;

const AppointmentInfo = styled.div``;

const DoctorName = styled.div`
  font-weight: 600;
  color: #2d3748;
`;

const Specialty = styled.div`
  font-size: 0.85rem;
  color: #718096;
`;

const AppointmentMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AppointmentDate = styled.div`
  font-size: 0.9rem;
  color: #4a5568;
`;

const AppointmentStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  background: ${(props) =>
    props.status === "cancelled" ? "#fed7d7" : "#c6f6d5"};
  color: ${(props) => (props.status === "cancelled" ? "#c53030" : "#276749")};
`;

const EmptyState = styled.div`
  text-align: center;
  color: #718096;
  padding: 2rem;
  background: #f7fafc;
  border-radius: 10px;
`;

const TipsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const TipCard = styled(motion.div)`
  background: #fafbfc;
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
`;

const TipIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 10px;
  background: ${(props) => `${props.color}15`};
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const TipTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
`;

const TipSummary = styled.p`
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #718096;
  line-height: 1.5;
`;

const ReadMore = styled.span`
  font-size: 0.8rem;
  color: #667eea;
  font-weight: 500;
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  text-align: center;
`;

const ModalClose = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f7fafc;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #718096;
  transition: all 0.2s;

  &:hover {
    background: #e2e8f0;
    color: #2d3748;
  }
`;

const ModalIcon = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${(props) => `${props.color}15`};
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 1.5rem;
`;

const ModalTitle = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
`;

const ModalDetails = styled.p`
  margin: 0;
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.7;
  text-align: left;
`;
