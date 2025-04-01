import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import Play from "./pages/Play/Play";
import MemoryEasy from "./pages/Easy/MemoryEasy";
import Congteasy from "./pages/Congratseasy/Congratseasy";
import MemoryMedium from "./pages/Medium/MemoryMedium";
import Congtnormal from "./pages/Congratsnormal/Congratsnormal";
import MemoryCardGame from "./pages/MemoryCardGame/MemoryCardGame";
import Congratulations from "./pages/Congratulation/Congratulation";

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const navigate = useNavigate();
  const location = useLocation().pathname;

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    if (location === "/login" && isAuthenticated) {
      navigate("/play");
    }
  }, [location, isAuthenticated, navigate]);

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/play"
        element={isAuthenticated ? <Play /> : <Navigate to="/login" />}
      />

      <Route
        path="/easy"
        element={isAuthenticated ? <MemoryEasy /> : <Navigate to="/login" />}
      />

      <Route
        path="/congt-easy"
        element={isAuthenticated ? <Congteasy /> : <Navigate to="/login" />}
      />

      <Route
        path="/medium"
        element={isAuthenticated ? <MemoryMedium /> : <Navigate to="/login" />}
      />

      <Route
        path="/congt-normal"
        element={isAuthenticated ? <Congtnormal /> : <Navigate to="/login" />}
      />

      <Route
        path="/memory-card-game"
        element={
          isAuthenticated ? <MemoryCardGame /> : <Navigate to="/login" />
        }
      />

      <Route
        path="/congratulations"
        element={
          isAuthenticated ? <Congratulations /> : <Navigate to="/login" />
        }
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
