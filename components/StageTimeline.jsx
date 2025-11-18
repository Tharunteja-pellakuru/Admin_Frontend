import React from 'react';
import { Check, X, Clock, Pause, Mail, MessageSquare, Video, Calendar } from 'lucide-react';

const StageTimeline = ({ history }) => {
  // Reverse to show newest first
  const sortedHistory = [...history].reverse();

  const getStatusIcon = (status, isInterview) => {
    if (isInterview) return <div className="bg-purple-100 text-purple-600 p-1 rounded-full"><Video size={12} /></div>;
    switch (status) {
      case 'Cleared': return <div className="bg-green-100 text-green-600 p-1 rounded-full"><Check size={12} /></div>;
      case 'Rejected': return <div className="bg-red-100 text-red-600 p-1 rounded-full"><X size={12} /></div>;
      case 'On Hold': return <div className="bg-yellow-100 text-yellow-600 p-1 rounded-full"><Pause size={12} /></div>;
      default: return <div className="bg-blue-100 text-blue-600 p-1 rounded-full"><Clock size={12} /></div>;
    }
  };

  return (
    <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 py-2">
      {sortedHistory.map((entry, index) => {
        const isInterview = !!entry.interviewScheduled;
        return (
            <div key={`${entry.stageId}_${index}`} className="relative pl-6">
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ring-2 z-10 
                    ${isInterview ? 'bg-purple-400 ring-purple-50' : 'bg-gray-400 ring-gray-50'}`}></div>
                
                <div className={`rounded-lg border p-3 transition-colors 
                    ${isInterview ? 'bg-purple-50 border-purple-100' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                    
                    <div className="flex justify-between items-start mb-1">
                        <div className="flex items-center gap-2">
                            <h4 className={`font-semibold text-sm ${isInterview ? 'text-purple-800' : 'text-gray-800'}`}>{entry.stageName}</h4>
                            {getStatusIcon(entry.status, isInterview)}
                        </div>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{entry.updatedAt}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                        <span>Updated by {entry.updatedBy}</span>
                        {!isInterview && (
                            <>
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                <span className={`font-medium ${
                                    entry.status === 'Cleared' ? 'text-green-600' : 
                                    entry.status === 'Rejected' ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {entry.status}
                                </span>
                            </>
                        )}
                    </div>

                    {entry.note && (
                        <div className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-100 mb-2 italic">
                            "{entry.note}"
                        </div>
                    )}

                    {(entry.emailSent || entry.whatsappSent) && (
                        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-200/50">
                            {entry.emailSent && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                                    <Mail size={10} /> Email
                                </span>
                            )}
                            {entry.whatsappSent && (
                                <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded">
                                    <MessageSquare size={10} /> WhatsApp
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
      })}
    </div>
  );
};

export default StageTimeline;