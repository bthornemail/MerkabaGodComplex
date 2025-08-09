import React, { useState, useEffect } from 'react';
import { 
  TestTube, 
  Play, 
  CheckCircle, 
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  FileText
} from 'lucide-react';
import { TestSuite, TestCase } from '@/types';
import { useWebSocket } from '@/hooks/useWebSocket';

export function TestingPanel() {
  const [testSuites, setTestSuites] = useState<TestSuite[]>([
    {
      id: 'cue-framework',
      name: 'CUE Framework Tests',
      status: 'idle',
      tests: [
        { id: 'mdu-validation', name: 'MDU Validation System', status: 'pending', duration: 0 },
        { id: 'vec7-prime', name: 'Vec7 Prime Validation', status: 'pending', duration: 0 },
        { id: 'harmony-agents', name: 'Vec7 Harmony System', status: 'pending', duration: 0 },
        { id: 'orchestrator', name: 'CUE-AMGF Orchestrator', status: 'pending', duration: 0 },
      ],
      results: { total: 4, passed: 0, failed: 0, duration: 0, coverage: 0 }
    },
    {
      id: 'manuscript-generation',
      name: 'Manuscript Generation Tests',
      status: 'idle',
      tests: [
        { id: 'training-system', name: 'Training System', status: 'pending', duration: 0 },
        { id: 'semantic-engine', name: 'Semantic Engine', status: 'pending', duration: 0 },
        { id: 'chapter-generation', name: 'Chapter Generation', status: 'pending', duration: 0 },
        { id: 'quality-validation', name: 'Quality Validation', status: 'pending', duration: 0 },
      ],
      results: { total: 4, passed: 0, failed: 0, duration: 0, coverage: 0 }
    },
    {
      id: 'protocol-integration',
      name: 'Protocol Integration Tests',
      status: 'idle',
      tests: [
        { id: 'cue-dashboard', name: 'CUE Dashboard Integration', status: 'pending', duration: 0 },
        { id: 'rectified-prototype', name: 'Rectified Prototype', status: 'pending', duration: 0 },
        { id: 'websocket-api', name: 'WebSocket API', status: 'pending', duration: 0 },
        { id: 'end-to-end', name: 'End-to-End Workflow', status: 'pending', duration: 0 },
      ],
      results: { total: 4, passed: 0, failed: 0, duration: 0, coverage: 0 }
    }
  ]);

  const [selectedSuite, setSelectedSuite] = useState<TestSuite | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const { subscribe, send } = useWebSocket();

  useEffect(() => {
    const unsubscribe = subscribe('test_results', (data: any) => {
      setTestSuites(prev => prev.map(suite => 
        suite.id === data.suiteId ? { ...suite, ...data.results } : suite
      ));
    });

    return unsubscribe;
  }, [subscribe]);

  const handleRunSuite = (suiteId: string) => {
    setTestSuites(prev => prev.map(suite => 
      suite.id === suiteId ? { ...suite, status: 'running' } : suite
    ));
    send('run_test_suite', { suiteId });
  };

  const handleRunAllSuites = () => {
    setIsRunningAll(true);
    testSuites.forEach(suite => {
      handleRunSuite(suite.id);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-harmony-green';
      case 'failed': return 'text-red-400';
      case 'running': return 'text-blue-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'failed': return <XCircle className="w-4 h-4" />;
      case 'running': return <Clock className="w-4 h-4 animate-spin" />;
      default: return <TestTube className="w-4 h-4" />;
    }
  };

  const totalTests = testSuites.reduce((sum, suite) => sum + suite.results.total, 0);
  const totalPassed = testSuites.reduce((sum, suite) => sum + suite.results.passed, 0);
  const totalFailed = testSuites.reduce((sum, suite) => sum + suite.results.failed, 0);
  const overallCoverage = testSuites.reduce((sum, suite) => sum + suite.results.coverage, 0) / testSuites.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Testing & Validation</h2>
          <p className="text-slate-400">Autonomous testing and validation of all CUE framework components</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRunAllSuites}
            disabled={isRunningAll}
            className="bg-cue-primary hover:bg-cue-primary/80 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            {isRunningAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Running All...
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Run All Tests
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <TestTube className="w-6 h-6 text-cue-primary" />
            <h3 className="font-semibold text-white">Total Tests</h3>
          </div>
          <div className="text-3xl font-bold text-white">{totalTests}</div>
          <div className="text-sm text-slate-400 mt-1">
            Across {testSuites.length} test suites
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-harmony-green" />
            <h3 className="font-semibold text-white">Passed</h3>
          </div>
          <div className="text-3xl font-bold text-harmony-green">{totalPassed}</div>
          <div className="text-sm text-slate-400 mt-1">
            {totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : 0}% success rate
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-6 h-6 text-red-400" />
            <h3 className="font-semibold text-white">Failed</h3>
          </div>
          <div className="text-3xl font-bold text-red-400">{totalFailed}</div>
          <div className="text-sm text-slate-400 mt-1">
            {totalTests > 0 ? ((totalFailed / totalTests) * 100).toFixed(1) : 0}% failure rate
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-cue-accent" />
            <h3 className="font-semibold text-white">Coverage</h3>
          </div>
          <div className="text-3xl font-bold text-cue-accent">{overallCoverage.toFixed(1)}%</div>
          <div className="text-sm text-slate-400 mt-1">
            Code coverage
          </div>
        </div>
      </div>

      {/* Test Suites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {testSuites.map(suite => (
          <div 
            key={suite.id}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            onClick={() => setSelectedSuite(suite)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">{suite.name}</h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRunSuite(suite.id);
                }}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Play className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className={`capitalize ${getStatusColor(suite.status)}`}>
                  {suite.status}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Tests</span>
                <span className="text-white">{suite.results.total}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Passed / Failed</span>
                <span className="text-harmony-green">
                  {suite.results.passed} <span className="text-slate-400">/</span>{' '}
                  <span className="text-red-400">{suite.results.failed}</span>
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Duration</span>
                <span className="text-white">{suite.results.duration.toFixed(2)}s</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Coverage</span>
                <span className="text-cue-accent">{suite.results.coverage.toFixed(1)}%</span>
              </div>

              {/* Progress Bar */}
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-harmony-green to-cue-primary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${suite.results.total > 0 ? (suite.results.passed / suite.results.total) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Suite Details */}
      {selectedSuite && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">{selectedSuite.name}</h3>
            <button
              onClick={() => setSelectedSuite(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Individual Test Cases */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-white mb-4">Test Cases</h4>
            {selectedSuite.tests.map(test => (
              <div key={test.id} className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg">
                <div className="flex items-center gap-3 flex-1">
                  {getStatusIcon(test.status)}
                  <div>
                    <div className="text-white font-medium">{test.name}</div>
                    {test.error && (
                      <div className="text-red-400 text-sm mt-1">{test.error}</div>
                    )}
                  </div>
                </div>
                <div className="text-sm text-slate-400">
                  {test.duration > 0 ? `${test.duration.toFixed(2)}s` : '-'}
                </div>
                <div className={`text-sm font-medium ${getStatusColor(test.status)}`}>
                  {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                </div>
              </div>
            ))}
          </div>

          {/* Test Results Summary */}
          <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{selectedSuite.results.total}</div>
                <div className="text-sm text-slate-400">Total Tests</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-harmony-green">{selectedSuite.results.passed}</div>
                <div className="text-sm text-slate-400">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{selectedSuite.results.failed}</div>
                <div className="text-sm text-slate-400">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cue-accent">{selectedSuite.results.coverage.toFixed(1)}%</div>
                <div className="text-sm text-slate-400">Coverage</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}