import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { MapPin, Calendar, Clock, Car, Users, ArrowLeft, Loader2, Sparkles } from "lucide-react";

const CreateRide = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from: "",
    destination: "",
    date: "",
    time: "",
    transportMode: "AUTO",
    totalSeats: 3,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      await api.post("/rides", {
        ...formData,
        dateTime,
      });
      navigate("/all-rides");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Navbar />
      <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-400 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to All Rides
        </button>

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl md:p-10">
          {/* Animated Background Glow */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px] filter"></div>
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-600/10 blur-[100px] filter"></div>

          <div className="relative mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-[10px] font-bold tracking-widest text-indigo-400 uppercase">
              <Sparkles className="h-3.5 w-3.5" />
              Start a Shared Journey
            </div>
            <h1 className="text-3xl font-bold text-white">Create a Ride</h1>
            <p className="mt-2 text-slate-400">Share your route and find student companions.</p>
          </div>

          <form onSubmit={handleSubmit} className="relative space-y-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">From</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                  <input
                    required
                    type="text"
                    placeholder="Pickup location"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Destination</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-500" />
                  <input
                    required
                    type="text"
                    placeholder="Where are you heading?"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-500" />
                  <input
                    required
                    type="date"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10 [color-scheme:dark]"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Time</label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-purple-500" />
                  <input
                    required
                    type="time"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10 [color-scheme:dark]"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mode of Transport</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-500" />
                  <select
                    className="w-full appearance-none rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10 [&>option]:bg-slate-900"
                    value={formData.transportMode}
                    onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
                  >
                    <option value="AUTO">Auto Rickshaw</option>
                    <option value="CAB">Private Cab</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Seats</label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-pink-500" />
                  <input
                    required
                    type="number"
                    min="1"
                    max="10"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10"
                    value={formData.totalSeats}
                    onChange={(e) => setFormData({ ...formData, totalSeats: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4.5 text-base font-bold text-white shadow-xl shadow-indigo-600/20 transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                "Post This Ride"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default CreateRide;
