import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/users/home";
import Login from "./pages/auth/login";
import MainComponent from "./pages/users/main/MainComponent";
import AdminComponent from "./pages/admin/main/AdminComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home/:module" element={<MainComponent />} />
        <Route path="/admin/:module" element={<AdminComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
