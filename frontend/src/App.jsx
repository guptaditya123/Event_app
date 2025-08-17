// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Signp from "./pages/Signp";
import Dashboard from "./pages/Dashboard";
import HostGame from "./pages/HostGame";
import PrivateRoute from "./components/PrivateRoute"; // <-- NEW

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signp />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/host"
            element={
              <PrivateRoute>
                <HostGame />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
  );
}

export default App;
