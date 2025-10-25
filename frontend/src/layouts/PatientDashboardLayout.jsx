import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import ChatBot from "../components/ChatBot";

const Container = styled.div`
  min-height: 100vh;
  background-color: #f5f7fa;
`;

const MainContent = styled(motion.div)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
`;

const PageTransition = styled(motion.div)`
  height: 100%;
`;

const PatientDashboardLayout = () => {
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeInOut",
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Container>
      <Navbar />
      <MainContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <PageTransition
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
        >
          <Outlet />
        </PageTransition>
      </MainContent>
      <ChatBot />
    </Container>
  );
};

export default PatientDashboardLayout;
