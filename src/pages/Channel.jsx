import { useParams } from "react-router-dom";

function Channel() {
  const { id } = useParams();

  return (
    <div>
      <h1>Channel Page</h1>
      <p>Channel ID: {id}</p>
    </div>
  );
}

export default Channel;