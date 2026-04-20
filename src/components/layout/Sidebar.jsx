import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, LayoutList, Settings, Info, LogOut, Menu } from 'lucide-react';
import Logo from '../common/Logo';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logoutAuth } = React.useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAuth();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'New Report', icon: <PlusCircle size={20} />, path: '/new-report' },
    { name: 'My Complaints', icon: <LayoutList size={20} />, path: '/my-complaints' },
    { name: 'About Us', icon: <Info size={20} />, path: '/about' },
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
          <Logo size="sm" />
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
        
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
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
