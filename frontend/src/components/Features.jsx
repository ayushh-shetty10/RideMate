import React from "react";
import { Shield, Mail, Wallet, Users, Zap, GraduationCap } from "lucide-react";

const features = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Safety First",
    description: "Strict college-only verification and real-time reporting for a secure campus environment.",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400"
  },
  {
    icon: <Mail className="h-6 w-6" />,
    title: "Instant Alerts",
    description: "Automatic email notifications when someone joins or leaves your ride.",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400"
  },
  {
    icon: <Wallet className="h-6 w-6" />,
    title: "Split Costs",
    description: "Share fuel and parking expenses to make daily commuting significantly cheaper.",
    bg: "bg-amber-500/10",
    text: "text-amber-400"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Fast & Fluid",
    description: "Optimized interface for quick ride discovery and creation on the go.",
    bg: "bg-purple-500/10",
    text: "text-purple-400"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Peer Trusted",
    description: "Build a network of reliable travel mates within your college community.",
    bg: "bg-pink-500/10",
    text: "text-pink-400"
  },
  {
    icon: <GraduationCap className="h-6 w-6" />,
    title: "College Exclusive",
    description: "Restricted to verified students only. No outsiders, no security risks.",
    bg: "bg-blue-500/10",
    text: "text-blue-400"
  }
];

const Features = () => {
  return (
    <section className="py-24 bg-slate-900/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-8 text-center lg:text-left">
          <div className="max-w-2xl mx-auto lg:mx-0">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-500">Core Features</h2>
            <h3 className="mt-4 text-4xl font-black text-white tracking-tight sm:text-5xl">Built for Campus Life</h3>
            <p className="mt-6 text-slate-400">
              We've packed RideMate with features that prioritize your safety, savings, and social connections.
            </p>
          </div>
          <div className="flex justify-center lg:justify-end gap-12 border-t lg:border-t-0 lg:border-l border-white/10 pt-8 lg:pt-0 lg:pl-12">
            <div>
              <p className="text-3xl font-black text-white">500+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-black text-white">1.2k</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">Rides Done</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group relative rounded-[32px] border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10 hover:-translate-y-2"
            >
              <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bg} ${feature.text} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{feature.title}</h4>
              <p className="text-sm leading-relaxed text-slate-500 group-hover:text-slate-400 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
