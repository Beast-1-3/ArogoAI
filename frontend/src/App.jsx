import { GlobalStyles } from "./styles/GlobalStyles";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter } from "react-router-dom";
// import { useEffect } from "react";
import Toast from "./components/Toast";

function App() {
  // useEffect(() => {
  //   Toast.configure();
  // }, []);
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalStyles />
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
