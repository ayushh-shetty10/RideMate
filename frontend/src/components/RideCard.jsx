import React from "react";
import { MapPin, Calendar, Clock, Users, Car, ChevronRight, Mail, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";

const RideCard = ({ ride, onJoin, onLeave, currentUserId, onOpenProfile, onOpenDetail }) => {
  const isCreator = ride.creator._id === currentUserId;
  const isParticipant = ride.participants.some(p => p._id === currentUserId);
  const seatsLeft = ride.totalSeats - ride.participants.length;
  const isCancelled = ride.status === "CANCELLED";
  const isFull = ride.status === "FULL" || seatsLeft <= 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleContactHost = (e) => {
    e.stopPropagation();
    const subject = encodeURIComponent(`RideMate: Travel Coordination to ${ride.destination}`);
    const body = encodeURIComponent(`Hi ${ride.creator.name},\n\nI'm reaching out through RideMate regarding the ride from ${ride.from} to ${ride.destination} on ${formatDate(ride.dateTime)}.\n\nI'd like to coordinate the travel details. Please let me know your preferred contact method or if you have any updates!\n\nBest regards.`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${ride.creator.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <div 
      onClick={() => onOpenDetail(ride)}
      className={`group relative overflow-hidden rounded-[32px] border p-5 backdrop-blur-xl transition-all duration-300 cursor-pointer sm:p-6 ${
        isCancelled 
          ? "border-red-500/20 bg-red-500/5 opacity-80" 
          : isFull && !isParticipant && !isCreator
          ? "border-white/5 bg-white/[0.02] grayscale-[0.5]"
          : "border-white/10 bg-white/5 hover:border-indigo-500/30 hover:bg-white/10"
      }`}
    >
      {/* Overlay Patterns */}
      {isCancelled && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]"></div>
      )}

      {/* Top Section: Creator Info */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onOpenProfile(ride.creator._id);
          }}
          className="flex items-center gap-3 transition-transform active:scale-95 text-left"
        >
          <img
            src={ride.creator.profilePicture || `https://ui-avatars.com/api/?name=${ride.creator.name}&background=6366f1&color=fff`}
            alt={ride.creator.name}
            className={`h-10 w-10 rounded-full border border-white/20 object-cover ${isCancelled ? "grayscale" : ""}`}
          />
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              {ride.creator.name}
              <ExternalLink className="h-3 w-3 text-slate-500" />
            </h3>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">Host • {formatDate(ride.createdAt)}</span>
          </div>
        </button>
        <div className={`rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${
          isCancelled ? "bg-red-500/10 text-red-400" :
          isFull ? "bg-amber-500/10 text-amber-400" : 
          "bg-emerald-500/10 text-emerald-400"
        }`}>
          {isCancelled ? <AlertCircle className="h-3 w-3" /> : isFull ? <Users className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
          {ride.status}
        </div>
      </div>

      {/* Main Section: Route Info */}
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-1 flex flex-col items-center">
            <div className={`h-2 w-2 rounded-full ${isCancelled ? "bg-slate-600" : isFull ? "bg-amber-500" : "bg-indigo-500"}`}></div>
            <div className="h-10 w-0.5 border-l border-dashed border-slate-600"></div>
            <MapPin className={`h-3 w-3 ${isCancelled ? "text-slate-600" : isFull ? "text-amber-500" : "text-purple-500"}`} />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">From</span>
              <p className={`text-sm font-medium line-clamp-1 ${isCancelled ? "text-slate-500" : "text-slate-200"}`}>{ride.from}</p>
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-slate-500">Destination</span>
              <p className={`text-sm font-medium line-clamp-1 ${isCancelled ? "text-slate-500" : "text-white"}`}>{ride.destination}</p>
            </div>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-3 rounded-2xl p-4 sm:gap-4 ${isCancelled ? "bg-slate-900/30" : "bg-slate-900/50"}`}>
          <div className="flex items-center gap-2">
            <Calendar className={`h-4 w-4 ${isCancelled ? "text-slate-600" : "text-indigo-400"}`} />
            <span className="text-xs text-slate-300">{formatDate(ride.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className={`h-4 w-4 ${isCancelled ? "text-slate-600" : "text-purple-400"}`} />
            <span className="text-xs text-slate-300">{formatTime(ride.dateTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car className={`h-4 w-4 ${isCancelled ? "text-slate-600" : "text-blue-400"}`} />
            <span className="text-xs text-slate-300">{ride.transportMode}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className={`h-4 w-4 ${isCancelled ? "text-slate-600" : isFull ? "text-amber-400" : "text-pink-400"}`} />
            <span className={`text-xs ${isFull && !isCancelled ? "text-amber-400 font-bold" : "text-slate-300"}`}>
              {isFull ? "No Seats Left" : `${seatsLeft} Seats Left`}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Actions */}
      <div className="mt-6">
        {isCancelled ? (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-xs font-bold text-red-400">
            <AlertCircle className="h-4 w-4" />
            RIDE CANCELLED
          </div>
        ) : isCreator ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(ride);
            }}
            className="w-full rounded-xl bg-indigo-500/10 py-3 text-xs font-bold text-indigo-400 transition-all hover:bg-indigo-500 hover:text-white"
          >
            MANAGE RIDE
          </button>
        ) : isParticipant ? (
          <div className="flex gap-3">
            <button
              onClick={handleContactHost}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 active:scale-95"
            >
              <Mail className="h-4 w-4 text-indigo-400" />
              Contact
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onLeave(ride._id);
              }}
              className="flex-1 rounded-xl bg-red-500/10 py-3 text-sm font-semibold text-red-400 transition-all hover:bg-red-500 hover:text-white"
            >
              Leave
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onJoin(ride._id);
            }}
            disabled={ride.status !== "OPEN" || seatsLeft <= 0}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white transition-all hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:hover:shadow-none"
          >
            {isFull ? "Ride Full" : "Join Ride"}
            {!isFull && <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default RideCard;
