import React from "react";
import { 
  X, MapPin, Calendar, Clock, Car, Users, 
  Mail, ExternalLink, ChevronRight, 
  AlertCircle, Trash2, Crown, CheckCircle2,
  AlertTriangle
} from "lucide-react";
import ReportModal from "./ReportModal";

const RideDetailModal = ({ 
  ride, 
  isOpen, 
  onClose, 
  currentUserId, 
  onJoin, 
  onLeave, 
  onCancel,
  onOpenProfile 
}) => {
  const [reportData, setReportData] = React.useState({ isOpen: false, reportedUserId: null, reportedUserName: "" });

  if (!isOpen || !ride) return null;

  const isCreator = ride.creator._id === currentUserId;
  const isParticipant = ride.participants.some(p => p._id === currentUserId);
  const isCancelled = ride.status === "CANCELLED";
  const seatsLeft = ride.totalSeats - ride.participants.length;
  const isFull = ride.status === "FULL" || seatsLeft <= 0;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleContactUser = (targetUser) => {
    const isHost = targetUser._id === ride.creator._id;
    const subject = encodeURIComponent(isHost 
      ? `RideMate Coordination: Ride to ${ride.destination}` 
      : `RideMate: Travel Mate Connection for ${ride.destination} trip`
    );
    const body = encodeURIComponent(isHost
      ? `Hi ${targetUser.name},\n\nI'm reaching out through RideMate regarding the ride from ${ride.from} to ${ride.destination} on ${formatDate(ride.dateTime)} at ${formatTime(ride.dateTime)}.\n\nI'd like to coordinate the meetup and travel details. Please let me know your preferred contact method or if you have any specific instructions!\n\nBest regards.`
      : `Hi ${targetUser.name},\n\nI'm your travel mate for the ride to ${ride.destination} on ${formatDate(ride.dateTime)}. I'm reaching out so we can coordinate our meetup.\n\nLooking forward to the journey!`
    );
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetUser.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto p-4 sm:p-6 custom-scrollbar">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative my-auto w-full max-w-2xl rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-6 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Car className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Ride Details</h2>
              <div className={`mt-0.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                isCancelled ? "text-red-400" : isFull ? "text-amber-400" : "text-emerald-400"
              }`}>
                {isCancelled ? "Cancelled" : isFull ? "Ride Full" : "Open for Booking"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setReportData({ isOpen: true, reportedUserId: ride.creator._id, reportedUserName: ride.creator.name })}
              className="rounded-full bg-red-500/10 p-2 text-red-400 hover:bg-red-500 hover:text-white transition-all"
              title="Report Ride"
            >
              <AlertTriangle className="h-5 w-5" />
            </button>
            <button 
              onClick={onClose}
              className="rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {/* Route Visualization */}
          <div className={`relative mb-10 rounded-[24px] p-8 border ${
            isCancelled ? "bg-red-500/5 border-red-500/10" : "bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/10"
          }`}>
            <div className="flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
              
              {/* From */}
              <div className="relative z-10 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">Departure</span>
                <h3 className="mt-1 text-lg font-bold text-white leading-tight">{ride.from}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(ride.dateTime)}
                </div>
              </div>

              {/* Path Decoration */}
              <div className="relative flex flex-col items-center justify-center sm:h-20 sm:w-24">
                <div className="hidden sm:block absolute w-full h-[2px] bg-slate-800"></div>
                <div className={`hidden sm:block absolute w-full h-[2px] border-t-2 border-dashed ${isCancelled ? "border-slate-700" : "border-indigo-500/30 animate-pulse"}`}></div>
                <div className="sm:hidden absolute h-12 w-[2px] bg-slate-800"></div>
                
                <div className={`relative z-10 rounded-full bg-slate-900 p-2 border border-white/10 shadow-lg ${isCancelled ? "text-slate-600" : "text-indigo-400"}`}>
                  <Car className="h-5 w-5" />
                </div>
              </div>

              {/* Destination */}
              <div className="relative z-10 flex-1 sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-purple-400">Destination</span>
                <h3 className="mt-1 text-lg font-bold text-white leading-tight">{ride.destination}</h3>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400 sm:justify-end">
                  <Clock className="h-3.5 w-3.5" />
                  {formatTime(ride.dateTime)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                <Car className="mb-2 h-5 w-5 text-blue-400" />
                <span className="text-[10px] uppercase font-bold text-slate-500">Transport</span>
                <p className="font-semibold text-white">{ride.transportMode}</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 border border-white/5">
                <Users className={`mb-2 h-5 w-5 ${isFull ? "text-amber-400" : "text-pink-400"}`} />
                <span className="text-[10px] uppercase font-bold text-slate-500">Available</span>
                <p className={`font-semibold ${isFull ? "text-amber-400" : "text-white"}`}>{isFull ? "Full" : `${seatsLeft} Seats`}</p>
              </div>
            </div>

            {/* Member List with Host Indication */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                Members Joined
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">
                  {ride.participants.length}/{ride.totalSeats}
                </span>
              </h4>
              <div className="space-y-2">
                {ride.participants.map((participant) => {
                  const isHost = participant._id === ride.creator._id;
                  const isMe = participant._id === currentUserId;
                  return (
                    <div 
                      key={participant._id}
                      className={`flex items-center gap-3 rounded-xl p-3 border transition-all ${
                        isHost 
                          ? "bg-indigo-500/10 border-indigo-500/20" 
                          : "bg-white/5 border-white/5"
                      }`}
                    >
                      <button 
                        onClick={() => onOpenProfile(participant._id)}
                        className="flex-shrink-0"
                      >
                        <img
                          src={participant.profilePicture || `https://ui-avatars.com/api/?name=${participant.name}&background=6366f1&color=fff`}
                          alt={participant.name}
                          className={`h-8 w-8 rounded-full ${isHost ? "border-2 border-indigo-500/50" : ""}`}
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-xs font-semibold text-white">{participant.name} {isMe && "(You)"}</p>
                          {isHost && (
                            <span className="flex items-center gap-1 rounded-full bg-indigo-500 px-2 py-0.5 text-[8px] font-bold text-white uppercase tracking-tighter">
                              <Crown className="h-2 w-2" />
                              Host
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-500">{participant.department || "Student"}</p>
                      </div>
                      {!isMe && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleContactUser(participant)}
                            className="rounded-lg bg-white/5 p-2 text-slate-400 hover:bg-indigo-500/20 hover:text-indigo-400 transition-all"
                            title="Contact via Gmail"
                          >
                            <Mail className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setReportData({ isOpen: true, reportedUserId: participant._id, reportedUserName: participant.name })}
                            className="rounded-lg bg-white/5 p-2 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all"
                            title="Report User"
                          >
                            <AlertTriangle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Cancelled Alert */}
          {isCancelled && (
            <div className="mt-8 flex items-center gap-3 rounded-2xl bg-red-500/10 p-4 border border-red-500/20 text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm font-medium">This ride has been cancelled by the host.</p>
            </div>
          )}

          {/* Actions */}
          <div className="mt-10 flex flex-col gap-4">
            {!isCancelled ? (
              <>
                {isCreator ? (
                  <button
                    onClick={() => onCancel(ride._id)}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 py-4 text-sm font-bold text-red-400 transition-all hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                    Cancel Ride
                  </button>
                ) : (
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {isParticipant && (
                      <button
                        onClick={() => handleContactUser(ride.creator)}
                        className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                      >
                        <Mail className="h-4 w-4" />
                        Contact Host
                      </button>
                    )}
                    {isParticipant ? (
                      <button
                        onClick={() => onLeave(ride._id)}
                        className="flex-1 rounded-2xl bg-white/5 py-4 text-sm font-bold text-slate-400 transition-all hover:bg-red-500/10 hover:text-red-400"
                      >
                        Leave Ride
                      </button>
                    ) : (
                      <button
                        onClick={() => onJoin(ride._id)}
                        disabled={ride.status !== "OPEN" || isFull}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 py-4.5 text-sm font-bold text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:grayscale shadow-xl shadow-indigo-600/20"
                      >
                        {isFull ? "Ride is Full" : "Join This Ride"}
                        {!isFull && <ChevronRight className="h-5 w-5" />}
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <button
                disabled
                className="w-full rounded-2xl bg-slate-800 py-4 text-sm font-bold text-slate-500 cursor-not-allowed"
              >
                Ride Cancelled
              </button>
            )}
          </div>

      <ReportModal
        isOpen={reportData.isOpen}
        onClose={() => setReportData({ ...reportData, isOpen: false })}
        reportedUserId={reportData.reportedUserId}
        reportedUserName={reportData.reportedUserName}
        rideId={ride._id}
      />
    </div>
  </div>  
  </div>
  );
};

export default RideDetailModal;
