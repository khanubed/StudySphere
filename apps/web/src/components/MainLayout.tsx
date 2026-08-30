import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  ChevronRight,
  FileCheck,
  FileSearch,
  Zap,
  Brain,
  History,
} from 'lucide-react';

interface SubNavItem {
  path: string;
  label: string;
  badge?: string;
  description?: string;
  icon: React.ElementType;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  children?: SubNavItem[];
}

export const MainLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen, theme } = useSelector((state: RootState) => state.ui);
  const { user } = useSelector((state: RootState) => state.auth);

  // AI Suite Accordion State
  const [aiMenuOpen, setAiMenuOpen] = useState(true);
  const [aiQuickSwitcherOpen, setAiQuickSwitcherOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  // Close quick switcher on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setAiQuickSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(clearCredentials());
    navigate('/login');
  };

  const aiToolsList: SubNavItem[] = [
    {
      path: '/ai/summarizer',
      label: 'AI Study Kit Summarizer',
      badge: '10-25 cr',
      description: 'Notes, flashcards, LaTeX formulas & mind maps',
      icon: Sparkles,
    },
    {
      path: '/ai/quiz/new',
      label: 'AI Quiz & Exam Simulator',
      badge: '14-30 cr',
      description: 'MCQ & conceptual quizzes with weak-topic diagnostics',
      icon: Brain,
    },
    {
      path: '/ai/assignment-helper',
      label: 'AI Assignment & Citation Helper',
      badge: '10 cr',
      description: 'Academic tone, grammar audit & APA/IEEE citations',
      icon: FileCheck,
    },
    {
      path: '/ai/resume-analyzer',
      label: 'AI Resume & ATS Analyzer',
      badge: '10 cr',
      description: 'ATS match score & keyword gap auditor',
      icon: FileSearch,
    },
    {
      path: '/planner',
      label: 'AI Study Schedule Planner',
      badge: '5 cr',
      description: 'Dynamic syllabus revision blocks & exam pacing',
      icon: Calendar,
    },
    {
      path: '/ai/quiz/history',
      label: 'Assessment History Ledger',
      badge: 'Archive',
      description: 'Past quiz attempts & accuracy breakdown',
      icon: History,
    },
  ];

  const getNavItems = (): NavItem[] => {
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
        {
          path: '/ai',
          label: 'AI Study Suite',
          icon: Sparkles,
          children: aiToolsList,
        },
        { path: '/faculty/quizzes/new', label: 'AI Quiz Creation', icon: Brain },
        { path: '/faculty/analytics', label: 'Class Analytics', icon: BarChart2 },
        { path: '/live-quiz/join', label: 'Live Quiz', icon: Radio },
        { path: '/profile', label: 'Profile', icon: User },
      ];
    }

    // Default: student / alumni
    return [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/resources', label: 'Resource Hub', icon: BookOpen },
      {
        path: '/ai',
        label: 'AI Study Suite',
        icon: Sparkles,
        children: aiToolsList,
      },
      { path: '/career', label: 'Career Hub', icon: Briefcase },
      { path: '/alumni', label: 'Alumni Connect', icon: Users },
      { path: '/coding', label: 'Coding Hub', icon: Code },
      { path: '/live-quiz/join', label: 'Live Quiz', icon: Radio },
      { path: '/profile', label: 'Profile', icon: User },
      { path: '/billing', label: 'Billing & Plans', icon: Wallet },
    ];
  };

  const navItems = getNavItems();
  
  // Detect if current path is an AI tool
  const isAiRoute =
    location.pathname.startsWith('/ai') ||
    location.pathname.startsWith('/quiz') ||
    location.pathname === '/planner';

  const activeAiTool = aiToolsList.find((tool) =>
    tool.path === '/ai/quiz/new'
      ? location.pathname.startsWith('/ai/quiz') || location.pathname.startsWith('/quiz')
      : location.pathname.startsWith(tool.path)
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground transition-colors duration-200">
      
      {/* ── 1. COLLAPSIBLE SIDEBAR ───────────────────────────────────── */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-16'
        } border-r border-border flex flex-col justify-between transition-all duration-300 bg-card/60 backdrop-blur-md sticky top-0 h-screen z-30`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Brand & Sidebar Toggle */}
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
                  <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {user.role}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-2 space-y-1 overflow-y-auto flex-1 custom-scrollbar">
            {navItems.map((item) => {
              const Icon = item.icon;

              // Check if item has children (AI Suite)
              if (item.children) {
                return (
                  <div key={item.label} className="space-y-1 pt-1 pb-1">
                    {/* Header Link */}
                    <div
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isAiRoute
                          ? 'bg-chalk/10 text-chalk font-semibold border border-chalk/30'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                      }`}
                    >
                      <Link
                        to="/ai"
                        className="flex items-center gap-3 flex-1 truncate"
                        title={!sidebarOpen ? item.label : undefined}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isAiRoute ? 'text-chalk' : ''}`} />
                        {sidebarOpen && <span>{item.label}</span>}
                      </Link>
                      {sidebarOpen && (
                        <button
                          type="button"
                          onClick={() => setAiMenuOpen(!aiMenuOpen)}
                          className="p-1 hover:bg-secondary/40 rounded flex items-center gap-1"
                        >
                          <span className="font-mono text-[9px] font-bold uppercase px-1 py-0.2 rounded bg-chalk/20 text-chalk">
                            {item.children.length}
                          </span>
                          {aiMenuOpen ? (
                            <ChevronDown className="w-3.5 h-3.5 text-graphite" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-graphite" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Sub-tools Accordion (When expanded) */}
                    {sidebarOpen && aiMenuOpen && (
                      <div className="pl-6 pr-1 space-y-0.5 border-l-2 border-chalk/20 ml-5 my-1">
                        {item.children.map((sub) => {
                          const SubIcon = sub.icon;
                          const isSubActive =
                            sub.path === '/ai/quiz/new'
                              ? location.pathname === '/ai/quiz/new' ||
                                (location.pathname.startsWith('/quiz') &&
                                  !location.pathname.includes('history'))
                              : location.pathname.startsWith(sub.path);

                          return (
                            <Link
                              key={sub.path}
                              to={sub.path}
                              className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                                isSubActive
                                  ? 'bg-chalk text-white font-bold shadow-xs'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                              }`}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">{sub.label}</span>
                              </div>
                              {sub.badge && (
                                <span
                                  className={`font-mono text-[8px] uppercase px-1 rounded ${
                                    isSubActive
                                      ? 'bg-white/20 text-white'
                                      : 'bg-secondary/40 text-graphite'
                                  }`}
                                >
                                  {sub.badge}
                                </span>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Standard Navigation Items
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

        {/* User Logout Footer */}
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

      {/* ── 2. MAIN APP CONTENT AREA ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Sticky Top Header Bar with AI Quick Switcher */}
        <header className="h-16 border-b border-border flex items-center justify-between px-4 sm:px-6 bg-background/80 backdrop-blur sticky top-0 z-20">
          
          <div className="flex items-center gap-3 min-w-0">
            {/* Contextual AI Quick Switcher Dropdown */}
            <div className="relative" ref={switcherRef}>
              <button
                type="button"
                onClick={() => setAiQuickSwitcherOpen(!aiQuickSwitcherOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-semibold transition-all ${
                  isAiRoute
                    ? 'border-chalk bg-chalk/10 text-chalk font-bold shadow-xs'
                    : 'border-border bg-secondary/15 text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-chalk fill-chalk" />
                <span className="font-mono uppercase tracking-wider">
                  {activeAiTool ? activeAiTool.label : 'AI Academic Tools'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-graphite ml-0.5" />
              </button>

              {/* Quick Switcher Dropdown Menu */}
              {aiQuickSwitcherOpen && (
                <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-lg border border-border bg-paper shadow-xl p-2 z-50 animate-in fade-in-50 zoom-in-95 space-y-1">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-border/60">
                    <span className="font-mono text-[10px] uppercase font-bold text-graphite">
                      SWITCH ACADEMIC AI TOOL
                    </span>
                    <span className="font-mono text-[9px] text-chalk font-semibold">
                      STUDY SUITE
                    </span>
                  </div>

                  <div className="space-y-1 pt-1 max-h-80 overflow-y-auto">
                    {aiToolsList.map((tool) => {
                      const ToolIcon = tool.icon;
                      const isCurrent =
                        tool.path === '/ai/quiz/new'
                          ? location.pathname === '/ai/quiz/new' ||
                            (location.pathname.startsWith('/quiz') &&
                              !location.pathname.includes('history'))
                          : location.pathname.startsWith(tool.path);

                      return (
                        <button
                          key={tool.path}
                          type="button"
                          onClick={() => {
                            setAiQuickSwitcherOpen(false);
                            navigate(tool.path);
                          }}
                          className={`w-full text-left p-2.5 rounded-md flex items-start justify-between gap-3 transition-colors ${
                            isCurrent
                              ? 'bg-chalk/15 border border-chalk/40 shadow-xs'
                              : 'hover:bg-secondary/30 border border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <div className="p-1.5 rounded bg-chalk/10 text-chalk mt-0.5">
                              <ToolIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-sans text-xs font-bold text-ink">
                                {tool.label}
                              </p>
                              <p className="font-sans text-[11px] text-graphite line-clamp-1">
                                {tool.description}
                              </p>
                            </div>
                          </div>

                          <span className="font-mono text-[9px] font-semibold px-1.5 py-0.5 rounded bg-secondary/40 text-graphite shrink-0">
                            {tool.badge}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
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

        {/* Main Content Area */}
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default MainLayout;
