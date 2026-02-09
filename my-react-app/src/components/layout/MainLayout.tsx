import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(window.innerWidth < 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-[#F6EFE6]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`transition-all duration-300 min-h-screen flex flex-col ${!sidebarCollapsed && !isMobile ? 'lg:ml-[260px]' : (isMobile ? 'ml-0' : 'lg:ml-[72px]')
          }`}
      >
        <Header />

        <main className="flex-1 px-4 sm:px-6 md:px-8 py-6 w-full max-w-full overflow-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Backdrop */}
      {!sidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
    </div>
  );
};

export default MainLayout;
