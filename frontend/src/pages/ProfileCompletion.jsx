import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../contexts/AuthContext";
import { User, BookOpen, GraduationCap, Hash, ArrowRight, Loader2 } from "lucide-react";

const ProfileCompletion = () => {
  const navigate = useNavigate();
  const { updateProfile } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    department: "",
    studyYear: "",
    usn: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put("/users/profile", formData);
      updateProfile(data);
      navigate("/");
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 font-sans">
      <div className="absolute -left-1/4 top-0 h-[800px] w-[800px] -translate-y-1/2 animate-pulse rounded-full bg-indigo-600/10 blur-[120px] filter" style={{ animationDuration: '8s' }}></div>
      <div className="absolute -right-1/4 bottom-0 h-[600px] w-[600px] translate-y-1/4 animate-pulse rounded-full bg-purple-600/10 blur-[100px] filter" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>

      <div className="relative z-10 w-full max-w-xl p-6 sm:p-8">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl md:p-12">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-white">Complete Your Profile</h1>
            <p className="text-slate-400">Just a few more details before you can start riding.</p>
          </div>

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm font-medium text-red-400 backdrop-blur-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Department</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                  <BookOpen className="h-5 w-5" />
                </div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
                >
                  <option value="" disabled>Select your department</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ISE">Information Science (ISE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="MECH">Mechanical</option>
                  <option value="CIVIL">Civil</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">Study Year</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <select
                  name="studyYear"
                  value={formData.studyYear}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500 [&>option]:bg-slate-900"
                >
                  <option value="" disabled>Select your year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300">USN (University Seat Number)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-500">
                  <Hash className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  name="usn"
                  value={formData.usn}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 1BM21CS000"
                  className="w-full rounded-xl border border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500 focus:bg-white/10 focus:ring-1 focus:ring-indigo-500 uppercase"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-4 font-medium text-white transition-all hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Complete Profile
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
