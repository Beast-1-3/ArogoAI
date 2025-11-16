import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const DoctorDashboardLayout = () => {
  return (
    <Container>
      <Navbar />
      <MainContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default DoctorDashboardLayout;

const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  flex-grow: 1;
`;
