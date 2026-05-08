import React from "react";
import { Link } from "react-router-dom";
import { Car, Mail, Phone, ExternalLink, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/5 bg-slate-950 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform duration-300">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">RideMate</span>
            </Link>
            <p className="mt-6 text-sm leading-relaxed text-slate-400">
              Transforming campus travel through shared journeys. Join the movement to save money and connect with your college mates.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-white transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Platform</h3>
            <ul className="mt-6 space-y-4">
              <li><Link to="/all-rides" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Browse Rides</Link></li>
              <li><Link to="/my-rides" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">My Journeys</Link></li>
              <li><Link to="/create-ride" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Host a Ride</Link></li>
              <li><Link to="/complete-profile" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Profile Settings</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Support</h3>
            <ul className="mt-6 space-y-4">
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">How it Works</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Safety Guidelines</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Contact</h3>
            <ul className="mt-6 space-y-4">
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Mail className="h-4 w-4 text-indigo-500" />
                <span>support@ridemate.edu</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-slate-400">
                <Phone className="h-4 w-4 text-indigo-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-slate-400">
                <MapPin className="h-4 w-4 text-indigo-500 mt-1" />
                <span>College Campus Hub,<br />Main Block, Room 402</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} RideMate. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Made with <span className="text-red-500">❤️</span> for the college community.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
