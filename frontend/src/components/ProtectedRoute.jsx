import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const ProtectedRoute = ({ children, requireProfile = false }) => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-indigo-500 border-solid border-slate-700"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireProfile && !user.isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
};

export default ProtectedRoute;
