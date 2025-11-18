import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { LayoutDashboard, Briefcase, Users, PlusCircle, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { logout } = useStore();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Jobs', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: 'Applications', path: '/applications', icon: <Users size={20} /> },
    { name: 'Create Job', path: '/jobs/new', icon: <PlusCircle size={20} /> },
  ];

  const isActive = (path) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 border-r border-border flex flex-col`}
    >
      <div className="flex items-center justify-center h-16 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center shadow-md shadow-primary/30">
            <Briefcase className="text-white" size={18} />
          </div>
          <span className="text-xl font-bold text-gray-800">Careers<span className="text-primary">Admin</span></span>
        </div>
      </div>

      <nav className="flex-1 mt-6 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={() => window.innerWidth < 768 && setIsOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-green-50 text-primary font-medium shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-primary hover:pl-5'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/settings"
          onClick={() => window.innerWidth < 768 && setIsOpen(false)}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
             isActive('/settings') ? 'bg-green-50 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
          }`}
        >
          <Settings size={20} />
          <span>Settings</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;