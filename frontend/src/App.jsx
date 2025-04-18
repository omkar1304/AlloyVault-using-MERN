import "./App.css";
import { ConfigProvider } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import MainComponent from "./pages/users/main/MainComponent";
import AdminComponent from "./pages/admin/main/AdminComponent";
import InActivePage from "./pages/auth/InActivePage";
import Register from "./pages/auth/Register";
import Auth from "./pages/auth/Auth";
import CustomResult from "./component/CustomResult";
import ResetPassword from "./pages/auth/ResetPassword";
import Login from "./pages/auth/Login";
import verifyToken from "./helpers/verifyToken";
import { useEffect } from "react";

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#000",
        },
        components: {
          Menu: {
            itemSelectedBg: "#E0E0E0",
            itemSelectedColor: "#000",
          },
        },
      }}
    >
      <Router>
        <Routes>
          <Route element={<Auth />}>
            <Route path="/" element={<Entry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/onboarding" element={<InActivePage />} />
          </Route>
          <Route path="/home/:module" element={<MainComponent />}>
            <Route path="/home/:module/:id" />
          </Route>
          <Route path="/admin/:module" element={<AdminComponent />} />
          <Route path="*" element={<CustomResult statusCode={404} />} />
        </Routes>
      </Router>
    </ConfigProvider>
  );
}

const Entry = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = verifyToken();
    const navigateUrl = isAuthenticated
      ? import.meta.env.VITE_INITIAL_ROUTE
      : "/login";
    return navigate(navigateUrl);
  }, []);
};

export default App;
