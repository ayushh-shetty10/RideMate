import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, ShieldCheck, Sparkles, TrendingUp } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] rounded-full bg-indigo-600/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-pulse delay-1000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">Campus Travel Redefined</span>
        </div>

        {/* Title */}
        <h1 className="mt-10 text-5xl font-black tracking-tight text-white sm:text-7xl lg:text-8xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          Sharing Rides, <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Saving Money.
          </span>
        </h1>

        {/* Description */}
        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000">
          The exclusive campus ride-sharing platform. Connect with verified students, 
          share your journey, and make travel effortless and affordable.
        </p>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row animate-in fade-in slide-in-from-bottom-16 duration-1000">
          <button
            onClick={() => navigate("/all-rides")}
            className="group flex items-center gap-3 rounded-2xl bg-indigo-600 px-8 py-5 text-lg font-bold text-white shadow-2xl shadow-indigo-600/30 transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]"
          >
            Browse All Rides
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
          
          <button
            onClick={() => navigate("/create-ride")}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-8 py-5 text-lg font-bold text-white backdrop-blur-xl transition-all hover:bg-white/10 hover:border-white/20"
          >
            Host a Ride
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-8 text-slate-500 animate-in fade-in duration-1000 delay-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-medium tracking-wide">College Verified</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-medium tracking-wide">1,200+ Rides Shared</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/150?img=${i + 10}`}
                  alt="User"
                  className="h-6 w-6 rounded-full border-2 border-slate-950"
                />
              ))}
            </div>
            <span className="text-sm font-medium tracking-wide ml-1">Joined by 500+ Peers</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
