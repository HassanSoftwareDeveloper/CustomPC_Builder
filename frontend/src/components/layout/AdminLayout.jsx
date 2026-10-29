import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <main className="flex-1 bg-bg">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
