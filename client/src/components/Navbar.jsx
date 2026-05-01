// ============================================================
// components/Navbar.jsx — Top navigation bar
// ============================================================

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = ({ username }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <div className="nav-brand">
          <span className="nav-logo">⬡</span>
          <span className="nav-title">SECURE VAULT</span>
        </div>

        {/* Right side */}
        <div className="nav-right">
          <span className="nav-user">
            <span className="nav-dot" />
            {username}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
