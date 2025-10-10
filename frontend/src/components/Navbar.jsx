import { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AuthContext from "../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <Nav>
      <NavContainer>
        <Logo />
        <NavLinks>
          {!user && (
            <NavItem>
              <StyledLink to="/">Home</StyledLink>
            </NavItem>
          )}
          <NavItem>
            <StyledLink to="/search">Find a Doctor</StyledLink>
          </NavItem>

          {user ? (
            <>
              {user.role === "patient" && (
                <NavItem>
                  <StyledLink to="/dashboard/patient/appointments">
                    Appointments
                  </StyledLink>
                </NavItem>
              )}
              <NavItem>
                <StyledLink to={`/dashboard/${user.role}`}>
                  Dashboard
                </StyledLink>
              </NavItem>
              <NavItem>
                <ProfileContainer ref={dropdownRef}>
                  <ProfileAvatar onClick={toggleDropdown}>
                    {getInitials(user.name)}
                  </ProfileAvatar>
                  {dropdownOpen && (
                    <DropdownMenu>
                      <DropdownItem to={`/dashboard/${user.role}/profile`}>Profile</DropdownItem>
                      <DropdownDivider />
                      <DropdownButton onClick={logout}>Logout</DropdownButton>
                    </DropdownMenu>
                  )}
                </ProfileContainer>
              </NavItem>
            </>
          ) : (
            <>
              <NavItem>
                <StyledLink to="/login">Login</StyledLink>
              </NavItem>
              <NavItem>
                <SignUpButton to="/register">Sign Up</SignUpButton>
              </NavItem>
            </>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;

const Nav = styled.nav`
  background: linear-gradient(90deg, #0077b6 0%, #023e8a 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100vw;
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const NavContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const LogoSpan = styled.span`
  color: #48cae4;
  font-weight: 800;
`;

const NavLinks = styled.ul`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  display: flex;
  align-items: center;
`;

const StyledLink = styled(Link)`
  color: #e6f8ff;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
  }
`;

const SignUpButton = styled(Link)`
  background-color: #48cae4;
  color: #023e8a;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background-color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
  }
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfileAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #48cae4 0%, #0077b6 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: all 0.2s ease;

  &:hover {
    border-color: white;
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  min-width: 160px;
  overflow: hidden;
  z-index: 1001;
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 0.75rem 1rem;
  color: #2d3748;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.15s ease;

  &:hover {
    background: #f7fafc;
    color: #0077b6;
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 0;
`;

const DropdownButton = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: #e53e3e;
  font-weight: 500;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fff5f5;
  }
`;
