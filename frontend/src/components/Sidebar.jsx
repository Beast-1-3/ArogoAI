import { Link } from "react-router-dom";
import styled from "styled-components";
import { FiUser, FiCalendar, FiLogOut } from "react-icons/fi";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  return (
    <SidebarContainer>
      <Logo>
        Clinic<span>360</span>
      </Logo>
      <NavLinks>
        <StyledLink to="/dashboard/patient">
          <FiUser /> Profile
        </StyledLink>
        <StyledLink to="/dashboard/appointments">
          <FiCalendar /> Appointments
        </StyledLink>
        <LogoutButton onClick={logout}>
          <FiLogOut /> Logout
        </LogoutButton>
      </NavLinks>
    </SidebarContainer>
  );
};

export default Sidebar;

const SidebarContainer = styled.div`
  width: 250px;
  background: #0077b6;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.h2`
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 2rem;
  span {
    color: #00b4d8;
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  transition: 0.3s;
  &:hover {
    color: #00b4d8;
  }
`;

const LogoutButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  margin-top: 2rem;
  &:hover {
    color: #00b4d8;
  }
`;
