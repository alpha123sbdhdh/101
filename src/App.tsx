import { NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { LoginRoute } from "./auth/LoginRoute";
import { SignUpRoute } from "./auth/SignUpRoute";
import { HomeRoute } from "./routes/HomeRoute";
import { ProjectRoute } from "./routes/ProjectRoute";
import { CaptureRoute } from "./routes/CaptureRoute";
import { RoomViewerRoute } from "./routes/RoomViewerRoute";
import { SellRoute } from "./routes/SellRoute";
import { supabase } from "./lib/supabaseClient";

function TopNav() {
  const { session } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="top-nav">
      <NavLink to="/" className="brand">
        <span className="brand-mark" />
        Roomcast
      </NavLink>
      {session && (
        <div className="nav-links">
          <NavLink to="/" end>
            Projects
          </NavLink>
          <NavLink to="/sell">Sell</NavLink>
          <button
            className="btn btn-ghost"
            style={{ padding: "8px 16px", minHeight: 0 }}
            onClick={async () => {
              await supabase.auth.signOut();
              navigate("/login");
            }}
          >
            Log out
          </button>
        </div>
      )}
    </nav>
  );
}

export function App() {
  const location = useLocation();

  return (
    <div className="app-shell">
      <TopNav />
      <div className="main-content">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<LoginRoute />} />
            <Route path="/signup" element={<SignUpRoute />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<HomeRoute />} />
              <Route path="/sell" element={<SellRoute />} />
              <Route path="/projects/:projectId" element={<ProjectRoute />} />
              <Route path="/projects/:projectId/rooms/:roomId/capture" element={<CaptureRoute />} />
              <Route path="/projects/:projectId/rooms/:roomId" element={<RoomViewerRoute />} />
            </Route>
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  );
}
