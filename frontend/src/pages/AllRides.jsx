import React, { useState, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../contexts/AuthContext";
import api from "../services/api";
import RideCard from "../components/RideCard";
import SkeletonCard from "../components/SkeletonCard";
import Navbar from "../components/Navbar";
import FiltersModal from "../components/FiltersModal";
import UserProfileModal from "../components/UserProfileModal";
import RideDetailModal from "../components/RideDetailModal";
import { Search, SlidersHorizontal, Plus, MapPin, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AllRides = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [isRideDetailModalOpen, setIsRideDetailModalOpen] = useState(false);
  
  const [filters, setFilters] = useState({
    destination: "",
    date: "",
    transportMode: "",
  });

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchRides = async (signal) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.destination) params.append("destination", filters.destination);
      if (filters.date) params.append("date", filters.date);
      if (filters.transportMode) params.append("transportMode", filters.transportMode);

      const { data } = await api.get(`/rides?${params.toString()}`, { signal });
      if (isMounted.current) setRides(data);
    } catch (error) {
      if (!error.isCancelled) {
        console.error("Error fetching rides:", error);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchRides(controller.signal);
    return () => {
      controller.abort();
    };
  }, [filters]);

  const handleJoin = async (rideId) => {
    // 1. Store previous state for rollback
    const previousRides = [...rides];
    
    // 2. Optimistically update local state
    setRides(prevRides => prevRides.map(ride => {
      if (ride._id === rideId) {
        return {
          ...ride,
          participants: [...ride.participants, user],
          status: ride.participants.length + 1 >= ride.totalSeats ? "FULL" : "OPEN"
        };
      }
      return ride;
    }));

    try {
      const { data: updatedRide } = await api.post(`/rides/${rideId}/join`);
      if (isMounted.current) {
        setRides(prev => prev.map(r => r._id === rideId ? updatedRide : r));
        if (selectedRide?._id === rideId) setSelectedRide(updatedRide);
      }
    } catch (error) {
      if (isMounted.current && !error.isCancelled) {
        setRides(previousRides);
        alert(error.friendlyMessage || "Failed to join ride");
      }
    }
  };

  const handleLeave = async (rideId) => {
    const previousRides = [...rides];
    
    setRides(prevRides => prevRides.map(ride => {
      if (ride._id === rideId) {
        return {
          ...ride,
          participants: ride.participants.filter(p => p._id !== user._id),
          status: "OPEN"
        };
      }
      return ride;
    }));

    try {
      const { data: updatedRide } = await api.post(`/rides/${rideId}/leave`);
      if (isMounted.current) {
        setRides(prev => prev.map(r => r._id === rideId ? updatedRide : r));
        if (selectedRide?._id === rideId) setSelectedRide(updatedRide);
      }
    } catch (error) {
      if (isMounted.current && !error.isCancelled) {
        setRides(previousRides);
        alert(error.friendlyMessage || "Failed to leave ride");
      }
    }
  };

  const handleCancel = async (rideId) => {
    if (!window.confirm("Are you sure you want to cancel this ride?")) return;
    const previousRides = [...rides];
    
    setRides(prevRides => prevRides.map(ride => 
      ride._id === rideId ? { ...ride, status: "CANCELLED" } : ride
    ));

    try {
      await api.patch(`/rides/${rideId}/cancel`);
      if (isMounted.current) {
        setIsRideDetailModalOpen(false);
        fetchRides(); // Full refresh for cancellation as it's a destructive action
      }
    } catch (error) {
      if (isMounted.current && !error.isCancelled) {
        setRides(previousRides);
        alert(error.friendlyMessage || "Failed to cancel ride");
      }
    }
  };

  const openProfile = (userId) => {
    setSelectedUserId(userId);
    setIsProfileModalOpen(true);
  };

  const openRideDetail = (ride) => {
    setSelectedRide(ride);
    setIsRideDetailModalOpen(true);
  };

  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">Available Rides</h1>
            <p className="mt-2 text-slate-400">Discover rides from your campus travel mates.</p>
          </div>
          <button
            onClick={() => navigate("/create-ride")}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-95 md:w-auto"
          >
            <Plus className="h-5 w-5" />
            Create Ride
          </button>
        </div>

        {/* Improved Search & Filter Bar */}
        <div className="sticky top-24 z-40 mb-12 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
            <input
              type="text"
              placeholder="Search by destination..."
              className="w-full rounded-2xl border border-white/10 bg-slate-900/50 py-4 pl-12 pr-4 text-sm text-white backdrop-blur-xl outline-none transition-all focus:border-indigo-500/50 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500/50"
              value={filters.destination}
              onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
            />
          </div>
          
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className={`flex items-center justify-center gap-2 rounded-2xl border px-6 py-4 text-sm font-semibold transition-all backdrop-blur-xl active:scale-95 ${
              activeFiltersCount > 0 
                ? "border-indigo-500 bg-indigo-500/10 text-white" 
                : "border-white/10 bg-slate-900/50 text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[10px] text-white">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Applied Filters Tags (Only if any filter active) */}
        {activeFiltersCount > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => value && (
              <div key={key} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-300">
                <span className="capitalize text-slate-500">{key}:</span>
                <span>{key === 'date' ? new Date(value).toLocaleDateString() : value}</span>
                <button 
                  onClick={() => setFilters({ ...filters, [key]: "" })}
                  className="ml-1 hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button 
              onClick={() => setFilters({ destination: "", date: "", transportMode: "" })}
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Rides Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : rides.length > 0 ? (
            rides.map((ride) => (
              <RideCard
                key={ride._id}
                ride={ride}
                currentUserId={user?._id}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onOpenProfile={openProfile}
                onOpenDetail={openRideDetail}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 text-center rounded-3xl border border-dashed border-white/10 bg-white/[0.02]">
              <div className="mb-6 rounded-full bg-slate-900 p-8 shadow-inner">
                <Search className="h-12 w-12 text-slate-700" />
              </div>
              <h3 className="text-2xl font-bold text-white">No matches found</h3>
              <p className="mt-2 text-slate-400 max-w-sm mx-auto">Try adjusting your filters or search terms to find available rides.</p>
              <button 
                onClick={() => setFilters({ destination: "", date: "", transportMode: "" })}
                className="mt-8 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
              >
                Reset all filters
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <FiltersModal 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)}
        filters={filters}
        setFilters={setFilters}
        onClear={() => setFilters({ destination: "", date: "", transportMode: "" })}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userId={selectedUserId}
      />

      <RideDetailModal
        isOpen={isRideDetailModalOpen}
        onClose={() => setIsRideDetailModalOpen(false)}
        ride={selectedRide}
        currentUserId={user?._id}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onCancel={handleCancel}
        onOpenProfile={openProfile}
      />
    </div>
  );
};

export default AllRides;
