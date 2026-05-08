import React, { useState, useEffect } from "react";
import api from "../services/api";
import { X, User, BookOpen, GraduationCap, Hash, Mail, Loader2, Sparkles, AlertTriangle, CheckCircle2, Shield } from "lucide-react";
import ReportModal from "./ReportModal";
import { AuthContext } from "../contexts/AuthContext";

const UserProfileModal = ({ userId, isOpen, onClose }) => {
  const { user: currentUser } = React.useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile();
    }
  }, [isOpen, userId]);

  const fetchProfile = async () => {
    setProfile(null);
    setLoading(true);
    try {
      const { data } = await api.get(`/users/${userId}`);
      setProfile(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGmailCompose = () => {
    const subject = encodeURIComponent(`RideMate: Connecting with you regarding a ride`);
    const body = encodeURIComponent(`Hi ${profile.name},\n\nI saw your profile on RideMate and wanted to connect regarding a potential ride coordination.\n\nPlease let me know your availability and preferred contact method!\n\nBest regards.`);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${profile.email}&su=${subject}&body=${body}`;
    window.open(gmailUrl, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-md"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-slate-900 shadow-2xl animate-in fade-in zoom-in duration-300">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          </div>
        ) : profile ? (
          <div className="relative">
            {/* Header / Background Pattern */}
            <div className="h-32 bg-gradient-to-br from-indigo-600 to-purple-600">
              <div className="absolute top-4 right-4">
                <button 
                  onClick={onClose}
                  className="rounded-full bg-black/20 p-2 text-white hover:bg-black/40 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-8 pt-0">
              <div className="relative -mt-12 mb-6 flex justify-center">
                <div className="relative">
                  <img
                    src={profile.profilePicture || `https://ui-avatars.com/api/?name=${profile.name}&background=6366f1&color=fff`}
                    alt={profile.name}
                    className="h-24 w-24 rounded-full border-4 border-slate-900 shadow-xl object-cover"
                  />
                  <div className="absolute -right-2 -bottom-2 rounded-full bg-indigo-500 p-1.5 border-4 border-slate-900 shadow-lg" title="Verified Student">
                    <CheckCircle2 className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-2">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{profile.name}</h2>
                  <Shield className="h-4 w-4 text-indigo-400" />
                </div>
                <p className="text-slate-400 text-sm mt-1">{profile.email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-bold text-indigo-400 uppercase tracking-widest border border-indigo-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified Student
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Department</span>
                    <p className="text-sm font-medium text-slate-200">{profile.department || "Not Specified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Study Year</span>
                    <p className="text-sm font-medium text-slate-200">{profile.studyYear ? `${profile.studyYear} Year` : "Not Specified"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                    <Hash className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">USN</span>
                    <p className="text-sm font-medium text-slate-200 uppercase">{profile.usn || "Not Specified"}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGmailCompose}
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-indigo-600 py-4 text-sm font-bold text-white transition-all hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95"
              >
                <Mail className="h-4 w-4" />
                Contact via Gmail
              </button>

              {currentUser?._id !== userId && (
                <button
                  onClick={() => setIsReportModalOpen(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 text-xs font-semibold text-slate-500 hover:text-red-400 transition-colors"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Report User
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-400">
            Failed to load profile.
          </div>
        )}
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        reportedUserId={userId}
        reportedUserName={profile?.name}
      />
    </div>
  );
};

export default UserProfileModal;
