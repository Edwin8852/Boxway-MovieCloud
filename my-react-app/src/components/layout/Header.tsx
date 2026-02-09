import { Bell, Users, Briefcase, Building2, CreditCard, Settings as SettingsIcon, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import NotificationPopover from '@/components/ui/NotificationPopover';
import ClockAndCalendar from '@/components/ui/ClockAndCalendar';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  // Add props here if needed in the future
}

const Header: React.FC<HeaderProps> = () => {
  const { user } = useAuth();
  const { projects, payroll, staffPagination, clientPagination, projectPagination } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const location = useLocation();

  const getPageContext = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) {
      return {
        title: `Welcome back, ${user?.name.split(' ')[0]}!`,
        subtext: "Operational overview of your architectural pipeline.",
        icon: <LayoutDashboard className="w-3 h-3" />
      };
    }
    if (path.includes('/staff')) {
      return {
        title: "STAFF CONTROL CENTER",
        subtext: `Managing ${staffPagination.total || 0} professional team members across architectural departments.`,
        icon: <Users className="w-3 h-3" />
      };
    }
    if (path.includes('/clients')) {
      return {
        title: "CLIENT DIRECTORY",
        subtext: `Managing ${clientPagination.total || 0} active client accounts and their respective sites.`,
        icon: <Building2 className="w-3 h-3" />
      };
    }
    if (path.includes('/projects')) {
      if (path.split('/').length > 2) {
        return {
          title: "PROJECT INTELLIGENCE",
          subtext: "In-depth overview of the project roadmap and metrics.",
          icon: <Briefcase className="w-3 h-3" />
        };
      }
      return {
        title: "PROJECT PORTFOLIO",
        subtext: `Monitoring ${projectPagination.total || 0} architectural projects across delivery stages.`,
        icon: <Briefcase className="w-3 h-3" />
      };
    }
    if (path.includes('/payroll')) {
      return {
        title: "STAFF PAYROLL",
        subtext: "Overseeing staff compensation and attendance-based payouts.",
        icon: <CreditCard className="w-3 h-3" />
      };
    }
    if (path.includes('/settings')) {
      return {
        title: "SYSTEM SETTINGS",
        subtext: "Configure your architectural hub parameters and accounts.",
        icon: <SettingsIcon className="w-3 h-3" />
      };
    }
    return {
      title: "ARCHITECTURAL HUB",
      subtext: "Boxway MovieCloud Management System.",
      icon: null
    };
  };

  const context = getPageContext();

  return (
    <header className="h-24 bg-[#F6EFE6] border-b border-[#1F1F1F]/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 w-full transition-all duration-300">
      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
        <div className="border-l-2 border-primary pl-4 sm:pl-6 animate-in fade-in slide-in-from-left-4">
          <h2 className="text-xl sm:text-2xl font-display font-black text-[#1F1F1F] tracking-tighter leading-none mb-1">
            {context.title}
          </h2>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground flex items-center gap-2 font-medium">
            {context.icon} {context.subtext}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6 flex-shrink-0">
        <div className="hidden lg:block">
          <ClockAndCalendar />
        </div>

        {/* Notification Bell Only */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2.5 transition-all duration-300 rounded-full ${showNotifications ? 'bg-primary/10 text-primary' : 'text-[#1F1F1F]/60 hover:text-primary hover:bg-black/5'}`}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#CFAE70] rounded-full border-2 border-[#F6EFE6]" />
          </button>

          {showNotifications && (
            <NotificationPopover
              projects={projects}
              payroll={payroll}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
