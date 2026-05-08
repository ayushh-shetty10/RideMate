import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import ProfileCompletion from "./pages/ProfileCompletion";
import AllRides from "./pages/AllRides";
import LandingPage from "./pages/LandingPage";
import CreateRide from "./pages/CreateRide";
import MyRides from "./pages/MyRides";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRoute from "./components/AdminRoute";

const App = () => {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
};

export default App;
