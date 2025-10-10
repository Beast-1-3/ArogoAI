import styled from "styled-components";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LogoLink = styled(Link)`
  text-decoration: none;
  display: inline-block;
`;

const LogoContainer = styled(motion.div)`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: 1.6rem;
  letter-spacing: -0.02em;
`;

const LogoText = styled.span`
  background: linear-gradient(135deg, #f0f9ff 0%, #bae6fd 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  /* text-shadow: 0 0 15px rgba(240, 249, 255, 0.5); */
`;

const AIText = styled.span`
  color: #ffffff;
  font-weight: 800;
  position: relative;
`;

const Logo = () => {
  const logoVariants = {
    hover: {
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  };

  return (
    <LogoLink to="/">
      <LogoContainer
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        variants={logoVariants}
        whileHover="hover"
        whileTap="tap"
      >
        <LogoText>Arogo</LogoText>
        <AIText>AI</AIText>
      </LogoContainer>
    </LogoLink>
  );
};

export default Logo;
