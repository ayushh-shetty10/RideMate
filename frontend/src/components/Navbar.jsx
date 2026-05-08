import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { LogOut, Car, LayoutDashboard, Briefcase, Menu, X, User, Shield } from "lucide-react";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const scrollToHowItWorks = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "how-it-works" } });
    } else {
      document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-[100] border-b border-white/5 bg-slate-950/60 px-4 py-4 backdrop-blur-2xl sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
            <Car className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">RideMate</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-10 lg:flex">
          <Link
            to="/"
            className={`text-sm font-bold tracking-wide transition-colors ${
              isActive("/") ? "text-indigo-400" : "text-slate-400 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link
            to="/all-rides"
            className={`text-sm font-bold tracking-wide transition-colors ${
              isActive("/all-rides") ? "text-indigo-400" : "text-slate-400 hover:text-white"
            }`}
          >
            All Rides
          </Link>
          <Link
            to="/my-rides"
            className={`text-sm font-bold tracking-wide transition-colors ${
              isActive("/my-rides") ? "text-indigo-400" : "text-slate-400 hover:text-white"
            }`}
          >
            My Rides
          </Link>
          <a
            href="#how-it-works"
            onClick={scrollToHowItWorks}
            className="text-sm font-bold tracking-wide text-slate-400 hover:text-white transition-colors"
          >
            How It Works
          </a>
          {user?.role === "ADMIN" && (
            <Link
              to="/admin"
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${
                isActive("/admin") 
                  ? "border-indigo-500 bg-indigo-500/10 text-indigo-400" 
                  : "border-white/10 text-slate-500 hover:border-white/20 hover:text-white"
              }`}
            >
              <Shield className="h-3 w-3" />
              Admin
            </Link>
          )}
        </div>

        {/* Desktop Auth Section */}
        <div className="hidden items-center gap-6 lg:flex">
          {user ? (
            <>
              <div className="flex items-center gap-3 border-l border-white/10 pl-6">
                <div className="text-right">
                  <p className="text-xs font-bold text-white leading-none">{user.name}</p>
                  <p className="mt-1 text-[10px] font-medium text-slate-500 uppercase tracking-wider">{user.studyYear} Year • {user.department}</p>
                </div>
                <img
                  src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                  alt="Profile"
                  className="h-10 w-10 rounded-full border border-white/10"
                />
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-white/5 p-2.5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
            >
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-xl bg-white/5 p-2.5 text-slate-400 hover:text-white transition-all"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full w-full border-b border-white/5 bg-slate-950/95 p-6 backdrop-blur-3xl animate-in fade-in slide-in-from-top-4 lg:hidden">
          <div className="flex flex-col gap-6">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg font-bold ${isActive("/") ? "text-indigo-400" : "text-white"}`}
            >
              Home
            </Link>
            <Link
              to="/all-rides"
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg font-bold ${isActive("/all-rides") ? "text-indigo-400" : "text-white"}`}
            >
              All Rides
            </Link>
            <Link
              to="/my-rides"
              onClick={() => setIsMenuOpen(false)}
              className={`text-lg font-bold ${isActive("/my-rides") ? "text-indigo-400" : "text-white"}`}
            >
              My Rides
            </Link>
            <a
              href="#how-it-works"
              onClick={scrollToHowItWorks}
              className="text-lg font-bold text-white"
            >
              How It Works
            </a>
            
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-lg font-bold text-indigo-400"
              >
                <Shield className="h-5 w-5" />
                Admin Panel
              </Link>
            )}
            
            <div className="h-px bg-white/5 my-2"></div>
            
            {user ? (
              <>
                <div className="flex items-center gap-4">
                  <img
                    src={user.profilePicture || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                    alt="Profile"
                    className="h-12 w-12 rounded-full border border-white/10"
                  />
                  <div>
                    <p className="font-bold text-white">{user.name}</p>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">{user.department}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-red-500/10 py-4 text-sm font-bold text-red-400 transition hover:bg-red-500 hover:text-white"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full rounded-2xl bg-indigo-600 py-4 text-center text-sm font-bold text-white shadow-lg shadow-indigo-600/20"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

