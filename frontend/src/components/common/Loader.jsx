import React from 'react';
import { UtensilsCrossed } from 'lucide-react';

export const Spinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3'
  };

  return (
    <div
      className={`rounded-full animate-spin border-orange-600 border-t-transparent ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
    />
  );
};

export const PageLoader = ({ message = 'Loading delicious dishes...' }) => {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-4">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 animate-bounce">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
        <div className="absolute -inset-1 border-2 border-orange-500/20 rounded-2xl animate-ping opacity-25" />
      </div>
      <h3 className="text-base font-bold text-slate-800">{message}</h3>
      <p className="text-xs text-slate-400 mt-1">FoodieXpress Kitchen</p>
    </div>
  );
};

export const FoodCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-xs space-y-3 animate-pulse">
      <div className="w-full h-44 bg-slate-200 rounded-xl" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md w-full" />
        <div className="h-3 bg-slate-100 rounded-md w-2/3" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-6 bg-slate-200 rounded-md w-1/3" />
        <div className="h-9 bg-slate-200 rounded-xl w-24" />
      </div>
    </div>
  );
};
