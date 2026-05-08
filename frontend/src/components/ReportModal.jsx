import React, { useState } from "react";
import { X, AlertTriangle, Send, Loader2, Info } from "lucide-react";
import api from "../services/api";

const ReportModal = ({ isOpen, onClose, reportedUserId, rideId, reportedUserName }) => {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reportReasons = [
    { value: "SPAM", label: "Spam" },
    { value: "FAKE_RIDE", label: "Fake Ride" },
    { value: "MISCONDUCT", label: "Misconduct" },
    { value: "HARASSMENT", label: "Harassment" },
    { value: "UNSAFE_BEHAVIOR", label: "Unsafe Behavior" },
    { value: "OTHER", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) return;

    setLoading(true);
    try {
      await api.post("/reports", {
        reportedUser: reportedUserId,
        ride: rideId,
        reason,
        description,
      });
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setReason("");
        setDescription("");
      }, 2000);
    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Report Content</h2>
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Help us keep RideMate safe</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <Send className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Report Submitted</h3>
              <p className="mt-2 text-slate-400">Thank you for your feedback. Our team will review this shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl bg-indigo-500/5 p-4 border border-indigo-500/10 flex gap-3 mb-6">
                <Info className="h-5 w-5 text-indigo-400 flex-shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  Reporting <strong>{reportedUserName}</strong>. Your identity will remain anonymous during the review process.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Reason for reporting</label>
                <div className="grid grid-cols-2 gap-2">
                  {reportReasons.map((r) => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setReason(r.value)}
                      className={`rounded-xl border p-3 text-left text-xs font-medium transition-all ${
                        reason === r.value 
                          ? "border-indigo-500 bg-indigo-500/10 text-white" 
                          : "border-white/5 bg-white/5 text-slate-400 hover:bg-white/10"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Description (Optional)</label>
                <textarea
                  className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder-slate-600 outline-none transition-all focus:border-indigo-500/50 focus:bg-white/10 min-h-[120px] resize-none"
                  placeholder="Provide more details about the issue..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 rounded-2xl bg-white/5 py-4 text-sm font-bold text-slate-400 transition-all hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !reason}
                  className="flex-[2] flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 py-4 text-sm font-bold text-white shadow-xl shadow-red-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <AlertTriangle className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
