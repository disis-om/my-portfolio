import React, { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function ProjectDetails({ project, onClose, audioControls }) {
  const { playClick } = audioControls;
  const [activeTab, setActiveTab] = useState('case-study');
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);
  const [vtName, setVtName] = useState('project-morph');

  const slug = project ? project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '';
  const isVideo = project ? project.mediaSrc.endsWith('.mp4') : false;

  const handleClose = () => {
    playClick();
    if (!project) return;

    if (!document.startViewTransition) {
      onClose();
      return;
    }

    const expandedView = document.getElementById('expanded-project-view');
    if (expandedView) {
      expandedView.style.viewTransitionName = 'project-morph';
    }

    // Find card with matching slug to morph back to
    const cardEl = document.querySelector(`.stack-sheet-card.card[data-project-slug="${slug}"]`);

    const transition = document.startViewTransition(() => {
      if (expandedView) {
        expandedView.style.viewTransitionName = '';
      }
      if (cardEl) {
        cardEl.style.viewTransitionName = 'project-morph';
      }
      flushSync(() => {
        onClose();
      });
    });

    transition.finished.finally(() => {
      if (cardEl) {
        cardEl.style.viewTransitionName = '';
      }
    });
  };

  useEffect(() => {
    if (project) {
      setVtName('project-morph');
      document.body.style.overflow = 'hidden';
      // Trigger animations
      const animTimer = setTimeout(() => {
        setIsAnimatingIn(true);
      }, 50);

      // Clear view transition name after mounting
      const timer = setTimeout(() => {
        setVtName('');
      }, 800);
      return () => {
        clearTimeout(timer);
        clearTimeout(animTimer);
        document.body.style.overflow = '';
      };
    } else {
      setIsAnimatingIn(false);
      document.body.style.overflow = '';
    }
  }, [project]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, slug]);

  if (!project) return null;

  const handleTabChange = (tabId) => {
    playClick();
    setActiveTab(tabId);
  };

  return (
    <div 
      id="expanded-project-view" 
      className={`expanded-view active ${isAnimatingIn ? 'animating-in' : ''}`}
      data-project={slug}
      aria-hidden={!project}
      style={{ viewTransitionName: vtName || undefined }}
    >
      {/* Floating close button */}
      <button 
        onClick={handleClose}
        className="expanded-close border-none" 
        aria-label="Close expanded view"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div className="expanded-content-scroll">
        {/* Hero image area */}
        {isVideo ? (
          <div className="expanded-hero relative overflow-hidden bg-black h-[50vh] w-full">
            <video 
              src={project.mediaSrc} 
              autoPlay 
              loop 
              muted 
              playsInline 
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </div>
        ) : (
          <div 
            className="expanded-hero" 
            style={{ backgroundImage: `url(${project.mediaSrc})` }}
          />
        )}

        {/* Details card content */}
        <div className="expanded-body">
          <div className="expanded-top-row">
            <span className="year" style={{ color: 'var(--text-tertiary)', fontWeight: 600 }}>{project.year}</span>
          </div>

          <h2 className="expanded-title">{project.title}</h2>
          
          <div className="expanded-tags">
            {project.tags.map((tag, i) => (
              <span key={i}>{tag}</span>
            ))}
          </div>

          <p className="expanded-desc">{project.desc}</p>

          {/* Deep Content Case study tabs */}
          <div className="expanded-deep-content">
            <div className="xray-toggle-container">
              <button 
                onClick={() => handleTabChange('case-study')}
                className={`xray-toggle ${activeTab === 'case-study' ? 'active' : ''}`}
              >
                Case Study
              </button>
              <button 
                onClick={() => handleTabChange('architecture')}
                className={`xray-toggle ${activeTab === 'architecture' ? 'active' : ''}`}
              >
                X-Ray Architecture
              </button>
            </div>

            {activeTab === 'case-study' ? (
              <div id="content-case-study" className="xray-content active">
                <p>This project pushed the boundaries of what is possible with modern web technologies and
                  custom AI models. We engineered a highly scalable architecture focused on ultra-low latency and
                  maximum developer ergonomics. Through dynamic interfaces and custom components, this showcase delivers 
                  seamless micro-interactions and high-performance loading scales across various layout matrices.</p>
              </div>
            ) : (
              <div id="content-architecture" className="xray-content active">
                <div className="skeleton-diagram">
                  <div className="skel-box">Client</div>
                  <div className="skel-arrow">&rarr;</div>
                  <div className="skel-box">API Gateway</div>
                  <div className="skel-arrow">&rarr;</div>
                  <div className="skel-box">Neural Engine</div>
                  <div className="skel-arrow">&rarr;</div>
                  <div className="skel-box">Render Pipeline</div>
                </div>
              </div>
            )}
          </div>

          {/* Action button */}
          <div className="expanded-actions">
            <a 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-tactile cursor-pointer"
              style={{ textDecoration: 'none', display: 'inline-block', padding: '12px 24px' }}
              onClick={playClick}
            >
              View Live Project
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
