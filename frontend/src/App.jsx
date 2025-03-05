import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/users/home";
import Login from "./pages/auth/login";
import MainComponent from "./pages/users/main/MainComponent";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home/:module" element={<MainComponent />} />
      </Routes>
    </Router>
  );
}

export default App;
