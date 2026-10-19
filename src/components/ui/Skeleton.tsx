import React from 'react';

interface SkeletonProps {
    variant?: 'line' | 'square' | 'card';
    className?: string;
}

export const Skeleton = ({ variant = 'line', className = '' }: SkeletonProps) => {
    // Vidro Embaçado (Glassmorphism): backdrop-blur-md + fundo branco translúcido + borda translúcida
    const baseGlass = "relative overflow-hidden bg-white/30 backdrop-blur-md border border-white/40 rounded-xl";

    // O brilho que passa (Gradient Shimmer) com desativação automática para prefers-reduced-motion
    const shimmerOverlay = (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer" />
    );

    if (variant === 'line') {
        return (
            <div className={`${baseGlass} h-5 w-full ${className}`}>
                {shimmerOverlay}
            </div>
        );
    }

    if (variant === 'square') {
        return (
            <div className={`${baseGlass} w-16 h-16 ${className}`}>
                {shimmerOverlay}
            </div>
        );
    }

    // Card Skeleton completo
    return (
        <div className={`${baseGlass} p-4 flex flex-col gap-3 w-full ${className}`}>
            <div className="w-full h-32 rounded-lg bg-white/20 relative overflow-hidden">
                {shimmerOverlay}
            </div>
            <div className="h-5 w-3/4 bg-white/20 rounded relative overflow-hidden">
                {shimmerOverlay}
            </div>
            <div className="h-4 w-1/2 bg-white/20 rounded relative overflow-hidden">
                {shimmerOverlay}
            </div>
        </div>
    );
};