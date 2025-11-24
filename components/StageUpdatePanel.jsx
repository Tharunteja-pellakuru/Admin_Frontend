import React, { useState, useEffect } from 'react';
import { HIRING_STAGES } from '../constants';
import { X, Send, CheckCircle, MessageSquare, Mail } from 'lucide-react';

const StageUpdatePanel = ({ candidate, isOpen, onClose, onUpdate }) => {
  const [selectedStage, setSelectedStage] = useState(candidate.currentStage);
  const [status, setStatus] = useState(candidate.currentStageStatus);
  const [note, setNote] = useState('');
  const [notify, setNotify] = useState(true);

  console.log(candidate);
  // Reset form when opening
  useEffect(() => {
    if (isOpen) {
        setSelectedStage(candidate.currentStage);
        setStatus(candidate.currentStageStatus);
        setNote('');
        setNotify(true);
    }
  }, [isOpen, candidate]);

  if (!isOpen) return null;

  const handleStageChange = (e) => {
      const newStage = e.target.value;
      setSelectedStage(newStage);
      // Auto-set status to 'Pending' if moving to a new stage
      if (newStage !== candidate.currentStage) {
          setStatus('Pending');
      }
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      console.log('🔔 Submit stage update:', { selectedStage, status, note, notify });
      onUpdate(selectedStage, status, note, notify);
      onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in fade-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">Update Hiring Stage</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Stage</label>
                <select 
                    value={selectedStage} 
                    onChange={handleStageChange}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                >
                    {HIRING_STAGES.map(stage => (
                        <option key={stage.id} value={stage.id}>
                            {stage.name}
                        </option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                    {HIRING_STAGES.find(s => s.id === selectedStage)?.description}
                </p>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Status</label>
                <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                >
                    <option value="Pending">Pending</option>
                    <option value="Cleared">Cleared</option>
                    <option value="Rejected">Rejected</option>
                    <option value="On Hold">On Hold</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Internal Notes (Optional)</label>
                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none"
                    placeholder="Add context for this update..."
                />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
                <div className="pt-0.5">
                    <input 
                        type="checkbox" 
                        id="notify" 
                        checked={notify} 
                        onChange={(e) => {
                          console.log('🔔 Notify checkbox changed to:', e.target.checked);
                          setNotify(e.target.checked);
                        }} 
                        className="w-5 h-5 rounded focus:ring-primary border-2 border-gray-400 cursor-pointer accent-green-600" 
                    />
                </div>
                <label htmlFor="notify" className="text-sm cursor-pointer select-none">
                    <span className="font-semibold text-blue-800 block mb-0.5">Notify Candidate ✅</span>
                    <span className="text-blue-600 flex items-center gap-2 text-xs">
                        Automatically send Email <Mail size={10} /> & WhatsApp <MessageSquare size={10} /> update.
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
                    <CheckCircle size={18} /> Update Stage
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default StageUpdatePanel;