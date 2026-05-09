import React, { useContext, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import { Car, MapPin } from "lucide-react";

const Login = () => {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  if (user) {
    if (user.isProfileComplete) {
      return <Navigate to="/all-rides" replace />;
    }
    return <Navigate to="/complete-profile" replace />;
  }

  const handleSuccess = async (credentialResponse) => {
    try {
      setError(null);
      const { data } = await api.post("/auth/google", {
        credential: credentialResponse.credential,
      });
      login(data, data.token);
      if (data.isProfileComplete) {
        navigate("/all-rides");
      } else {
        navigate("/complete-profile");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred during login. Please try again.");
      }
    }
  };


  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute left-1/4 top-1/4 h-96 w-96 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-indigo-600/20 blur-3xl filter"></div>
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 translate-x-1/3 translate-y-1/3 animate-pulse rounded-full bg-purple-600/20 blur-3xl filter" style={{ animationDelay: '2s' }}></div>
      <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-blue-600/10 blur-[100px] filter" style={{ animationDelay: '4s' }}></div>

      <div className="relative z-10 w-full max-w-md p-8 sm:p-10">
        <div className="group rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-white/20 hover:bg-white/10">
          
          {/* Logo & Brand */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30 transition-transform duration-500 group-hover:scale-110">
              <Car className="h-10 w-10 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="bg-gradient-to-r from-indigo-200 via-white to-purple-200 bg-clip-text text-4xl font-bold tracking-tight text-transparent">
              RideMate
            </h1>
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-400">
              <MapPin className="h-4 w-4" /> Campus Exclusive Ride-Sharing
            </p>
          </div>

          {/* Login Form / Action */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-slate-200">Welcome Back</h2>
              <p className="mt-1 text-sm text-slate-400">
                Use your college email only
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-center text-sm font-medium text-red-400 backdrop-blur-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center pt-2">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError("Google Login Failed")}
                theme="filled_black"
                shape="pill"
                size="large"
                use_fedcm_for_prompt={true}
              />
            </div>
            
            <div className="mt-8 text-center text-xs text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
