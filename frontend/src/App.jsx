import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/users/home";
import Login from "./pages/auth/login";
import MainComponent from "./pages/users/main/MainComponent";
import AdminComponent from "./pages/admin/main/AdminComponent";
import InActivePage from "./pages/auth/InActivePage";
import Register from "./pages/auth/Register";
import Auth from "./pages/auth/Auth";
import CustomResult from "./component/CustomResult";
import ResetPassword from "./pages/auth/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Auth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/onboarding" element={<InActivePage />} />
        </Route>
        <Route path="/home/:module" element={<MainComponent />} />
        <Route path="/admin/:module" element={<AdminComponent />} />
        <Route path="*" element={<CustomResult statusCode={404} />} />
      </Routes>
    </Router>
  );
}

export default App;
