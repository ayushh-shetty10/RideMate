import React from "react";

const SkeletonCard = () => {
  return (
    <div className="w-full h-[340px] rounded-[32px] border border-white/10 bg-white/5 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-white/10"></div>
          <div className="space-y-2">
            <div className="h-3 w-24 rounded-full bg-white/10"></div>
            <div className="h-2 w-16 rounded-full bg-white/10"></div>
          </div>
        </div>
        <div className="h-6 w-20 rounded-full bg-white/10"></div>
      </div>
      
      <div className="space-y-6 mb-8 mt-4">
        <div className="space-y-2">
          <div className="h-2 w-16 rounded-full bg-white/5"></div>
          <div className="h-6 w-48 rounded-lg bg-white/10"></div>
        </div>
        <div className="space-y-2">
          <div className="h-2 w-16 rounded-full bg-white/5"></div>
          <div className="h-6 w-32 rounded-lg bg-white/10"></div>
        </div>
      </div>
      
      <div className="flex gap-4 mt-auto pt-4 border-t border-white/5">
        <div className="h-11 flex-1 rounded-2xl bg-white/10"></div>
        <div className="h-11 flex-1 rounded-2xl bg-white/10"></div>
      </div>
    </div>
  );
};

export default SkeletonCard;
