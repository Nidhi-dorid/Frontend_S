import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LayoutList, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from './ThemeProvider';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logoutAuth } = React.useContext(AuthContext);
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAuth();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'New Report', icon: <PlusCircle size={20} />, path: '/new-report' },
    { name: 'My Complaints', icon: <LayoutList size={20} />, path: '/my-complaints' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <div className={`fixed inset-y-0 left-0 bg-brand-navy text-white w-64 flex flex-col transform transition-transform duration-300 z-30 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:static`}>
        <div className="p-6 text-2xl font-bold flex items-center gap-2 border-b border-white/10">
          <div className="w-8 h-8 bg-brand-orange rounded-lg flex items-center justify-center text-white text-sm">S</div>
          SCRS
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white/10 text-brand-orange border-l-4 border-brand-orange' 
                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-white/10 space-y-2">
          {/* Theme Toggle Button */}
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex items-center justify-between px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
              <span className="font-medium">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className="w-8 h-4 bg-black/30 rounded-full relative shadow-inner">
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-300 ${theme === 'dark' ? 'right-0.5' : 'left-0.5'}`} />
            </div>
          </button>

          {/* Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-300 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
