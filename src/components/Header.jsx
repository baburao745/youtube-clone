import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Header() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSearch = (e) => {
    e.preventDefault();

    if (searchText.trim()) {
      navigate(
        `/?search=${encodeURIComponent(searchText.trim())}`
      );
    } else {
      navigate("/");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">

      {/* LEFT */}
      <div className="header-left">
        <button className="menu-btn">
          ☰
        </button>

        <Link to="/" className="logo">
          <span className="logo-icon">▶</span>
          <span>YouTube</span>
        </Link>
      </div>

      {/* SEARCH */}
      <form
        className="search-box"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          placeholder="Search"
          value={searchText}
          onChange={(e) =>
            setSearchText(e.target.value)
          }
        />

        <button type="submit">
          🔍
        </button>
      </form>

      {/* RIGHT */}
      <div className="header-right">

        {token && user ? (
          <>
            {/* CREATE CHANNEL */}
            <Link
              to="/create-channel"
              className="create-channel-btn"
            >
              + Create Channel
            </Link>

            {/* USERNAME */}
            <span className="username">
              👤 {user.username}
            </span>

            {/* LOGOUT */}
            <button
              className="login-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="login-btn"
          >
            Sign In
          </Link>
        )}

      </div>
    </header>
  );
}

export default Header;