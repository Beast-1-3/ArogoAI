import { Outlet } from "react-router-dom";
import styled from "styled-components";
import DoctorSidebar from "../components/DoctorSidebar";

const DoctorDashboardLayout = () => {
  return (
    <Container>
      <DoctorSidebar />
      <MainContent>
        <Outlet />
      </MainContent>
    </Container>
  );
};

export default DoctorDashboardLayout;

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #fff;
`;

const MainContent = styled.div`
  flex-grow: 1;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  /* box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); */
  overflow-y: auto;
  /* margin: 1rem; */
  /* min-height: calc(100vh - 2rem); */
  height: 100vh;
  /* width: 100%; */
`;
