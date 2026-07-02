import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

function MainLayout() {
  return (
    <div className="d-flex">
      <Sidebar />

      <div className="flex-grow-1">
        <TopNavbar />

        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;