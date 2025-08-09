import React, { useState } from 'react';
import { 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Settings
} from 'lucide-react';
import { ManuscriptProject, ChapterStatus } from '@/types';
import { wsService } from '@/services/websocket';

interface ManuscriptMonitorProps {
  projects: ManuscriptProject[];
}

export function ManuscriptMonitor({ projects }: ManuscriptMonitorProps) {
  const [selectedProject, setSelectedProject] = useState<ManuscriptProject | null>(null);
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  const handleStartGeneration = (projectId: string) => {
    wsService.send('start_manuscript', { projectId });
  };

  const handlePauseGeneration = (projectId: string) => {
    wsService.send('pause_manuscript', { projectId });
  };

  const handleResetProject = (projectId: string) => {
    wsService.send('reset_manuscript', { projectId });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-harmony-green';
      case 'generating': return 'text-blue-400';
      case 'error': return 'text-red-400';
      case 'initializing': return 'text-vec7-gold';
      default: return 'text-slate-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'generating': return <Clock className="w-4 h-4 animate-spin" />;
      case 'error': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Manuscript Generation</h2>
          <p className="text-slate-400">Monitor and control autonomous manuscript generation</p>
        </div>
        <button
          onClick={() => setShowNewProjectForm(true)}
          className="bg-cue-primary hover:bg-cue-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <BookOpen className="w-4 h-4" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map(project => (
          <div 
            key={project.id}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                {getStatusIcon(project.status)}
                <h3 className="font-semibold text-white truncate">{project.title}</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (project.status === 'generating') {
                      handlePauseGeneration(project.id);
                    } else {
                      handleStartGeneration(project.id);
                    }
                  }}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  {project.status === 'generating' ? 
                    <Pause className="w-4 h-4" /> : 
                    <Play className="w-4 h-4" />
                  }
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleResetProject(project.id);
                  }}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Status</span>
                <span className={getStatusColor(project.status)}>
                  {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-white">{project.progress.toFixed(1)}%</span>
              </div>
              
              <div className="bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-cue-primary to-cue-secondary rounded-full h-2 transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Chapters</span>
                <span className="text-white">
                  {project.chapters.filter(c => c.status === 'completed').length} / {project.chapters.length}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Coherence</span>
                <span className="text-harmony-green">
                  {(project.stats.avgCoherence * 100).toFixed(1)}%
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Vec7 Rate</span>
                <span className="text-vec7-gold">
                  {(project.stats.vec7ValidationRate * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">{selectedProject.title}</h3>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Project Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{selectedProject.stats.totalWords.toLocaleString()}</div>
              <div className="text-sm text-slate-400">Total Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-harmony-green">
                {(selectedProject.stats.avgCoherence * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-400">Avg Coherence</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-vec7-gold">
                {(selectedProject.stats.vec7ValidationRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-slate-400">Vec7 Validation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cue-accent">
                {selectedProject.stats.qualityScore.toFixed(2)}
              </div>
              <div className="text-sm text-slate-400">Quality Score</div>
            </div>
          </div>

          {/* Chapter Breakdown */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Chapter Progress</h4>
            <div className="space-y-2">
              {selectedProject.chapters.map(chapter => (
                <div key={chapter.number} className="flex items-center gap-4 p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-2 flex-1">
                    {getStatusIcon(chapter.status)}
                    <span className="text-white text-sm">
                      Chapter {chapter.number}: {chapter.title}
                    </span>
                  </div>
                  <div className="text-sm text-slate-400">
                    {chapter.wordCount.toLocaleString()} words
                  </div>
                  <div className="text-sm text-harmony-green">
                    {(chapter.coherenceScore * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm">
                    {chapter.vec7Validated ? 
                      <CheckCircle className="w-4 h-4 text-vec7-gold" /> :
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* New Project Form Modal */}
      {showNewProjectForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 w-full max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">Create New Manuscript Project</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cue-primary"
                  placeholder="Enter project title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Target Chapters
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  defaultValue="8"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cue-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Coherence Threshold
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.05"
                  defaultValue="0.85"
                  className="w-full"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewProjectForm(false)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-cue-primary hover:bg-cue-primary/80 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}