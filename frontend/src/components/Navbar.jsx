import { FaRocket, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>
        <FaRocket /> DevBoard
      </h2>

      <button onClick={logout}>
        <FaSignOutAlt /> Logout
      </button>
    
    </nav>
  );
}

export default Navbar;