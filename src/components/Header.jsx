import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn">☰</button>

        <Link to="/" className="logo">
          <span className="logo-icon">▶</span>
          <span>YouTube</span>
        </Link>
      </div>

      <div className="search-box">
        <input type="text" placeholder="Search" />
        <button>🔍</button>
      </div>

      <div className="header-right">
        {token && user ? (
          <>
            <span className="username">
              👤 {user.username}
            </span>

            <button
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;