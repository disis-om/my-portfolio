import React, { useState, useEffect, useRef } from 'react';

export default function Navbar({
  theme,
  onThemeChange,
  consoleActive,
  onConsoleToggle,
  onContactToggle,
  audioControls,
  children
}) {
  const { isMuted, toggleMute, playClick } = audioControls;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [activeLink, setActiveLink] = useState('projects');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  
  const containerRef = useRef(null);
  const indicatorRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);

  const themes = {
    cream: { label: "Warm Cream", color: "#4f46e5" },
    kernel: { label: "Retro Kernel", color: "#27C93F" },
    swiss: { label: "Stark Swiss", color: "#FFBD2E" },
    cyber: { label: "Tokyo Cyberpunk", color: "#d946ef" },
    spruce: { label: "Forest Spruce", color: "#4ade80" }
  };

  // Align magnet indicator behind the active link
  const alignIndicator = (ref) => {
    if (!ref || !indicatorRef.current || !containerRef.current) return;
    const linkRect = ref.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const leftPos = linkRect.left - containerRect.left;
    const width = linkRect.width;
    indicatorRef.current.style.left = `${leftPos}px`;
    indicatorRef.current.style.width = `${width}px`;
  };

  // Horizon Smart Sticky Header Engine Scroll listener
  useEffect(() => {
    if (menuActive || consoleActive) {
      setIsHidden(false);
      return;
    }

    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

          // 1. Dynamic scale compress state trigger
          if (currentScrollY > 40) {
            setIsScrolled(true);
          } else {
            setIsScrolled(false);
          }

          // 2. Absolute hiding trajectory calculations
          if (currentScrollY > lastScrollY && currentScrollY > 90) {
            setIsHidden(true);
          } else {
            setIsHidden(false);
          }

          lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuActive, consoleActive]);

  // Initial and window resize alignment
  useEffect(() => {
    const timer = setTimeout(() => {
      const targetRef = activeLink === 'projects' ? projectsRef.current : contactRef.current;
      alignIndicator(targetRef);
    }, 100);
    return () => clearTimeout(timer);
  }, [activeLink]);

  useEffect(() => {
    const handleResize = () => {
      const targetRef = activeLink === 'projects' ? projectsRef.current : contactRef.current;
      alignIndicator(targetRef);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeLink]);

  // Click outside listener for theme dropdown
  useEffect(() => {
    const handleClickOutside = () => {
      setDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLinkClick = (e, linkName, targetId) => {
    e.preventDefault();
    playClick();
    setActiveLink(linkName);
    
    if (linkName === 'contact') {
      onContactToggle();
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleMobileLinkClick = (e, action) => {
    e.preventDefault();
    setMenuActive(false);
    document.body.style.overflow = '';
    playClick();
    action();
  };

  const toggleMobileMenu = () => {
    playClick();
    const nextState = !menuActive;
    setMenuActive(nextState);
    if (nextState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  return (
    <header 
      id="nav-wrapper" 
      className={`horizon-sticky-header ${menuActive ? 'is-menu-active' : ''} ${consoleActive ? 'is-terminal-active' : ''} ${isScrolled ? 'is-scrolled' : ''} ${isHidden ? 'is-hidden' : ''}`}
    >
      <div className="ribbon-flex-row">
        {/* Brand logo (Left) */}
        <a 
          href="#" 
          className="pl-4 flex items-center gap-2 group" 
          style={{ textDecoration: 'none' }}
          onClick={(e) => {
            e.preventDefault();
            playClick();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <span className="brand-mark text-xl text-[var(--text-primary)] uppercase">OM.DEV</span>
        </a>

        {/* Desktop navigation (Center) */}
        <div 
          ref={containerRef}
          className="hidden md:flex items-center relative nav-links-container"
          style={{ listStyle: 'none', margin: 0, padding: 0 }}
          onMouseLeave={() => {
            const activeRef = activeLink === 'projects' ? projectsRef.current : contactRef.current;
            alignIndicator(activeRef);
          }}
        >
          {/* Magnet Slide Indicator */}
          <div className="nav-indicator" id="mag-indicator" ref={indicatorRef}></div>

          <a 
            ref={projectsRef}
            href="#featured-projects" 
            className={`nav-link ${activeLink === 'projects' ? 'active' : ''}`} 
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => alignIndicator(projectsRef.current)}
            onClick={(e) => handleLinkClick(e, 'projects', 'featured-projects')}
          >
            Projects
          </a>
          <a 
            ref={contactRef}
            href="#contact" 
            className={`nav-link ${activeLink === 'contact' ? 'active' : ''}`} 
            style={{ textDecoration: 'none' }}
            onMouseEnter={() => alignIndicator(contactRef.current)}
            onClick={(e) => handleLinkClick(e, 'contact', 'contact')}
          >
            Contact
          </a>
        </div>

        {/* Action button menu (Right) */}
        <div className="pr-2 hidden md:flex items-center gap-3">
          <button 
            onClick={() => { playClick(); onConsoleToggle(); }}
            className="btn-dev-mode px-4 py-2 text-xs border border-solid border-black rounded-full cursor-pointer bg-transparent hover:bg-black hover:text-white transition-colors duration-300 mr-1"
            style={{ fontFamily: 'monospace', fontWeight: 'bold' }}
          >
            [⌥ Dev Mode]
          </button>
          <a 
            href="mailto:ommanav.mail@gmail.com" 
            className="btn-tactile px-5 py-2.5 text-sm"
            style={{ textDecoration: 'none', display: 'inline-block' }}
            onClick={(e) => {
              e.preventDefault();
              playClick();
              onContactToggle();
            }}
          >
            Let's Talk
          </a>
        </div>

        {/* Audio feedback and visual themes switcher */}
        <div 
          className="theme-dropdown-container hidden md:flex"
          style={{ position: 'relative', alignItems: 'center', marginRight: '8px', gap: '8px' }}
        >
          <button 
            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
            className="theme-dropdown-trigger" 
            aria-label="Toggle audio feedback"
          >
            {!isMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="23" y1="9" x2="17" y2="15"></line>
                <line x1="17" y1="9" x2="23" y2="15"></line>
              </svg>
            )}
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              playClick();
              setDropdownOpen(!dropdownOpen);
            }}
            className="theme-dropdown-trigger" 
            aria-label="Select visual theme"
            style={{ marginRight: 0 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="7" r="1.5" fill="currentColor" />
              <circle cx="8" cy="13" r="1.5" fill="currentColor" />
              <circle cx="16" cy="13" r="1.5" fill="currentColor" />
            </svg>
          </button>

          {/* Theme dropdown menu */}
          <div className={`theme-dropdown-menu ${dropdownOpen ? 'open' : ''}`}>
            {Object.entries(themes).map(([themeId, info]) => (
              <button 
                key={themeId}
                className={`theme-menu-item ${theme === themeId ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onThemeChange(themeId);
                  setDropdownOpen(false);
                }}
              >
                <span className="color-preview" style={{ background: info.color }}></span>
                {info.label}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile menu trigger */}
        <button 
          onClick={toggleMobileMenu}
          className="curtain-toggle-btn" 
          type="button"
          aria-label="Toggle mobile menu" 
          aria-expanded={menuActive}
        >
          <span className="hamburger-wire"></span>
        </button>
      </div>

      {/* Curtain slide panel for Mobile menu */}
      <nav className="kinetic-curtain-drawer" aria-label="Mobile Navigation Drawer">
        <div className="kinetic-curtain-drawer-inner">
          <a 
            href="#featured-projects" 
            className="curtain-link-node"
            onClick={(e) => handleMobileLinkClick(e, () => {
              const el = document.getElementById('featured-projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              setActiveLink('projects');
            })}
          >
            Projects
          </a>
          <a 
            href="#contact" 
            className="curtain-link-node"
            onClick={(e) => handleMobileLinkClick(e, onContactToggle)}
          >
            Contact
          </a>
          <a 
            href="mailto:ommanav.mail@gmail.com" 
            className="curtain-link-node" 
            style={{ color: 'var(--accent)' }}
            onClick={(e) => handleMobileLinkClick(e, onContactToggle)}
          >
            Let's Talk
          </a>
          <a 
            href="#" 
            className="curtain-link-node"
            style={{ fontFamily: 'monospace', color: 'var(--accent)' }}
            onClick={(e) => handleMobileLinkClick(e, onConsoleToggle)}
          >
            [⌥ Dev Mode]
          </a>
          <a 
            href="#" 
            className="curtain-link-node"
            style={{ fontFamily: 'monospace', color: 'var(--accent)' }}
            onClick={(e) => handleMobileLinkClick(e, toggleMute)}
          >
            {isMuted ? '[🔈 Sound: Muted]' : '[🔊 Sound: Active]'}
          </a>

          {/* Theme selector block for mobile */}
          <div 
            className="curtain-link-node curtain-theme-section"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px' }}
          >
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 700, width: '100%', textAlign: 'left', marginBottom: '2px' }}>
              Visual Kernel Theme
            </div>
            <div className="mobile-themes-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', width: '100%' }}>
              {Object.entries(themes).map(([themeId, info]) => (
                <button 
                  key={themeId}
                  className={`theme-menu-item mobile-theme-btn ${theme === themeId ? 'active' : ''}`} 
                  onClick={(e) => {
                    e.stopPropagation();
                    onThemeChange(themeId);
                    setMenuActive(false);
                    document.body.style.overflow = '';
                  }}
                  style={{ 
                    flex: '1', 
                    minWidth: '90px', 
                    justifyContent: 'center', 
                    border: 'var(--card-border-width) solid var(--border-card)', 
                    borderRadius: '99px', 
                    background: 'rgba(11, 12, 14, 0.04)', 
                    padding: '8px 12px', 
                    margin: 0, 
                    outline: 'none', 
                    boxShadow: 'none' 
                  }}
                >
                  <span className="color-preview" style={{ background: info.color }}></span>
                  {themeId.charAt(0).toUpperCase() + themeId.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {children}
    </header>
  );
}
