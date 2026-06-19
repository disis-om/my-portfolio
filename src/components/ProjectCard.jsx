import React, { useRef, useState, useEffect } from 'react';
import { flushSync } from 'react-dom';

export default function ProjectCard({ project, index, onCardSelect, audioControls }) {
  const { playClick } = audioControls;
  const videoRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const isVideo = project.mediaSrc.endsWith('.mp4');

  useEffect(() => {
    // Highly optimized intersection observer to pause videos when out of view
    const video = videoRef.current;
    if (!video) return;

    let observer;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !isPaused) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      }, { threshold: 0.1 });
      
      observer.observe(video);
    } else {
      video.play().catch(() => {});
    }

    return () => {
      if (observer && video) {
        observer.unobserve(video);
      }
    };
  }, [isPaused]);

  const togglePlay = (e) => {
    e.preventDefault();
    e.stopPropagation();
    playClick();

    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPaused(false);
    } else {
      video.pause();
      setIsPaused(true);
    }
  };

  const badgeClass = (status) => {
    const s = status.toUpperCase();
    if (s.includes('DOWN')) {
      return 'badge live live--new';
    }
    if (s.includes('PAUSED')) {
      return 'badge upcoming';
    }
    if (s.includes('COMING SOON') || s === 'UPCOMING' || s === 'UPCOMING MODELS') {
      return 'badge upcoming';
    }
    switch (s) {
      case 'NEW':
        return 'badge live live--new';
      case 'LIVE':
        return 'badge live';
      case 'UPCOMING':
      case 'UPCOMING MODELS':
        return 'badge upcoming';
      default:
        return 'badge muaaz';
    }
  };

  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  return (
    <div 
      className="stack-sheet-card card" 
      data-project-slug={slug}
      onClick={(e) => {
        // Only trigger details expansion if they didn't click external links directly
        if (e.target.closest('a') && !e.target.closest('.view')) return;
        e.preventDefault();

        const card = e.currentTarget;
        if (!document.startViewTransition) {
          onCardSelect(project);
          return;
        }

        card.style.viewTransitionName = 'project-morph';
        
        const transition = document.startViewTransition(() => {
          card.style.viewTransitionName = '';
          flushSync(() => {
            onCardSelect(project);
          });
        });

        transition.finished.finally(() => {
          card.style.viewTransitionName = '';
        });
      }}
      data-modal-type={isVideo ? 'video' : 'image'}
      data-modal-src={project.mediaSrc}
      style={{ zIndex: index + 10 }}
    >
      {/* Top Media panel */}
      <div className="card-image">
        {isVideo ? (
          <>
            <video 
              ref={videoRef}
              src={project.mediaSrc} 
              autoPlay 
              loop 
              muted 
              playsInline 
              preload="auto"
            />
            <button 
              onClick={togglePlay}
              className={`video-control-btn ${isPaused ? 'is-paused' : ''}`} 
              aria-label="Toggle video play state"
            >
              {isPaused ? (
                <svg className="play-icon" viewBox="0 0 24 24">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
              ) : (
                <svg className="pause-icon" viewBox="0 0 24 24">
                  <rect x="5" y="4" width="4" height="16" rx="1" />
                  <rect x="15" y="4" width="4" height="16" rx="1" />
                </svg>
              )}
            </button>
          </>
        ) : (
          <div 
            className="w-full h-full" 
            style={{ 
              backgroundImage: `url(${project.mediaSrc})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              width: '100%',
              height: '100%'
            }}
          />
        )}
      </div>

      {/* Content description details */}
      <div className="card-content">
        <div className="top-row">
          <span className={badgeClass(project.status)}>{project.status}</span>
          <span className="year">{project.year}</span>
        </div>
        
        <div className="flex flex-col mt-2">
          <h3>{project.title}</h3>
          <p>{project.desc}</p>
        </div>

        <div className="tags">
          {project.tags.map((tag, i) => (
            <span key={i}>{tag}</span>
          ))}
        </div>

        <div className="card-buttons">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="view"
            onClick={(e) => {
              e.stopPropagation();
              playClick();
            }}
          >
            View
          </a>
        </div>
      </div>
    </div>
  );
}
