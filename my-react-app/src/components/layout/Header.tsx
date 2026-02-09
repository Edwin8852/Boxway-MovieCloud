import { Bell } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import NotificationPopover from '@/components/ui/NotificationPopover';
import ClockAndCalendar from '@/components/ui/ClockAndCalendar';
import { useState } from 'react';

interface HeaderProps {
  // Add props here if needed in the future
}

const Header: React.FC<HeaderProps> = () => {
  const { user } = useAuth();
  const { projects, payroll } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-[#F6EFE6] border-b border-[#1F1F1F]/10 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 w-full">
      <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0">
        <div className="border-l-2 border-[#6B8E23] pl-4 sm:pl-6 animate-in fade-in slide-in-from-left-4">
          <p className="text-[9px] font-bold text-[#8E8E8E] uppercase tracking-[0.2em] leading-none mb-1">Architectural Hub</p>
          <h2 className="text-base sm:text-xl font-display font-black text-[#1F1F1F] tracking-tighter">
            Welcome back, {user?.name.split(' ')[0]}!
          </h2>
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
