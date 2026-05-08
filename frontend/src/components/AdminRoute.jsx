import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AdminRoute = ({ children }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-indigo-500 border-solid border-slate-700"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
