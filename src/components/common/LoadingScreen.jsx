import React from 'react';

const LoadingScreen = ({ label = 'Loading' }) => {
  return (
    <div className="min-h-screen bg-[#030303] px-6 pb-24 pt-32 text-white">
      <div className="mx-auto flex max-w-3xl flex-col items-center border border-white/10 bg-[#050505]/95 px-8 py-20 text-center shadow-[0_25px_80px_rgba(0,0,0,0.45)]">
        <div className="h-10 w-10 rounded-full border-2 border-white/15 border-t-[#d4af37] animate-spin" />
        <p className="mt-6 text-[11px] uppercase tracking-[0.35em] text-white/55">
          {label}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
