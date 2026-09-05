function VideoCard({ video }) {
  return (
    <div className="video-card">
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
    </div>
  );
}

export default VideoCard;