import { useParams } from "react-router-dom";

function VideoPlayer() {
  const { id } = useParams();

  return (
    <div>
      <h1>Video Player</h1>
      <p>Video ID: {id}</p>
    </div>
  );
}

export default VideoPlayer;