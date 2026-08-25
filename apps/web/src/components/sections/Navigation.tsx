import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { toggleTheme } from '../../store/uiSlice';
import { Sun, Moon } from 'lucide-react';

const navItems = [
  { label: 'Product', href: '#modules' },
  { label: 'Resources', href: '#resources' },
  { label: 'Career', href: '#career' },
  { label: 'Alumni', href: '#alumni' },
  { label: 'Pricing', href: '#pricing' },
];

export const Navigation: React.FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-paper/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2" aria-label="StudySphere Home">
          {/* Hexagonal Node Brand Mark (Single color in Quad green) */}
          <svg className="w-6 h-6 text-quad" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
          <span className="font-display font-extrabold text-ink text-xl tracking-tight">StudySphere</span>
          <span className="font-mono text-[10px] text-graphite uppercase tracking-widest hidden sm:inline-block pt-1">ACADEMIC OS</span>
        </Link>

        {/* Center: Geist font Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-sans text-[14px] font-medium text-graphite hover:text-ink transition-colors duration-200 relative py-1 group"
            >
              {item.label}
              <span className="absolute bottom-0 left-0 h-[1.5px] w-0 bg-quad transition-all duration-350 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Side: Theme Toggle + Login + Get Started */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch(toggleTheme())}
            className="p-2 rounded-md hover:bg-secondary text-graphite hover:text-ink transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          
          <Link
            to="/login"
            className="font-sans text-[14px] font-medium text-graphite hover:text-ink transition-colors duration-200"
          >
            Log in
          </Link>
          
          <Link
            to="/register"
            className="bg-quad text-paper hover:opacity-90 font-sans text-[14px] font-semibold px-4 py-2 rounded-[6px] transition-all duration-200"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
};