import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleSidebar, toggleTheme } from '../store/slices/uiSlice';
import { clearCredentials } from '../store/slices/authSlice';
import { TokenUsageIndicator } from './TokenUsageIndicator';
import {
  Menu,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  Sparkles,
  BookOpen,
  Calendar,
  Code,
  User,
  Bell,
  Wallet,
  Briefcase,
  Users,
  Radio,
  Megaphone,
  BarChart2,
  ShieldCheck,
  CreditCard,
  Building,
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

  const getNavItems = () => {
    const role = user?.role || 'student';

    if (role === 'admin') {
      return [
        { path: '/admin', label: 'Admin Overview', icon: LayoutDashboard },
        { path: '/admin/moderation', label: 'Moderation Queue', icon: ShieldCheck },
        { path: '/admin/users', label: 'User Management', icon: Users },
        { path: '/admin/analytics', label: 'Platform Analytics', icon: BarChart2 },
        { path: '/admin/billing/plans', label: 'Plans & Token Config', icon: CreditCard },
        { path: '/admin/institutions', label: 'Institutions', icon: Building },
        { path: '/profile', label: 'Profile', icon: User },
      ];
    }

    if (role === 'faculty') {
      return [
        { path: '/faculty', label: 'Faculty Overview', icon: LayoutDashboard },
        { path: '/faculty/announcements', label: 'Announcements', icon: Megaphone },
        { path: '/faculty/resources', label: 'Course Resources', icon: BookOpen },
        { path: '/faculty/quizzes/new', label: 'AI Quiz Creation', icon: Sparkles },
        { path: '/faculty/analytics', label: 'Class Analytics', icon: BarChart2 },
        { path: '/live-quiz/join', label: 'Live Quiz', icon: Radio },
        { path: '/profile', label: 'Profile', icon: User },
      ];
    }

    // Default: student / alumni
    return [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/resources', label: 'Resource Hub', icon: BookOpen },
      { path: '/ai/summarizer', label: 'AI Summarizer', icon: Sparkles },
      { path: '/planner', label: 'Study Planner', icon: Calendar },
      { path: '/career', label: 'Career Hub', icon: Briefcase },
      { path: '/alumni', label: 'Alumni Connect', icon: Users },
      { path: '/coding', label: 'Coding Hub', icon: Code },
      { path: '/live-quiz/join', label: 'Live Quiz', icon: Radio },
      { path: '/profile', label: 'Profile', icon: User },
      { path: '/billing', label: 'Billing & Plans', icon: Wallet },
    ];
  };

  const navItems = getNavItems();
  const currentTitle =
    navItems.find((n) => location.pathname.startsWith(n.path))?.label ||
    'StudySphere';

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } border-r border-border flex flex-col justify-between transition-all duration-300 bg-card/60 backdrop-blur-md sticky top-0 h-screen z-30`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <div className="h-16 flex items-center px-4 border-b border-border gap-3 shrink-0">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 hover:bg-muted rounded-md transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            {sidebarOpen && (
              <div className="flex items-center gap-2 truncate">
                <span className="font-extrabold text-lg text-primary tracking-tight">
                  StudySphere
                </span>
                {user?.role && (
                  <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    {user.role}
                  </span>
                )}
              </div>
            )}
          </div>

          <nav className="p-2 space-y-1 overflow-y-auto flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === '/dashboard' || item.path === '/admin' || item.path === '/faculty'
                  ? location.pathname === item.path
                  : location.pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  title={!sidebarOpen ? item.label : undefined}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-2 border-t border-border shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur sticky top-0 z-20">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="font-semibold text-lg truncate">{currentTitle}</h1>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <TokenUsageIndicator />

            <Link
              to="/notifications"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <Link
              to="/profile"
              className="flex items-center gap-2 pl-2 border-l border-border hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm font-medium hidden md:inline max-w-[120px] truncate">
                {user?.name || 'User'}
              </span>
            </Link>
          </div>
        </header>

        <main className="flex-grow p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
