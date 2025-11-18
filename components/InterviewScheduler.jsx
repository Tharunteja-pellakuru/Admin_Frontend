import React, { useState } from 'react';
import { X, Calendar, Clock, Video, MapPin, User, Link as LinkIcon, Bell } from 'lucide-react';

const InterviewScheduler = ({ candidate, isOpen, onClose, onSchedule }) => {
  const [formData, setFormData] = useState({
      date: '',
      time: '',
      mode: 'Online',
      meetingLink: '',
      interviewerName: '',
      notes: ''
  });
  const [notify, setNotify] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
      e.preventDefault();
      onSchedule(formData, notify);
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="text-primary" size={20} /> 
              Schedule Interview
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <div className="relative">
                        <input 
                            type="date" 
                            required
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        />
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                    <div className="relative">
                        <input 
                            type="time" 
                            required
                            value={formData.time}
                            onChange={e => setFormData({...formData, time: e.target.value})}
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        />
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interview Mode</label>
                <div className="flex gap-4">
                    {['Online', 'Offline', 'Phone'].map(m => (
                        <label key={m} className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="mode" 
                                value={m}
                                checked={formData.mode === m}
                                onChange={e => setFormData({...formData, mode: e.target.value})}
                                className="focus:ring-primary accent-green-600 cursor-pointer"
                            />
                            <span className="text-sm text-gray-700">{m}</span>
                        </label>
                    ))}
                </div>
            </div>

            {formData.mode === 'Online' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link</label>
                    <div className="relative">
                        <input 
                            type="url" 
                            value={formData.meetingLink}
                            onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                            placeholder="Zoom / Google Meet URL"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        />
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
            )}

            {formData.mode === 'Offline' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Location</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            value={formData.meetingLink}
                            onChange={e => setFormData({...formData, meetingLink: e.target.value})}
                            placeholder="e.g. Room 302, HQ"
                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                        />
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interviewer Name</label>
                <div className="relative">
                    <input 
                        type="text" 
                        required
                        value={formData.interviewerName}
                        onChange={e => setFormData({...formData, interviewerName: e.target.value})}
                        placeholder="Who is conducting this interview?"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                </div>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes</label>
                <textarea 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    rows={2}
                    placeholder="Instructions for interviewer..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                />
            </div>

            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex items-start gap-3">
                <div className="pt-0.5">
                    <input 
                        type="checkbox" 
                        id="notify_int" 
                        checked={notify} 
                        onChange={(e) => setNotify(e.target.checked)} 
                        className="w-4 h-4 rounded focus:ring-primary border border-gray-300 cursor-pointer bg-white accent-green-600" 
                    />
                </div>
                <label htmlFor="notify_int" className="text-sm cursor-pointer select-none">
                    <span className="font-semibold text-amber-800 block mb-0.5 flex items-center gap-2">
                         Send Invitation <Bell size={12} />
                    </span>
                    <span className="text-amber-700 text-xs">
                        Automatically sends Email & WhatsApp with meeting details.
                    </span>
                </label>
            </div>

            <div className="pt-2 flex gap-3">
                <button 
                    type="button" 
                    onClick={onClose}
                    className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-colors"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    className="flex-1 py-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover font-medium shadow-lg shadow-primary/30 flex items-center justify-center gap-2 transition-colors"
                >
                    <Calendar size={18} /> Schedule
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewScheduler;