import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

const MainLayout = () => {
  return (
    <Container>
      <Navbar />
      <ContentContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <MainContentWrapper
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Outlet />
        </MainContentWrapper>
      </ContentContainer>
      <BackgroundGradient />
    </Container>
  );
};

export default MainLayout;

/* Full-page container with enhanced styling */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* width: 100vw; */
  background-color: #f9fafb;
  position: relative;
  overflow-x: hidden;
`;

/* Background gradient element */
const BackgroundGradient = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(0, 119, 182, 0.03) 0%,
    rgba(72, 202, 228, 0.03) 100%
  );
  z-index: -1;
  pointer-events: none;
`;

/* Animated content container */
const ContentContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  width: 100%;
  /* border: 2px solid red; */
  /* padding: 100px 24px 48px; */

  @media (max-width: 768px) {
    padding: 90px 16px 32px;
  }
`;

/* Main content area with enhanced visual design */
const MainContentWrapper = styled(motion.main)`
  width: 100%;
  /* max-width: 1200px; */
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03);
  /* padding: 32px; */
  min-height: calc(100vh - 180px);
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(0, 119, 182, 0.06);
  backdrop-filter: blur(10px);

  /* Glass morphism effect */
  background: rgba(255, 255, 255, 0.98);

  @media (max-width: 768px) {
    width: 100%;
    padding: 24px 20px;
    border-radius: 12px;
    min-height: calc(100vh - 150px);
  }

  /* Subtle inner highlight */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.8),
      rgba(255, 255, 255, 0)
    );
  }
`;
