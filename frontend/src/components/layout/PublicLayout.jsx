import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default PublicLayout;
