import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Car, MapPin, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const RideShowcase = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentRides = async () => {
      try {
        const { data } = await api.get("/rides");
        setRides(data.slice(0, 8)); // Show first 8 rides
      } catch (error) {
        console.error("Error fetching rides for showcase:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentRides();
  }, []);

  if (loading || rides.length === 0) return null;

  return (
    <section className="py-24 overflow-hidden bg-slate-950">
      <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-500">Live Showcase</h3>
          <h4 className="mt-4 text-3xl font-black text-white tracking-tight sm:text-4xl">Available Right Now</h4>
        </div>
        <Link 
          to="/all-rides"
          className="flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors group"
        >
          View all available rides
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className={`relative flex overflow-x-hidden ${rides.length < 4 ? 'justify-center' : ''}`}>
        {/* Scrolling Container */}
        <div className={`flex py-4 ${rides.length >= 4 ? 'animate-marquee whitespace-nowrap' : 'flex-wrap justify-center gap-8'}`}>
          {/* Repeat rides enough times to ensure smooth loop for marquee, or just once for static centered view */}
          {(rides.length >= 4 ? [...rides, ...rides, ...rides] : rides).map((ride, index) => (
            <div 
              key={`${ride._id}-${index}`}
              className={`mx-4 w-[320px] shrink-0 rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-xl transition-all hover:bg-white/[0.06] hover:border-white/10 ${rides.length < 4 ? 'mx-0' : ''}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <img 
                    src={ride.creator.profilePicture || `https://ui-avatars.com/api/?name=${ride.creator.name}&background=6366f1&color=fff`} 
                    alt="" 
                    className="h-8 w-8 rounded-full border border-white/10"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">{ride.creator.name}</p>
                    <p className="text-[10px] text-slate-500">{ride.creator.department}</p>
                  </div>
                </div>
                <div className="rounded-full bg-indigo-500/10 px-2 py-1 text-[10px] font-bold text-indigo-400">
                  {ride.status}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  <p className="text-sm font-medium text-slate-300 truncate">{ride.from}</p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-3.5 w-3.5 text-purple-500" />
                  <p className="text-sm font-bold text-white truncate">{ride.destination}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-bold uppercase">{ride.participants.length}/{ride.totalSeats} Joined</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  {new Date(ride.dateTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${100 / 3}%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default RideShowcase;
