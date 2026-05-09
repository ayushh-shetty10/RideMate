import React from "react";
import { X, Calendar, Clock, Car, MapPin, SlidersHorizontal } from "lucide-react";

const FiltersModal = ({ isOpen, onClose, filters, setFilters, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">Filter Rides</h2>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Destination */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Where to?"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10"
                value={filters.destination}
                onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Date & Time</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
              <input
                type="datetime-local"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-4 text-sm text-white outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10 [color-scheme:dark]"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
              />
            </div>
          </div>

          {/* Transport Mode */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Transport Mode</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setFilters({ ...filters, transportMode: "AUTO" })}
                className={`flex items-center justify-center gap-2 rounded-2xl border py-4 text-sm font-medium transition-all ${
                  filters.transportMode === "AUTO" 
                    ? "border-indigo-500 bg-indigo-500/10 text-white" 
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Car className="h-4 w-4" />
                Auto
              </button>
              <button
                onClick={() => setFilters({ ...filters, transportMode: "CAB" })}
                className={`flex items-center justify-center gap-2 rounded-2xl border py-4 text-sm font-medium transition-all ${
                  filters.transportMode === "CAB" 
                    ? "border-indigo-500 bg-indigo-500/10 text-white" 
                    : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                <Car className="h-4 w-4" />
                Cab
              </button>
            </div>
          {/* Ride Status */}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ride Status</label>
            <div className="flex flex-wrap gap-3">
              {["OPEN", "COMPLETED", "CANCELLED"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilters({ ...filters, status })}
                  className={`flex-1 rounded-2xl border py-4 text-[10px] font-bold uppercase tracking-wider transition-all ${
                    filters.status === status
                      ? "border-indigo-500 bg-indigo-500/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-400 hover:bg-white/10"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4 p-6 pt-0">
          <button
            onClick={onClear}
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-sm font-bold text-slate-400 transition-all hover:bg-white/10 hover:text-white"
          >
            Clear All
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
