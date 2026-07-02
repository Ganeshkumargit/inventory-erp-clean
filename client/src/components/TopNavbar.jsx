import { useNavigate } from "react-router-dom";

function TopNavbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="bg-light p-3 d-flex justify-content-between align-items-center border-bottom">
      <strong>Welcome, {user?.name}</strong>

      <button className="btn btn-danger btn-sm" onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default TopNavbar;