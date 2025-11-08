import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiUser, FiCalendar, FiLogOut } from "react-icons/fi";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";
import Logo from "./Logo";

const DoctorSidebar = () => {
  const { logout } = useContext(AuthContext);
  const [activeLink, setActiveLink] = useState("");

  return (
    <SidebarContainer
      initial={{ x: -60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <LogoContainer>
        {/* <Logo>
          Clinic<LogoSpan>360</LogoSpan>
        </Logo> */}
        <Logo />
      </LogoContainer>

      <NavLinks>
        <NavItem
          onMouseEnter={() => setActiveLink("profile")}
          onMouseLeave={() => setActiveLink("")}
        >
          <StyledLink
            to="/dashboard/doctor/profile"
            isActive={activeLink === "profile"}
          >
            <IconWrapper>
              <FiUser />
            </IconWrapper>
            <LinkText>Profile</LinkText>
            {activeLink === "profile" && (
              <ActiveIndicator
                layoutId="activeIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </StyledLink>
        </NavItem>

        <NavItem
          onMouseEnter={() => setActiveLink("appointments")}
          onMouseLeave={() => setActiveLink("")}
        >
          <StyledLink
            to="/dashboard/doctor/appointments"
            isActive={activeLink === "appointments"}
          >
            <IconWrapper>
              <FiCalendar />
            </IconWrapper>
            <LinkText>Appointments</LinkText>
            {activeLink === "appointments" && (
              <ActiveIndicator
                layoutId="activeIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </StyledLink>
        </NavItem>

        <NavItem
          onMouseEnter={() => setActiveLink("availability")}
          onMouseLeave={() => setActiveLink("")}
        >
          <StyledLink
            to="/dashboard/doctor/availability"
            isActive={activeLink === "availability"}
          >
            <IconWrapper>
              <FiCalendar />
            </IconWrapper>
            <LinkText>Set Availability</LinkText>
            {activeLink === "availability" && (
              <ActiveIndicator
                layoutId="activeIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </StyledLink>
        </NavItem>
      </NavLinks>

      <FooterSection>
        <LogoutButton
          onClick={logout}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <IconWrapper>
            <FiLogOut />
          </IconWrapper>
          <span>Logout</span>
        </LogoutButton>
      </FooterSection>
    </SidebarContainer>
  );
};

export default DoctorSidebar;

const SidebarContainer = styled(motion.div)`
  width: 280px;
  background: linear-gradient(135deg, #0c1e5c 0%, #0077b6 100%);
  color: white;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
`;

const LogoContainer = styled.div`
  padding: 1rem 0.5rem 2rem 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 2rem;
`;

// const Logo = styled.h2`
//   font-size: 1.8rem;
//   font-weight: 800;
//   letter-spacing: 0.5px;
//   text-align: center;
// `;

const LogoSpan = styled.span`
  color: #4cc9f0;
  background: linear-gradient(120deg, #4cc9f0, #00b4d8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const NavLinks = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
`;

const NavItem = styled.li`
  position: relative;
  width: 100%;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  color: ${(props) => (props.isActive ? "white" : "rgba(255, 255, 255, 0.7)")};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 12px;
  position: relative;
  background-color: ${(props) =>
    props.isActive ? "rgba(255, 255, 255, 0.1)" : "transparent"};

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.08);
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-right: 14px;
  font-size: 1.1rem;
`;

const LinkText = styled.span`
  font-weight: 500;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, #4cc9f0, #00b4d8);
  border-radius: 0 4px 4px 0;
`;

const FooterSection = styled.div`
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LogoutButton = styled(motion.button)`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 32, 32, 0.1);
    color: white;
  }
`;
