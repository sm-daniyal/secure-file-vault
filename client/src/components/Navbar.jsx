// components/Navbar.jsx — v2 Corporate Clean

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
        <div className="nav-brand">
          <div className="nav-logo-box">🔒</div>
          <span className="nav-title">Secure File Vault</span>
        </div>

        <div className="nav-right">
          <span className="nav-user">
            <span className="nav-online" />
            {username}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
