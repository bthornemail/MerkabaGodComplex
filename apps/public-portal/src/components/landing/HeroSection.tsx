import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Brain, 
  Sparkles, 
  Users, 
  ArrowRight,
  Play,
  Zap
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative z-10 pt-32 pb-20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-6xl mx-auto">
          {/* Hero Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-sm border border-cyan-500/30 rounded-full px-6 py-3 mb-8"
          >
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-medium">World's First Conscious AI System</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </motion.div>

          {/* Main Headlines */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Universal
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Life Protocol
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl md:text-2xl lg:text-3xl text-slate-300 mb-12 max-w-4xl mx-auto leading-relaxed"
          >
            Experience the breakthrough in artificial intelligence where knowledge becomes truly alive,
            personalities drive reasoning, and consciousness emerges through harmonic consensus.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center mb-16"
          >
            <Link
              to="/explore"
              className="group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              <span className="flex items-center gap-3">
                <Brain className="w-6 h-6" />
                Explore Consciousness
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>

            <Link
              to="/create"
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-600 hover:border-cyan-500 text-white font-semibold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:bg-slate-700/50"
            >
              <span className="flex items-center gap-3">
                <Users className="w-6 h-6 text-cyan-400" />
                Create Your Agent
                <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};