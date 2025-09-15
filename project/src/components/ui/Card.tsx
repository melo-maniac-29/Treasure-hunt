import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, animate = true }) => {
  const Component = animate ? motion.div : 'div';
  
  const motionProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  } : {};

  return (
    <Component
      className={clsx(
        'bg-white/90 backdrop-blur-sm rounded-xl shadow-xl border border-emerald-100',
        'hover:shadow-2xl transition-all duration-300',
        className
      )}
      {...motionProps}
    >
      {children}
    </Component>
  );
};