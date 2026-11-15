import { Navigate, Outlet } from "react-router-dom";
import { authClient } from "../lib/auth-client";

const AdminRoute = () => {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (session.user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;