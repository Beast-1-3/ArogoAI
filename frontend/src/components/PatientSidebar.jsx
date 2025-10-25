import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { FiUser, FiCalendar, FiLogOut, FiHome } from "react-icons/fi";
import { useContext } from "react";
import { motion } from "framer-motion";
import AuthContext from "../context/AuthContext";
import Logo from "./Logo";

const SidebarContainer = styled(motion.div)`
  width: 280px;
  background: linear-gradient(180deg, #1a2980 0%, #26d0ce 140%);
  color: white;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-y: auto;
  z-index: 10;
`;

// const Logo = styled(motion.h2)`
//   font-size: 1.8rem;
//   font-weight: 700;
//   margin-bottom: 3rem;
//   letter-spacing: 0.5px;
//   display: flex;
//   align-items: center;

//   span {
//     background: linear-gradient(90deg, #00f5a0 0%, #00d9f5 100%);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     font-weight: 800;
//   }
// `;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  flex-grow: 1;
`;

const StyledLink = styled(motion(Link))`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${(props) => (props.active ? "white" : "rgba(255, 255, 255, 0.8)")};
  text-decoration: none;
  font-size: 1rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  padding: 1rem;
  border-radius: 12px;
  background: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.15)" : "transparent"};
  backdrop-filter: ${(props) => (props.active ? "blur(10px)" : "none")};
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const LogoutButton = styled(motion.button)`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  margin-top: 4rem;
  padding: 1rem;
  border-radius: 12px;
  width: 100%;
  text-align: left;
  transition: all 0.3s ease;
  position: relative;

  svg {
    font-size: 1.2rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const PatientInfo = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1.5rem;
  margin-top: 2.5rem;
`;

const PatientName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.2rem 0;
`;

const PatientRole = styled.p`
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.8;
`;

const PatientAvatar = styled(motion.div)`
  width: 60px;
  height: 60px;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const PatientSidebar = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();

  // Check if the link is active
  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <SidebarContainer
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Logo />

      <PatientInfo variants={itemVariants}>
        <PatientAvatar whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {user?.name[0]}
        </PatientAvatar>
        <PatientName>{user?.name}</PatientName>
        <PatientRole>Patient</PatientRole>
      </PatientInfo>

      <NavLinks>
        <StyledLink
          to="/dashboard/patient"
          active={location.pathname === "/dashboard/patient" ? 1 : 0}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiHome /> Dashboard
        </StyledLink>

        <StyledLink
          to="/dashboard/patient/profile"
          active={isActive("/profile") ? 1 : 0}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiUser /> Profile
        </StyledLink>

        <StyledLink
          to="/dashboard/patient/appointments"
          active={isActive("/appointments") ? 1 : 0}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiCalendar /> Appointments
        </StyledLink>

        <LogoutButton
          onClick={logout}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiLogOut /> Logout
        </LogoutButton>
      </NavLinks>
    </SidebarContainer>
  );
};

export default PatientSidebar;
