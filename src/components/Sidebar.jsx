import { Link } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { name: "Home", icon: "🏠", path: "/" },
    { name: "Trending", icon: "🔥", path: "/" },
    { name: "Subscriptions", icon: "📺", path: "/" },
    { name: "Library", icon: "📚", path: "/" },
    { name: "History", icon: "🕘", path: "/" },
    { name: "Liked Videos", icon: "👍", path: "/" }
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
        ></div>
      )}

      <aside
        className={`sidebar ${
          isOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="sidebar-header">
          <h3>Menu</h3>

          <button
            className="sidebar-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className="sidebar-item"
            onClick={onClose}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}

        <hr />

        <h4>Explore</h4>

        <Link
          to="/"
          className="sidebar-item"
          onClick={onClose}
        >
          🎵 Music
        </Link>

        <Link
          to="/"
          className="sidebar-item"
          onClick={onClose}
        >
          🎮 Gaming
        </Link>

        <Link
          to="/"
          className="sidebar-item"
          onClick={onClose}
        >
          📰 News
        </Link>

        <Link
          to="/"
          className="sidebar-item"
          onClick={onClose}
        >
          ⚽ Sports
        </Link>
      </aside>
    </>
  );
}

export default Sidebar;