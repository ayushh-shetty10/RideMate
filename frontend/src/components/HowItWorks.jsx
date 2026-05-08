import React from "react";
import { UserPlus, MessageSquare, Car, Wallet, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: <UserPlus className="h-9 w-9" />,
    title: "Find or Host",
    description: "Discover active rides or post your own route in less than a minute.",
    color: "from-indigo-500 to-blue-500",
    shadow: "shadow-indigo-500/20"
  },
  {
    icon: <MessageSquare className="h-9 w-9" />,
    title: "Connect",
    description: "Chat with your travel mates to coordinate pickup spots and timing.",
    color: "from-purple-500 to-pink-500",
    shadow: "shadow-purple-500/20"
  },
  {
    icon: <Car className="h-9 w-9" />,
    title: "Ride Together",
    description: "Meet up, enjoy a comfortable campus commute, and save time.",
    color: "from-pink-500 to-rose-500",
    shadow: "shadow-pink-500/20"
  },
  {
    icon: <Wallet className="h-9 w-9" />,
    title: "Split & Save",
    description: "Share fuel costs and make travel affordable for everyone.",
    color: "from-emerald-500 to-teal-500",
    shadow: "shadow-emerald-500/20"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 h-96 w-96 bg-indigo-600/5 blur-[120px] rounded-full"></div>
      
      <div className="mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-32">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-indigo-400 uppercase mb-6">
            Simple Process
          </div>
          <h3 className="text-4xl font-black text-white tracking-tight sm:text-6xl lg:text-7xl">
            How it Works
          </h3>
          <p className="mt-8 text-slate-400 max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed">
            Find your ride. Meet your people. Split the cost. <br className="hidden sm:block" />
            Getting around campus has never been this easy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 relative">
          {/* Animated Connector Line (Desktop) */}
          <div className="hidden lg:block absolute top-28 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Step Number Badge */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 z-20">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-white/10 text-sm font-black text-slate-400 shadow-xl group-hover:border-indigo-500/50 group-hover:text-white transition-all duration-300">
                  {index + 1}
                </div>
              </div>

              <div className="flex flex-col items-center lg:items-start pt-10">
                {/* Icon Container */}
                <div className={`mb-10 relative flex h-32 w-32 items-center justify-center rounded-[40px] bg-white/5 border border-white/10 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:border-white/20`}>
                   <div className={`absolute inset-2 rounded-[32px] bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                   <div className={`relative text-white`}>
                     {step.icon}
                   </div>
                </div>

                {/* Content */}
                <div className="text-center lg:text-left">
                  <h4 className="text-2xl sm:text-3xl font-bold text-white mb-5 tracking-tight flex items-center justify-center lg:justify-start gap-3">
                    {step.title}
                    <ArrowRight className="h-5 w-5 text-slate-600 group-hover:translate-x-1 group-hover:text-indigo-400 transition-all hidden lg:block" />
                  </h4>
                  <p className="text-slate-500 text-base sm:text-lg leading-relaxed group-hover:text-slate-400 transition-colors font-medium">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector (Mobile/Tablet) */}
              {index < steps.length - 1 && (
                <div className="lg:hidden flex justify-center py-8">
                  <div className="h-16 w-px bg-gradient-to-b from-white/10 to-transparent"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
