import { Link } from "react-router-dom";

function VideoCard({ video }) {
  return (
    <Link
      to={`/video/${video.id}`}
      className="video-card"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="video-thumbnail"
      />

      <div className="video-info">
        <h3>{video.title}</h3>

        <p>{video.channel}</p>

        <p>{video.views} views</p>
      </div>
    </Link>
  );
}

export default VideoCard;