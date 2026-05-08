import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import { LogOut, Car, Search, Plus, MapPin, Calendar, Clock } from "lucide-react";

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100">
      <Navbar />

      {/* Main Content Area - Phase 3 Preview */}
      <main className="mx-auto max-w-7xl p-6 py-12">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-2 text-slate-400">Where are you heading today?</p>
        </div>

        {/* Action Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Find a Ride */}
          <div className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-indigo-500/50 hover:bg-white/10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
              <Search className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Find a Ride</h2>
            <p className="mt-2 text-slate-400">Browse available rides heading to your destination.</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100">
              Explore rides &rarr;
            </div>
          </div>

          {/* Offer a Ride */}
          <div className="group cursor-pointer rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:border-purple-500/50 hover:bg-white/10">
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300">
              <Plus className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Offer a Ride</h2>
            <p className="mt-2 text-slate-400">Got an empty seat? Share your ride and split the cost.</p>
            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-purple-400 opacity-0 transition-opacity group-hover:opacity-100">
              Create ride &rarr;
            </div>
          </div>
        </div>

        {/* Decorative coming soon section */}
        <div className="mt-16 rounded-3xl border border-white/5 bg-slate-900/50 p-8 text-center backdrop-blur-sm">
          <p className="text-sm font-medium text-slate-500">Ride matching system coming soon in Phase 3!</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
