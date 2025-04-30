import { Link } from "react-router-dom";
import "./EndPage.css";

function EndPage() {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>good job</h1>
      <Link to="/">
        <button>go home</button>
      </Link>
    </div>
  );
}

export default EndPage;
