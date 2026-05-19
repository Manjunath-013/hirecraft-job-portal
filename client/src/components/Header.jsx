import { BriefcaseBusiness, LogOut, UserRound } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand">
        <BriefcaseBusiness size={24} />
        <span>HireCraft</span>
      </Link>

      <nav>
        <NavLink to="/jobs">Apply Jobs</NavLink>
        {user?.role === "candidate" && <NavLink to="/candidate">Candidate</NavLink>}
        {user?.role === "recruiter" && <NavLink to="/recruiter">Recruiter</NavLink>}
      </nav>

      <div className="header-actions">
        {user ? (
          <>
            <span className="user-chip">
              <UserRound size={16} />
              {user.name}
            </span>
            <button className="icon-button" type="button" onClick={handleLogout} title="Log out">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link className="ghost-link" to="/login">
              Login
            </Link>
            <Link className="primary-link" to="/register">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
