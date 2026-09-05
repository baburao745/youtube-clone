function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-item active">
        🏠 <span>Home</span>
      </div>

      <div className="sidebar-item">
        🔥 <span>Trending</span>
      </div>

      <div className="sidebar-item">
        📺 <span>Subscriptions</span>
      </div>

      <hr />

      <div className="sidebar-item">
        📚 <span>Library</span>
      </div>

      <div className="sidebar-item">
        🕘 <span>History</span>
      </div>

      <div className="sidebar-item">
        👍 <span>Liked Videos</span>
      </div>

      <hr />

      <h3>Explore</h3>

      <div className="sidebar-item">
        🎵 <span>Music</span>
      </div>

      <div className="sidebar-item">
        🎮 <span>Gaming</span>
      </div>

      <div className="sidebar-item">
        📰 <span>News</span>
      </div>

      <div className="sidebar-item">
        🏆 <span>Sports</span>
      </div>
    </aside>
  );
}

export default Sidebar;