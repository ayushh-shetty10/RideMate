import React, { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { 
  Users, Car, AlertTriangle, Shield, CheckCircle, 
  XCircle, Filter, Search, Loader2, MoreVertical,
  Trash2, Ban, Unlock, Clock, MapPin, Eye
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStats();
    if (activeTab === "reports") fetchReports();
    if (activeTab === "users") fetchUsers();
    if (activeTab === "rides") fetchRides();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      if (activeTab === "stats") setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reports");
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/admin/users");
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRides = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/rides"); // Admin can see all OPEN rides, maybe need a specific admin/rides endpoint
      setRides(data);
    } catch (error) {
      console.error("Error fetching rides:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId) => {
    if (!window.confirm("Are you sure you want to change this user's access status?")) return;
    try {
      await api.patch(`/admin/users/${userId}/toggle-block`);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user status");
    }
  };

  const handleDeleteRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to delete this ride permanently?")) return;
    try {
      await api.delete(`/admin/rides/${rideId}`);
      fetchRides();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete ride");
    }
  };

  const handleUpdateReportStatus = async (reportId, status) => {
    try {
      await api.patch(`/reports/${reportId}/status`, { status, comment: "Resolved by Admin" });
      fetchReports();
    } catch (error) {
      alert("Failed to update report status");
    }
  };

  const renderStats = () => (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <StatCard icon={<Users className="h-6 w-6 text-blue-400" />} label="Total Users" value={stats?.totalUsers} color="blue" />
      <StatCard icon={<Car className="h-6 w-6 text-indigo-400" />} label="Total Rides" value={stats?.totalRides} color="indigo" />
      <StatCard icon={<CheckCircle className="h-6 w-6 text-emerald-400" />} label="Active Rides" value={stats?.activeRides} color="emerald" />
      <StatCard icon={<XCircle className="h-6 w-6 text-rose-400" />} label="Cancelled" value={stats?.cancelledRides} color="rose" />
      <StatCard icon={<AlertTriangle className="h-6 w-6 text-amber-400" />} label="Pending Reports" value={stats?.pendingReports} color="amber" />
    </div>
  );

  const renderReports = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-[32px] border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">Reporter</th>
                <th className="px-6 py-4 font-bold">Reported User</th>
                <th className="px-6 py-4 font-bold">Reason</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={report.reporter.profilePicture} alt="" className="h-8 w-8 rounded-full border border-white/10" />
                      <div>
                        <p className="font-semibold text-white">{report.reporter.name}</p>
                        <p className="text-[10px] text-slate-500">{report.reporter.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={report.reportedUser.profilePicture} alt="" className="h-8 w-8 rounded-full border border-white/10" />
                      <div>
                        <p className="font-semibold text-white">{report.reportedUser.name}</p>
                        <p className="text-[10px] text-slate-500">{report.reportedUser.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold text-red-400 uppercase tracking-tighter">
                      {report.reason}
                    </span>
                    {report.description && <p className="mt-1 text-[10px] text-slate-400 line-clamp-1">{report.description}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {report.status === "PENDING" && (
                        <>
                          <button 
                            onClick={() => handleUpdateReportStatus(report._id, "RESOLVED")}
                            className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                            title="Resolve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleUpdateReportStatus(report._id, "DISMISSED")}
                            className="rounded-lg bg-slate-500/10 p-2 text-slate-400 hover:bg-slate-500 hover:text-white transition-all"
                            title="Dismiss"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {reports.map((report) => (
          <div key={report._id} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Reporter:</span>
                  <span className="text-xs font-bold text-white">{report.reporter.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Target:</span>
                  <span className="text-xs font-bold text-white">{report.reportedUser.name}</span>
                </div>
              </div>
              <StatusBadge status={report.status} />
            </div>
            <div className="mb-4">
              <span className="inline-block rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold text-red-400 uppercase tracking-tighter mb-2">
                {report.reason}
              </span>
              {report.description && <p className="text-xs text-slate-400 leading-relaxed">{report.description}</p>}
            </div>
            {report.status === "PENDING" && (
              <div className="flex gap-2 pt-4 border-t border-white/5">
                <button 
                  onClick={() => handleUpdateReportStatus(report._id, "RESOLVED")}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-2.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all"
                >
                  <CheckCircle className="h-4 w-4" />
                  Resolve
                </button>
                <button 
                  onClick={() => handleUpdateReportStatus(report._id, "DISMISSED")}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-slate-500/10 py-2.5 text-xs font-bold text-slate-400 hover:bg-slate-500 hover:text-white transition-all"
                >
                  <XCircle className="h-4 w-4" />
                  Dismiss
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {reports.length === 0 && <EmptyState label="No reports found" />}
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-[32px] border border-white/10 bg-white/5 overflow-hidden backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-500">
              <tr>
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Details</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.profilePicture} alt="" className="h-10 w-10 rounded-full border border-white/10" />
                      <div>
                        <p className="font-bold text-white">{user.name}</p>
                        <p className="text-[10px] text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-slate-300">{user.department} • {user.studyYear} Year</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">{user.usn}</p>
                  </td>
                  <td className="px-6 py-4">
                    {user.isBlocked ? (
                      <span className="rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-bold text-red-400 uppercase tracking-tighter flex items-center gap-1.5 w-fit">
                        <Ban className="h-3 w-3" />
                        Blocked
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-tighter flex items-center gap-1.5 w-fit">
                        <CheckCircle className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleToggleBlock(user._id)}
                      disabled={user.role === "ADMIN"}
                      className={`rounded-xl px-4 py-2 text-xs font-bold transition-all active:scale-95 disabled:opacity-30 ${
                        user.isBlocked 
                          ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white" 
                          : "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      {user.isBlocked ? "Unblock" : "Block User"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {users.map((user) => (
          <div key={user._id} className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-4">
              <img src={user.profilePicture} alt="" className="h-12 w-12 rounded-full border border-white/10" />
              <div className="flex-1">
                <p className="font-bold text-white">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.usn}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {user.isBlocked ? (
                  <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[8px] font-bold text-red-400 uppercase">Blocked</span>
                ) : (
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[8px] font-bold text-emerald-400 uppercase">Active</span>
                )}
              </div>
            </div>
            <div className="mb-4 text-xs text-slate-400 flex justify-between">
              <span>{user.department}</span>
              <span>Year {user.studyYear}</span>
            </div>
            <button 
              onClick={() => handleToggleBlock(user._id)}
              disabled={user.role === "ADMIN"}
              className={`w-full rounded-xl py-3 text-xs font-bold transition-all disabled:opacity-30 ${
                user.isBlocked 
                  ? "bg-emerald-500/10 text-emerald-400" 
                  : "bg-red-500/10 text-red-400"
              }`}
            >
              {user.isBlocked ? "Unblock User" : "Block User"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRides = () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {rides.map((ride) => (
        <div key={ride._id} className="relative group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <img src={ride.creator.profilePicture} alt="" className="h-8 w-8 rounded-full" />
              <span className="text-xs font-bold text-white">{ride.creator.name}</span>
            </div>
            <button 
              onClick={() => handleDeleteRide(ride._id)}
              className="rounded-lg bg-red-500/10 p-2 text-red-400 lg:opacity-0 lg:group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
              <p className="text-sm text-slate-200 line-clamp-1">{ride.from}</p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-3 w-3 text-purple-500" />
              <p className="text-sm text-white font-semibold line-clamp-1">{ride.destination}</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
              {new Date(ride.dateTime).toLocaleDateString()}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
              ride.status === "CANCELLED" ? "bg-red-500/10 text-red-400" : "bg-indigo-500/10 text-indigo-400"
            }`}>
              {ride.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="rounded-lg bg-indigo-500/10 p-1.5 text-indigo-400">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">Admin Control Panel</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl lg:text-4xl">Platform Moderation</h1>
          </div>
          
          {/* Tabs - Scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide lg:pb-0">
            <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-1.5 border border-white/5 whitespace-nowrap">
              <TabButton active={activeTab === "stats"} onClick={() => setActiveTab("stats")} icon={<Clock className="h-4 w-4" />} label="Overview" />
              <TabButton active={activeTab === "reports"} onClick={() => setActiveTab("reports")} icon={<AlertTriangle className="h-4 w-4" />} label="Reports" count={stats?.pendingReports} />
              <TabButton active={activeTab === "users"} onClick={() => setActiveTab("users")} icon={<Users className="h-4 w-4" />} label="Users" />
              <TabButton active={activeTab === "rides"} onClick={() => setActiveTab("rides")} icon={<Car className="h-4 w-4" />} label="Rides" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="min-h-[500px]">
            {activeTab === "stats" && renderStats()}
            {activeTab === "reports" && renderReports()}
            {activeTab === "users" && renderUsers()}
            {activeTab === "rides" && renderRides()}
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }) => (
  <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 group">
    <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-${color}-500/10 group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-4xl font-black text-white tracking-tight">{value ?? 0}</p>
  </div>
);

const TabButton = ({ active, onClick, icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
    }`}
  >
    {icon}
    <span>{label}</span>
    {count > 0 && (
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
        {count}
      </span>
    )}
  </button>
);

const StatusBadge = ({ status }) => {
  const colors = {
    PENDING: "bg-amber-500/10 text-amber-400",
    UNDER_REVIEW: "bg-blue-500/10 text-blue-400",
    RESOLVED: "bg-emerald-500/10 text-emerald-400",
    DISMISSED: "bg-slate-500/10 text-slate-400",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter ${colors[status]}`}>
      {status.replace("_", " ")}
    </span>
  );
};

const EmptyState = ({ label }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-500">
    <Search className="h-10 w-10 mb-4 opacity-20" />
    <p className="font-medium">{label}</p>
  </div>
);

export default AdminDashboard;
