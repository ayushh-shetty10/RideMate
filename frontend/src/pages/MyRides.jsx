import React, { useState, useEffect, useContext, useRef } from "react";
import api from "../services/api";
import RideCard from "../components/RideCard";
import SkeletonCard from "../components/SkeletonCard";
import RideDetailModal from "../components/RideDetailModal";
import UserProfileModal from "../components/UserProfileModal";
import Navbar from "../components/Navbar";
import { Loader2, Car, Users, Plus, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const MyRides = () => {
  const { user } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("hosted"); // "hosted" or "joined"
  
  // Modal states
  const [selectedRide, setSelectedRide] = useState(null);
  const [isRideDetailModalOpen, setIsRideDetailModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isUserProfileModalOpen, setIsUserProfileModalOpen] = useState(false);

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchMyRides(controller.signal);
    return () => {
      controller.abort();
    };
  }, []);

  const fetchMyRides = async (signal) => {
    setLoading(true);
    try {
      const { data } = await api.get("/rides/my-rides", { signal });
      if (isMounted.current) setRides(data);
    } catch (error) {
      if (!error.isCancelled) {
        console.error("Error fetching my rides:", error);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const handleJoin = async (rideId) => {
    const previousRides = [...rides];
    setRides(prev => prev.map(ride => {
      if (ride._id === rideId) {
        return { ...ride, participants: [...ride.participants, user], status: ride.participants.length + 1 >= ride.totalSeats ? "FULL" : "OPEN" };
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
    setRides(prev => prev.map(ride => {
      if (ride._id === rideId) {
        return { ...ride, participants: ride.participants.filter(p => p._id !== user._id), status: "OPEN" };
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
    if (!window.confirm("Are you sure you want to cancel this ride? This will notify all participants.")) return;
    const previousRides = [...rides];
    setRides(prev => prev.map(ride => ride._id === rideId ? { ...ride, status: "CANCELLED" } : ride));

    try {
      await api.patch(`/rides/${rideId}/cancel`);
      if (isMounted.current) {
        fetchMyRides();
        setIsRideDetailModalOpen(false);
      }
    } catch (error) {
      if (isMounted.current && !error.isCancelled) {
        setRides(previousRides);
        alert(error.friendlyMessage || "Failed to cancel ride");
      }
    }
  };

  const openRideDetail = (ride) => {
    setSelectedRide(ride);
    setIsRideDetailModalOpen(true);
  };

  const openUserProfile = (userId) => {
    setSelectedUserId(userId);
    setIsUserProfileModalOpen(true);
  };

  const hostedRides = rides.filter(ride => ride.creator?._id === user?._id);
  const joinedRides = rides.filter(ride => ride.creator?._id !== user?._id);

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight sm:text-4xl">My Journeys</h1>
            <p className="mt-2 text-slate-400">Manage the rides you're hosting and participating in.</p>
          </div>
          <Link 
            to="/create-ride"
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Create New Ride
          </Link>
        </div>

        {/* Custom Tabs */}
        <div className="mb-8 flex gap-2 rounded-[24px] bg-white/5 p-2 border border-white/5 max-w-md">
          <button
            onClick={() => setActiveTab("hosted")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[18px] py-3 text-sm font-bold transition-all ${
              activeTab === "hosted" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Car className="h-4 w-4" />
            Hosting ({hostedRides.length})
          </button>
          <button
            onClick={() => setActiveTab("joined")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[18px] py-3 text-sm font-bold transition-all ${
              activeTab === "joined" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <Users className="h-4 w-4" />
            Joined ({joinedRides.length})
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <>
            {(activeTab === "hosted" ? hostedRides : joinedRides).length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {(activeTab === "hosted" ? hostedRides : joinedRides).map((ride) => (
                  <RideCard
                    key={ride._id}
                    ride={ride}
                    onJoin={handleJoin}
                    onLeave={handleLeave}
                    currentUserId={user?._id}
                    onOpenProfile={openUserProfile}
                    onOpenDetail={openRideDetail}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-[40px] border border-white/5 bg-white/[0.02] p-16 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-500/10 text-indigo-400">
                  {activeTab === "hosted" ? <Car className="h-10 w-10" /> : <Users className="h-10 w-10" />}
                </div>
                <h3 className="text-xl font-bold text-white">
                  {activeTab === "hosted" ? "No hosted rides yet" : "No joined rides yet"}
                </h3>
                <p className="mt-2 max-w-xs text-slate-400">
                  {activeTab === "hosted" 
                    ? "Start hosting to help others and save on travel costs!" 
                    : "Browse available rides to find journeys going your way."}
                </p>
                <Link
                  to={activeTab === "hosted" ? "/create-ride" : "/all-rides"}
                  className="mt-8 flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 group"
                >
                  {activeTab === "hosted" ? "Host your first ride" : "Explore available rides"}
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      <RideDetailModal
        ride={selectedRide}
        isOpen={isRideDetailModalOpen}
        onClose={() => setIsRideDetailModalOpen(false)}
        currentUserId={user?._id}
        onJoin={handleJoin}
        onLeave={handleLeave}
        onCancel={handleCancel}
        onOpenProfile={openUserProfile}
      />

      <UserProfileModal
        userId={selectedUserId}
        isOpen={isUserProfileModalOpen}
        onClose={() => setIsUserProfileModalOpen(false)}
      />
    </div>
  );
};

export default MyRides;
