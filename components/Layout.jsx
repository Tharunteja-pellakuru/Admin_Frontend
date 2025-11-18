import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import Sidebar from './Sidebar';
import { Menu, Bell, User, Search, CheckCircle, AlertCircle } from 'lucide-react';
import { ApplicationStatus } from '../types';

const Layout = () => {
  const { isAuthenticated, user, applications, notifications } = useStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const newApplications = applications.filter(app => app.status === ApplicationStatus.NEW);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden w-full relative">
        {/* GLOBAL TOAST NOTIFICATIONS */}
        <div className="fixed top-6 right-6 z-[70] space-y-3 pointer-events-none">
            {notifications.map(n => (
                <div key={n.id} className={`px-4 py-3 rounded-xl shadow-xl border flex items-center gap-3 text-sm font-medium animate-in slide-in-from-right fade-in duration-300 pointer-events-auto
                    ${n.type === 'success' ? 'bg-white border-green-100 text-gray-800' : 'bg-white border-red-100 text-gray-800'}`}>
                    <div className={`p-1 rounded-full ${n.type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                         {n.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    </div>
                    {n.message}
                </div>
            ))}
        </div>

        <header className="flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-border shadow-sm z-10">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu size={24} />
            </button>
            
            {/* Global Search (Mock) */}
            <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 text-gray-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Quick find..." 
                    className="pl-9 pr-4 py-1.5 bg-gray-50 border-none rounded-full text-sm focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all w-64"
                />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
                <button 
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 relative outline-none transition-colors"
                    onClick={() => setShowNotifications(!showNotifications)}
                >
                <Bell size={20} />
                {newApplications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
                </button>

                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-border py-2 z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">{newApplications.length} New</span>
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {newApplications.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">
                                    <Bell size={24} className="mx-auto mb-2 opacity-20" />
                                    No new notifications
                                </div>
                            ) : (
                                newApplications.slice(0, 5).map(app => (
                                    <div 
                                        key={app.id} 
                                        className="px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 group" 
                                        onClick={() => { navigate(`/applications/${app.id}`); setShowNotifications(false); }}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-bold text-gray-800 group-hover:text-primary transition-colors">{app.candidateName}</p>
                                            <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{app.appliedDate}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            Applied for <span className="font-medium text-gray-700">{app.jobTitle}</span>
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="px-4 py-2 border-t border-gray-100 text-center bg-gray-50/50 rounded-b-xl">
                            <button 
                                onClick={() => { navigate('/applications'); setShowNotifications(false); }} 
                                className="text-xs font-bold text-primary hover:text-primary-hover hover:underline uppercase tracking-wide"
                            >
                                View All Applications
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 pl-2 md:pl-4 md:border-l border-gray-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-700">{user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Role'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-2 ring-transparent hover:ring-primary/20 transition-all cursor-pointer">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;