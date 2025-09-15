'use client';

import { motion } from 'framer-motion';
import { Compass, Users, Trophy, Map } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="jungle-card p-8 max-w-2xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 20 }}
          className="mb-8"
        >
          <Compass className="w-24 h-24 mx-auto text-jungle-accent mb-4 animate-float" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-6xl font-bold mb-4 bg-gradient-to-r from-jungle-accent to-jungle-amber bg-clip-text text-transparent"
        >
          Jungle Explorer
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-xl text-jungle-stone-light mb-8"
        >
          Embark on an epic treasure hunt adventure! Work with your team to solve clues, 
          scan QR codes, and discover hidden treasures in the jungle.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center"
        >
          <Link href="/player/setup" className="block">
            <button className="jungle-button w-full md:w-auto">
              <Users className="inline w-5 h-5 mr-2" />
              Join Adventure
            </button>
          </Link>
          
          <Link href="/admin" className="block">
            <button className="jungle-button-secondary w-full md:w-auto">
              <Map className="inline w-5 h-5 mr-2" />
              Admin Portal
            </button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center">
            <Compass className="w-8 h-8 mx-auto text-jungle-accent mb-2" />
            <h3 className="font-semibold text-jungle-accent">Explore</h3>
            <p className="text-sm text-jungle-stone-light">Navigate to secret locations</p>
          </div>
          
          <div className="text-center">
            <Trophy className="w-8 h-8 mx-auto text-jungle-accent mb-2" />
            <h3 className="font-semibold text-jungle-accent">Compete</h3>
            <p className="text-sm text-jungle-stone-light">Earn points and climb the leaderboard</p>
          </div>
          
          <div className="text-center">
            <Users className="w-8 h-8 mx-auto text-jungle-accent mb-2" />
            <h3 className="font-semibold text-jungle-accent">Team Up</h3>
            <p className="text-sm text-jungle-stone-light">Work together to solve challenges</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating particles animation */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-jungle-accent/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}