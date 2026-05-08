import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ProfileCompletion from "./pages/ProfileCompletion";
import AllRides from "./pages/AllRides";
import LandingPage from "./pages/LandingPage";
import CreateRide from "./pages/CreateRide";
import MyRides from "./pages/MyRides";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

const AppContent = () => {
  const { isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-20 w-20 animate-ping rounded-full bg-indigo-500/20"></div>
          <div className="h-12 w-12 animate-spin rounded-full border-t-4 border-indigo-500 border-solid border-slate-800 shadow-xl shadow-indigo-500/10"></div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/complete-profile" 
          element={
            <ProtectedRoute>
              <ProfileCompletion />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/all-rides" 
          element={
            <ProtectedRoute requireProfile={true}>
              <AllRides />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-ride" 
          element={
            <ProtectedRoute requireProfile={true}>
              <CreateRide />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-rides" 
          element={
            <ProtectedRoute requireProfile={true}>
              <MyRides />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
