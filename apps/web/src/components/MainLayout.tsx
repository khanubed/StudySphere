import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleSidebar, toggleTheme } from '../store/uiSlice';
import { clearCredentials } from '../store/authSlice';
import { TokenUsageIndicator } from './TokenUsageIndicator';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  FolderKanban,
  BookOpen,
  Calendar,
  Code,
  User,
  Bell,
  Wallet,
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/resources', label: 'Resource Hub', icon: BookOpen },
    { path: '/ai/summarizer', label: 'AI Summarizer', icon: FolderKanban },
    { path: '/planner', label: 'Study Planner', icon: Calendar },
    { path: '/coding', label: 'Coding Hub', icon: Code },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/billing', label: 'Billing & Plans', icon: Wallet },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-60' : 'w-16'
        } border-r border-border flex flex-col justify-between transition-all duration-300 bg-muted/30`}
      >
        <div>
          <div className="h-16 flex items-center px-4 border-b border-border gap-3">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-1.5 hover:bg-muted rounded-button transition-colors"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
            {sidebarOpen && (
              <span className="font-bold text-lg text-primary tracking-tight">StudySphere</span>
            )}
          </div>

          <nav className="p-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-button text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-2 border-t border-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-button text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-lg">
              {navItems.find((n) => n.path === location.pathname)?.label || 'StudySphere'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <TokenUsageIndicator />

            <Link
              to="/notifications"
              className="p-2 text-muted-foreground hover:text-foreground rounded-button transition-colors"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 text-muted-foreground hover:text-foreground rounded-button transition-colors"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium hidden md:inline">{user?.name || 'User'}</span>
            </div>
          </div>
        </header>

        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
