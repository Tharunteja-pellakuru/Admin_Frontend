
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { HIRING_STAGES } from '../constants';
import { ChevronLeft, Mail, Phone, MapPin, Calendar, Briefcase, Download, Star, User, FileText, Linkedin, Globe, Check, ArrowRight, Ban, Video, Clock, CheckCircle } from 'lucide-react';
import StageUpdatePanel from './StageUpdatePanel';
import StageTimeline from './StageTimeline';
import InterviewScheduler from './InterviewScheduler';

const ApplicationView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getApplication, updateApplication, addTimelineEvent, updateCandidateStage, scheduleInterview, user } = useStore();
  const application = getApplication(id || '');
  
  const [noteInput, setNoteInput] = useState('');
  const [isStagePanelOpen, setIsStagePanelOpen] = useState(false);
  const [isInterviewPanelOpen, setIsInterviewPanelOpen] = useState(false);

  if (!application) {
    return <div className="p-8 text-center text-gray-500">Application not found</div>;
  }

  // Find current stage index for progress bar
  const currentStageIndex = HIRING_STAGES.findIndex(s => s.id === application.currentStageId);
  const progressPercentage = ((currentStageIndex + 1) / HIRING_STAGES.length) * 100;

  const handleRating = (rating) => {
      updateApplication(application.id, { rating });
  };

  const handleAddNote = (e) => {
      e.preventDefault();
      if (!noteInput.trim()) return;
      
      const newEvent = {
          id: `evt_${Date.now()}`,
          type: 'note',
          content: noteInput,
          date: new Date().toLocaleString(),
          user: user?.name || 'Admin'
      };
      
      addTimelineEvent(application.id, newEvent);
      updateApplication(application.id, { notes: noteInput });
      setNoteInput('');
  };

  const handleStageUpdate = (stageId, status, note, notify) => {
      updateCandidateStage(application.id, stageId, status, note, notify);
  };

  const handleScheduleInterview = (data, notify) => {
      scheduleInterview(application.id, data, notify);
  };

  return (
    <div className="max-w-6xl mx-auto pb-10 relative">
      <button 
        onClick={() => navigate('/applications')} 
        className="flex items-center gap-1 text-gray-500 hover:text-primary mb-6 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Applications
      </button>

      {/* Top Status Bar & Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-border mb-6 p-6">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-4">
              <div>
                  <p className="text-sm text-gray-500 mb-1">Current Stage</p>
                  <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                      {HIRING_STAGES.find(s => s.id === application.currentStageId)?.name || 'Unknown'}
                      <span className={`text-xs px-2 py-1 rounded-full border font-medium
                          ${application.currentStageStatus === 'Cleared' ? 'bg-green-50 text-green-700 border-green-200' : 
                            application.currentStageStatus === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            application.currentStageStatus === 'On Hold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-blue-50 text-blue-700 border-blue-200'}`}>
                          {application.currentStageStatus}
                      </span>
                  </h2>
              </div>
              <div className="flex gap-3">
                  <button 
                      onClick={() => setIsInterviewPanelOpen(true)}
                      className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
                  >
                      <Calendar size={18} /> Schedule Interview
                  </button>
                  <button 
                      onClick={() => setIsStagePanelOpen(true)}
                      className="bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow-lg shadow-primary/30 hover:bg-primary-hover transition-all flex items-center gap-2"
                  >
                      Update Stage <ArrowRight size={18} />
                  </button>
              </div>
          </div>
          {/* Progress Bar */}
          <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                  className={`absolute top-0 left-0 h-full transition-all duration-500 rounded-full ${application.currentStageStatus === 'Rejected' ? 'bg-red-500' : 'bg-primary'}`}
                  style={{ width: `${progressPercentage}%` }}
              ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
              <span>Application Received</span>
              <span>Hired</span>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
        {/* LEFT COLUMN: Candidate Info */}
        <div className="lg:col-span-2 space-y-6">
             {/* Header Card */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6 relative overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                    <div className="flex items-start gap-5">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 border border-gray-100 shadow-inner">
                           {application.candidateName ? (
                                <span className="text-2xl font-bold text-gray-300">{application.candidateName.substring(0,2).toUpperCase()}</span>
                           ) : (
                                <Briefcase size={32} />
                           )}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{application.candidateName}</h1>
                            <p className="text-primary font-medium mb-2">{application.jobTitle}</p>
                            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1"><Mail size={14} /> {application.email}</div>
                                {application.phone && <div className="flex items-center gap-1"><Phone size={14} /> {application.phone}</div>}
                                {application.location && <div className="flex items-center gap-1"><MapPin size={14} /> {application.location}</div>}
                            </div>
                             <div className="flex gap-3 mt-4">
                                {application.linkedinUrl && (
                                    <a href={application.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-colors"><Linkedin size={18} /></a>
                                )}
                                {application.portfolioUrl && (
                                    <a href={application.portfolioUrl} target="_blank" rel="noreferrer" className="text-pink-600 hover:bg-pink-50 p-1.5 rounded-md transition-colors"><Globe size={18} /></a>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-3">
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                            {[1,2,3,4,5].map((star) => (
                                <button 
                                    key={star} 
                                    onClick={() => handleRating(star)}
                                    className={`p-1 hover:scale-110 transition-transform ${application.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                >
                                    <Star size={16} fill={application.rating >= star ? "currentColor" : "none"} />
                                </button>
                            ))}
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                             <Calendar size={12} /> Applied: {application.appliedDate}
                        </div>
                    </div>
                </div>
                
                {/* Actions Bar */}
                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                     <a href={application.resumeUrl || '#'} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all text-sm font-medium">
                        <Download size={16} /> Download Resume
                    </a>
                </div>
            </div>

            {/* Upcoming Interview Card */}
            {application.upcomingInterview && (
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 p-6">
                     <div className="flex justify-between items-start mb-4">
                         <div>
                             <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                 <Video size={20} className="text-blue-600" /> Upcoming Interview
                             </h2>
                             <p className="text-sm text-blue-600 font-medium mt-1">
                                 {application.upcomingInterview.status}
                             </p>
                         </div>
                         <button className="text-xs text-blue-500 hover:underline">Reschedule</button>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                 <Calendar size={20} />
                             </div>
                             <div>
                                 <p className="text-xs text-gray-500">Date & Time</p>
                                 <p className="font-semibold text-gray-800">
                                     {application.upcomingInterview.date} at {application.upcomingInterview.time}
                                 </p>
                             </div>
                         </div>

                         <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                 {application.upcomingInterview.mode === 'Online' ? <Video size={20} /> : <MapPin size={20} />}
                             </div>
                             <div>
                                 <p className="text-xs text-gray-500">Mode: {application.upcomingInterview.mode}</p>
                                 <p className="font-semibold text-gray-800 truncate max-w-[150px]" title={application.upcomingInterview.meetingLink}>
                                     {application.upcomingInterview.meetingLink || 'Office'}
                                 </p>
                             </div>
                         </div>
                         
                         <div className="md:col-span-2 flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                             <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                 <User size={20} />
                             </div>
                             <div>
                                 <p className="text-xs text-gray-500">Interviewer</p>
                                 <p className="font-semibold text-gray-800">{application.upcomingInterview.interviewerName}</p>
                             </div>
                         </div>
                     </div>
                </div>
            )}

             {/* Answers Section */}
            <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FileText size={20} className="text-primary" /> Application Responses
                </h2>
                <div className="space-y-6">
                    {Object.entries(application.answers).length > 0 ? (
                        Object.entries(application.answers).map(([key, value]) => (
                            <div key={key} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0 group">
                                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 group-hover:text-primary transition-colors">{key}</h3>
                                <div className="text-gray-800 bg-gray-50 p-4 rounded-lg text-sm border border-gray-100">
                                    {Array.isArray(value) ? value.join(', ') : String(value)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-gray-400 italic">No custom questions answered.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: Timeline & Notes */}
        <div className="lg:col-span-1 space-y-6">
             
             {/* Hiring Pipeline History */}
             <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={16} /> Hiring Pipeline
                </h2>
                <StageTimeline history={application.stageHistory} />
             </div>

             {/* Notes Input */}
             <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h2 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wider">Internal Notes</h2>
                <form onSubmit={handleAddNote}>
                    <textarea 
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none mb-2 transition-all"
                        rows={3}
                        placeholder="Add a note about this candidate..."
                    ></textarea>
                    <div className="flex justify-end">
                        <button type="submit" disabled={!noteInput.trim()} className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wide hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-sm">
                            Add Note
                        </button>
                    </div>
                </form>
             </div>
        </div>
      </div>

      <StageUpdatePanel 
        candidate={application}
        isOpen={isStagePanelOpen}
        onClose={() => setIsStagePanelOpen(false)}
        onUpdate={handleStageUpdate}
      />

      <InterviewScheduler 
         candidate={application}
         isOpen={isInterviewPanelOpen}
         onClose={() => setIsInterviewPanelOpen(false)}
         onSchedule={handleScheduleInterview}
      />
    </div>
  );
};

export default ApplicationView;
