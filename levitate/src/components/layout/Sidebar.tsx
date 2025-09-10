// levitate/src/components/layout/Sidebar.tsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Upload, 
  Database, 
  Merge, 
  Brain, 
  Download,
  BarChart3,
  LogIn, // Changed from LogOut
  User,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Upload Data', href: '/upload', icon: Upload },
  { name: 'Connect to DB', href: '/connect-db', icon: Database }, // Add this line
  { name: 'Data Cleaning', href: '/cleaning', icon: Database },
  { name: 'Data Merging', href: '/merging', icon: Merge },
  { name: 'AI Insights', href: '/insights', icon: Brain },
  { name: 'Charts', href: '/charts', icon: BarChart3 },
  { name: 'Export', href: '/export', icon: Download },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">
      <div className="flex items-center px-6 py-8">
        <div className="flex items-center">
          <div className="rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 p-2">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div className="ml-3">
            <h1 className="text-2xl font-bold text-white">Levitate</h1>
            <p className="text-sm text-slate-300">Data Management</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 px-4 pb-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto border-t border-slate-700">
        {user && (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 px-2">
              <User className="h-6 w-6 text-slate-400" />
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 bg-red-600/20 text-red-400 hover:bg-red-600/40 hover:text-red-300"
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};