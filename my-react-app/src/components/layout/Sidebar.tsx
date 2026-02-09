import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  CreditCard,
  Settings,
  LogOut,
  ChevronRight,
  Menu,
} from 'lucide-react';
import { useAuth, type UserRole } from '@/context/AuthContext';

import Logo from '@/components/ui/Logo';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'architect', 'hr', 'accountant', 'intern'] },
  { path: '/staff', icon: Users, label: 'Staff', roles: ['admin', 'hr'] },
  { path: '/clients', icon: Briefcase, label: 'Clients', roles: ['admin', 'architect'] },
  { path: '/projects', icon: Building2, label: 'Projects', roles: ['admin', 'architect', 'intern'] },
  { path: '/payroll', icon: CreditCard, label: 'Payroll', roles: ['admin', 'accountant', 'hr'] },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const { user, logout } = useAuth();

  const filteredNavItems = navItems.filter(
    (item) => user && item.roles.includes(user.role)
  );

  // Helper for responsive checks in handlers
  const isMobile = () => window.innerWidth < 1024;

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#3E2C24] flex flex-col transition-all duration-300 z-40 ${collapsed
        ? 'w-0 -translate-x-full lg:w-[72px] lg:translate-x-0'
        : 'w-[260px] translate-x-0'
        } border-r border-white/5 shadow-2xl lg:shadow-none`}
    >
      {/* Logo */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-white/10 shrink-0">
        <div className={`flex items-center gap-3 text-white ${collapsed ? 'lg:hidden' : 'flex'}`}>
          <Logo size={24} />
          <span className="font-bold text-xl tracking-[0.1em] uppercase">Boxway</span>
        </div>

        {collapsed && (
          <div className="hidden lg:flex items-center justify-center mx-auto text-white">
            <Logo size={28} />
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {filteredNavItems.map((item) => {
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (isMobile()) onToggle();
              }}
              className={({ isActive }) => `
                flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 group
                ${isActive
                  ? 'bg-white/5 text-[#CFAE70] border-r-2 border-[#CFAE70]'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }
                ${collapsed ? 'lg:justify-center lg:px-0' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className={`truncate ${collapsed ? 'lg:hidden' : 'block'}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 shrink-0">
        {user && ['admin', 'architect', 'hr', 'accountant'].includes(user.role) && (
          <NavLink
            to="/settings"
            onClick={() => {
              if (isMobile()) onToggle();
            }}
            className={({ isActive }) => `
              flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 mb-2
              ${isActive
                ? 'bg-white/5 text-[#CFAE70] border-r-2 border-[#CFAE70]'
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }
              ${collapsed ? 'lg:justify-center lg:px-0' : ''}
            `}
            title={collapsed ? 'Settings' : undefined}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className={`${collapsed ? 'lg:hidden' : 'block'}`}>Settings</span>
          </NavLink>
        )}

        {user && (
          <div className={`flex items-center gap-3 px-3 py-3 mb-4 bg-white/5 rounded-lg border border-white/5 ${collapsed ? 'lg:hidden' : 'flex'}`}>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-white uppercase tracking-wider truncate">{user.name}</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className={`
            flex items-center gap-4 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300
            text-white/40 hover:text-red-400 hover:bg-red-400/5 w-full rounded-lg
            ${collapsed ? 'lg:justify-center lg:px-0' : ''}
          `}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          <span className={`${collapsed ? 'lg:hidden' : 'block'}`}>Logout</span>
        </button>
      </div>

      {/* Collapse Toggle (only desktop) */}
      {collapsed && (
        <button
          onClick={onToggle}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-[#3E2C24] rounded-full border border-white/10 items-center justify-center hover:bg-white/10 transition-colors z-50 shadow-lg"
        >
          <ChevronRight className="w-4 h-4 text-white/50" />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
