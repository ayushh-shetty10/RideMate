import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Features from "../components/Features";
import RideShowcase from "../components/RideShowcase";
import Footer from "../components/Footer";

const LandingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
          // Clear state after scrolling
          window.history.replaceState({}, document.title);
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-950 selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Subtle Divider */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <RideShowcase />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        </div>

        <HowItWorks />

        <Features />

        {/* CTA Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[48px] bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-center shadow-2xl sm:p-20">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-white/10 blur-[80px]"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-80 w-80 rounded-full bg-black/10 blur-[80px]"></div>
            
            <h3 className="relative z-10 text-4xl font-black text-white sm:text-5xl lg:text-6xl tracking-tight">
              Ready to start <br /> traveling together?
            </h3>
            <p className="relative z-10 mx-auto mt-8 max-w-xl text-lg text-indigo-100 font-medium">
              Join hundreds of students already saving money and making new connections every day.
            </p>
            <div className="relative z-10 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button 
                onClick={() => navigate("/all-rides")}
                className="w-full sm:w-auto rounded-2xl bg-white px-8 py-5 text-lg font-extrabold text-indigo-600 shadow-xl transition-all hover:scale-[1.05] active:scale-[0.95]"
              >
                Find a Ride
              </button>
              <button 
                onClick={() => navigate("/create-ride")}
                className="w-full sm:w-auto rounded-2xl bg-indigo-500/20 px-8 py-5 text-lg font-extrabold text-white border border-white/20 backdrop-blur-md transition-all hover:bg-indigo-500/30"
              >
                Host a Ride
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
