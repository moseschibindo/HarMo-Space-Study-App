import React from 'react';
import { BookOpen, MapPin, ShoppingCart, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 40, className = "", showText = false }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        {/* Shield Background with sections */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
          <defs>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="greenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <linearGradient id="orangeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          
          {/* Shield Shape Path */}
          <path 
            d="M50 5 L90 20 C90 50 75 80 50 95 C25 80 10 50 10 20 L50 5 Z" 
            fill="white"
            className="opacity-10"
          />
          
          {/* Top Left Section (Book) */}
          <path 
            d="M50 5 L10 20 C10 45 25 65 50 50 Z" 
            fill="url(#blueGrad)"
          />
          
          {/* Top Right Section (Pin) */}
          <path 
            d="M50 5 L90 20 C90 45 75 65 50 50 Z" 
            fill="url(#greenGrad)"
          />
          
          {/* Bottom Section (Cart) */}
          <path 
            d="M10 45 C10 65 25 85 50 95 C75 85 90 65 90 45 L50 50 L10 45 Z" 
            fill="url(#orangeGrad)"
          />
        </svg>
        
        {/* Icons Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <BookOpen 
              size={size * 0.25} 
              className="absolute text-white" 
              style={{ top: '18%', left: '22%' }} 
            />
            <MapPin 
              size={size * 0.25} 
              className="absolute text-white" 
              style={{ top: '18%', right: '22%' }} 
            />
            <ShoppingCart 
              size={size * 0.3} 
              className="absolute text-white" 
              style={{ bottom: '15%', left: '50%', transform: 'translateX(-50%)' }} 
            />
          </div>
        </div>
        
        {/* Orbit Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2 border-2 border-brand-400/30 rounded-full border-t-brand-500 border-r-transparent border-b-violet-500 border-l-transparent"
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="text-xl font-display font-black tracking-tighter leading-none">
            <span className="text-brand-600">HarMo Space</span>
            <span className="text-brand-400 ml-1">360</span>
          </span>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">Academic Universe</span>
        </div>
      )}
    </div>
  );
};
