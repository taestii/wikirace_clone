import { Link } from "react-router-dom";

function Homepage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>wikipedia race</h1>
      <Link to="/game">
        <button>Start Game</button>
      </Link>
    </div>
  );
}

export default Homepage;
