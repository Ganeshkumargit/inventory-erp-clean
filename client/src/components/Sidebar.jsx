import { NavLink } from "react-router-dom";

function Sidebar() {
  const linkClass = ({ isActive }) =>
    `nav-link rounded px-3 py-2 mb-1 ${
      isActive ? "bg-primary text-white" : "text-white"
    }`;

  return (
    <div
      className="bg-dark text-white p-3"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      <div className="mb-4">
        <h4 className="mb-0">StockFlow ERP</h4>
        <small className="text-secondary">Inventory Management</small>
      </div>

      <hr />

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className={linkClass} to="/dashboard">
            📊 Dashboard
          </NavLink>
        </li>
      </ul>

      <p className="text-secondary mt-4 mb-2 small">MASTERS</p>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className={linkClass} to="/categories">
            🗂️ Categories
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className={linkClass} to="/products">
            📦 Products
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className={linkClass} to="/suppliers">
            🚚 Suppliers
          </NavLink>
        </li>
      </ul>

      <p className="text-secondary mt-4 mb-2 small">INVENTORY</p>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className={linkClass} to="/purchases">
            🧾 Purchases
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className={linkClass} to="/stock">
            📈 Stock
          </NavLink>
        </li>
      </ul>

      <p className="text-secondary mt-4 mb-2 small">FILES & REPORTS</p>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className={linkClass} to="/documents">
            📁 Documents
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className={linkClass} to="/reports">
            📊 Reports
          </NavLink>
        </li>
      </ul>

      <p className="text-secondary mt-4 mb-2 small">SYSTEM</p>

      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink className={linkClass} to="/users">
            👤 Users
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink className={linkClass} to="/settings">
            ⚙️ Settings
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;