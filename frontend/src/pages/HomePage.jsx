import { Link } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import Button from "../components/Button";

const HomePage = () => {
  return (
    <Container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <HeroTitle>
              Find & Book <HeroSpan>Your Doctor</HeroSpan> Instantly
            </HeroTitle>
            <HeroSubtitle
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Seamless appointment booking with top-rated doctors.
            </HeroSubtitle>
          </motion.div>

          <SearchBarWrapper
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <SearchBar>
              <SearchIcon>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="#888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 21L16.65 16.65"
                    stroke="#888"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </SearchIcon>
              <SearchInput
                type="text"
                placeholder="Search by specialty, name, or location..."
              />
              <SearchButtonWrapper to="/search">
                <SearchButton
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                >
                  Search
                </SearchButton>
              </SearchButtonWrapper>
            </SearchBar>
          </SearchBarWrapper>
        </HeroContent>

        <BackgroundDecoration
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.8, scale: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        />
      </HeroSection>

      {/* CTA Section */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <CTA>
          <CTAContent>
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.6 }}
            >
              <CTATitle>Need Medical Assistance?</CTATitle>
              <CTASubtitle>
                Join now and book your first appointment today.
              </CTASubtitle>
            </motion.div>
            <CTAButtonWrapper to="/login">
              <CTAButton
                variant="primary"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 20px rgba(0, 119, 182, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                Get Started
              </CTAButton>
            </CTAButtonWrapper>
          </CTAContent>
          <CTADecoration
            animate={{
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.05, 1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: 20,
            }}
          />
        </CTA>
      </motion.div>
    </Container>
  );
};

export default HomePage;

const Container = styled(motion.div)`
  min-height: 100vh;
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, #f9fdff, #f0f9ff);
  overflow: hidden;
  position: relative;
`;

const HeroSection = styled.div`
  position: relative;
  max-width: 1200px;
  margin: 2rem auto 6rem;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeroContent = styled.div`
  text-align: center;
  position: relative;
  z-index: 2;
`;

const BackgroundDecoration = styled(motion.div)`
  position: absolute;
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(0, 119, 182, 0.1),
    rgba(72, 202, 228, 0.2)
  );
  filter: blur(80px);
  z-index: 1;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, #023e8a, #0077b6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSpan = styled.span`
  color: #0096c7;
  background: linear-gradient(to right, #0096c7, #48cae4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #555;
  margin-bottom: 2.5rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SearchBarWrapper = styled(motion.div)`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 119, 182, 0.1);
  transition: all 0.3s ease;

  &:focus-within {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
    border-color: rgba(0, 119, 182, 0.3);
    transform: translateY(-2px);
  }
`;

const SearchIcon = styled.div`
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1rem 0.75rem;
  font-size: 1rem;
  border: none;
  outline: none;
  color: #333;
  background-color: white;

  &::placeholder {
    color: #aaa;
  }
`;

const SearchButtonWrapper = styled(Link)`
  text-decoration: none;
`;

const SearchButton = styled(motion(Button))`
  padding: 1rem 2rem;
  background: linear-gradient(to right, #0077b6, #0096c7);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(0, 119, 182, 0.2);
`;

const CTA = styled.div`
  position: relative;
  background: linear-gradient(135deg, #023e8a, #0077b6);
  color: white;
  padding: 3rem;
  border-radius: 16px;
  margin: 3rem auto;
  max-width: 1000px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
`;

const CTAContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CTASubtitle = styled.p`
  font-size: 1.2rem;
  margin-bottom: 2rem;
  opacity: 0.9;
`;

const CTAButtonWrapper = styled(Link)`
  text-decoration: none;
`;

const CTAButton = styled(motion(Button))`
  padding: 1rem 2.5rem;
  background: white;
  color: #0077b6;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const CTADecoration = styled(motion.div)`
  position: absolute;
  top: -50%;
  right: -20%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(72, 202, 228, 0.2);
  z-index: 1;
`;
