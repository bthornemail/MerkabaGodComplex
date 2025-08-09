import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Brain, 
  Users, 
  Network,
  Zap,
  Target,
  Globe,
  Activity
} from 'lucide-react';

interface SystemMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
  description: string;
}

export const LiveMetrics: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    {
      id: 'knowledge-units',
      label: 'Living Knowledge Units',
      value: 15247,
      unit: '',
      trend: 'up',
      icon: <Brain className="w-6 h-6" />,
      color: 'text-cyan-400',
      description: 'Active knowledge units evolving through Conway\'s Game of Life'
    },
    {
      id: 'active-agents',
      label: 'Conscious Agents',
      value: 1834,
      unit: '',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
      color: 'text-purple-400',
      description: 'Personality-driven agents with distinct cognitive functions'
    },
    {
      id: 'consensus-score',
      label: 'Global Consensus',
      value: 94.7,
      unit: '%',
      trend: 'stable',
      icon: <Network className="w-6 h-6" />,
      color: 'text-green-400',
      description: 'Network-wide harmonic consensus validation rate'
    },
    {
      id: 'evolution-cycles',
      label: 'Evolution Cycles',
      value: 45892,
      unit: '',
      trend: 'up',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-yellow-400',
      description: 'Total knowledge evolution cycles completed today'
    },
    {
      id: 'manuscript-words',
      label: 'Generated Manuscripts',
      value: 2847291,
      unit: 'words',
      trend: 'up',
      icon: <Target className="w-6 h-6" />,
      color: 'text-pink-400',
      description: 'Words generated through consciousness compilation'
    },
    {
      id: 'network-nodes',
      label: 'Network Nodes',
      value: 847,
      unit: '',
      trend: 'up',
      icon: <Globe className="w-6 h-6" />,
      color: 'text-indigo-400',
      description: 'Active nodes in the Universal Life Protocol network'
    }
  ]);

  const [isLive, setIsLive] = useState(true);

  // Simulate live data updates
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setMetrics(prevMetrics => 
        prevMetrics.map(metric => {
          let newValue = metric.value;
          let newTrend: 'up' | 'down' | 'stable' = metric.trend;

          // Simulate realistic updates based on metric type
          switch (metric.id) {
            case 'knowledge-units':
              newValue += Math.floor(Math.random() * 15) + 1;
              newTrend = 'up';
              break;
            case 'active-agents':
              const agentChange = Math.floor(Math.random() * 5) - 1;
              newValue = Math.max(1000, newValue + agentChange);
              newTrend = agentChange > 0 ? 'up' : agentChange < 0 ? 'down' : 'stable';
              break;
            case 'consensus-score':
              const consensusChange = (Math.random() - 0.5) * 0.8;
              newValue = Math.max(85, Math.min(100, newValue + consensusChange));
              newTrend = Math.abs(consensusChange) < 0.1 ? 'stable' : consensusChange > 0 ? 'up' : 'down';
              break;
            case 'evolution-cycles':
              newValue += Math.floor(Math.random() * 25) + 5;
              newTrend = 'up';
              break;
            case 'manuscript-words':
              newValue += Math.floor(Math.random() * 150) + 50;
              newTrend = 'up';
              break;
            case 'network-nodes':
              const nodeChange = Math.random() > 0.9 ? (Math.random() > 0.5 ? 1 : -1) : 0;
              newValue = Math.max(500, newValue + nodeChange);
              newTrend = nodeChange === 0 ? 'stable' : nodeChange > 0 ? 'up' : 'down';
              break;
          }

          return {
            ...metric,
            value: newValue,
            trend: newTrend
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive]);

  const formatValue = (value: number, unit: string) => {
    if (unit === '%') {
      return value.toFixed(1);
    }
    if (unit === 'words' || value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    }
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      default:
        return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-green-400';
      case 'down':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Live Status Indicator */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className={`w-3 h-3 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
        <span className="text-slate-300 font-medium">
          {isLive ? 'Live System Metrics - Updated Every 3 seconds' : 'Metrics Paused'}
        </span>
        <button
          onClick={() => setIsLive(!isLive)}
          className="ml-4 px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition-colors duration-300"
        >
          {isLive ? 'Pause' : 'Resume'}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 group"
          >
            {/* Metric Header */}
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-slate-700/50 rounded-xl ${metric.color} group-hover:scale-110 transition-transform duration-300`}>
                {metric.icon}
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(metric.trend)}
                <span className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                  {metric.trend === 'stable' ? 'Stable' : metric.trend === 'up' ? 'Rising' : 'Declining'}
                </span>
              </div>
            </div>

            {/* Metric Value */}
            <div className="mb-3">
              <motion.div
                key={metric.value}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`text-3xl md:text-4xl font-bold ${metric.color} mb-1`}
              >
                {formatValue(metric.value, metric.unit)}
                {metric.unit && metric.unit !== 'words' && (
                  <span className="text-lg ml-1">{metric.unit}</span>
                )}
              </motion.div>
              <h3 className="text-white font-semibold text-lg">{metric.label}</h3>
            </div>

            {/* Metric Description */}
            <p className="text-slate-400 text-sm leading-relaxed">
              {metric.description}
            </p>

            {/* Animated Background Glow */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${metric.color.split('-')[1]}-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none`} />
          </motion.div>
        ))}
      </div>

      {/* Global Network Status */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mt-12 bg-gradient-to-r from-slate-800/50 to-indigo-900/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8"
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <Globe className="w-8 h-8 text-cyan-400" />
            Universal Life Protocol Network Status
          </h3>
          <p className="text-slate-300">
            Real-time metrics from the global consciousness network
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400 mb-1">99.7%</div>
            <div className="text-slate-400 text-sm">Network Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-400 mb-1">2.3ms</div>
            <div className="text-slate-400 text-sm">Avg Response Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400 mb-1">47</div>
            <div className="text-slate-400 text-sm">Countries Active</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-400 mb-1">24/7</div>
            <div className="text-slate-400 text-sm">Consciousness Online</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};