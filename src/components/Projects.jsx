import React, { useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';

const getExpectedDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const PROJECTS_DATA = [
  {
    title: "Strophe AI",
    status: "Currently Down",
    year: "2026",
    desc: "Strophe is an all-in-one AI companion featuring specialized modes for coding, studying, and general chat, utilizing top-tier models like GPT-4o and Claude. It offers integrated productivity tools such as a Pomodoro timer, auto-generated flashcards, and live code previews to streamline developer and student workflows.",
    tags: ["AI", "Full-Stack", "Affordable"],
    url: "https://strophe.abacusai.app",
    mediaSrc: "/assets/strophe.png"
  },
  {
    title: "Clarimap",
    status: `Coming Soon Expected Date: ${getExpectedDate()}`,
    year: "2026",
    desc: "An AI-powered visualization engine that instantly translates complex code, system architectures, and study concepts into interactive diagrams. Built to decode heavy logic into clear, visual workflows in real-time for both developers and learners.",
    tags: ["Logic visualizer", "Universal Input", "Instant Mapping"],
    url: "https://clarimap.edgeone.app",
    mediaSrc: "/videos/clarimapvideo.mp4"
  },
  {
    title: "Rivelo AI",
    status: "Project Paused",
    year: "2026",
    desc: "Rivelo is a high-performance AI workspace that features four distinct \"personas\" tailored for general tasks, speed, full-stack coding, and complex reasoning. It offers a \"bring-your-own-model\" approach via OpenRouter integration, supporting vision, voice input, and local history for a privacy-first, builder-centric experience.",
    tags: ["Dashboard", "Frontend", "Personas"],
    url: "https://riveloai.edgeone.app",
    mediaSrc: "/videos/rivelovideo.mp4"
  },
  {
    title: "Custom LLM Family",
    status: "Upcoming Models",
    year: "2025-2026",
    desc: "Strophe is a custom-built LLM family featuring a reasoning-first architecture and bespoke tokenizer. It scales from the edge-optimized Strophe 1 to the frontier-grade Aion, designed for everything from fast local tasks to complex research.",
    tags: ["Reasoning", "M1-Strophe1", "M2-Antistrophe", "M3-Strophe Aion"],
    url: "https://strophe.edgeone.app",
    mediaSrc: "/assets/strophemodel.png"
  },
  {
    title: "Sunday Cups",
    status: "UI-Design",
    year: "2026",
    desc: "Sunday Cups — A premium UI/UX showcase blending intentional white space with editorial layout design to redefine how we discover the \"perfect pour.\"",
    tags: ["Premium Design", "Frontend", "Demo-Site"],
    url: "https://sundaycups.netlify.app",
    mediaSrc: "/assets/sundaycups.png"
  },
  {
    title: "Codecamy",
    status: "UI-Design",
    year: "2026",
    desc: "Codecamy — A sleek UI/UX project that emphasizes visual clarity and a bold digital identity, crafted to deliver an intuitive user journey for aspiring software developers.",
    tags: ["Premium Design", "Frontend", "Demo-Site"],
    url: "https://codecamy.edgeone.app",
    mediaSrc: "/assets/codecamy.png"
  },
  {
    title: "Prompchitect",
    status: "Sophisticated AI Tool",
    year: "2026",
    desc: "Promchitect — Advanced AI Orchestration Dashboard > An elite utility tool for prompt architects, featuring a dynamic Model Control system with access to 350+ LLMs via OpenRouter. This project showcases deep integration of state management and real-time API orchestration, wrapped in a sophisticated, dark-themed interface designed for maximum productivity.",
    tags: ["Prompt Engineering", "Visual Hierarchy"],
    url: "https://prompchitect.edgeone.app",
    mediaSrc: "/videos/prompchitectvideo.mp4"
  },

  {
    title: "Muaazfoods",
    status: "UI-Design",
    year: "2026",
    desc: "Muaaz Foods — A Culinary Editorial Experience. A premium, typography-driven digital menu designed with a \"Volume I\" editorial concept. This project redefines traditional restaurant branding by blending high-end aesthetic layouts with a modern, minimalist interface to create a \"Modern Culinary Soul\" for the northern palate.",
    tags: ["Premium Design", "Frontend", "Demo-Site", "Clean Minimalism"],
    url: "https://muaazfoodz.edgeone.app",
    mediaSrc: "/assets/muaazfoods.png"
  }

];

export default function Projects({ onCardSelect, audioControls }) {
  const parentRef = useRef(null);

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const stackCards = parent.querySelectorAll('.stack-sheet-card');
    if (!stackCards.length) return;

    let cardMetrics = [];
    let targetTop = 112;
    let footerMetric = null;
    const footerEl = document.querySelector('.shutter-footer');

    const updateLayoutMetrics = () => {
      // Temporarily set to relative to measure original vertical positions without sticky offsets
      stackCards.forEach(card => {
        card.style.position = 'relative';
      });

      const targetTopStyle = window.getComputedStyle(stackCards[0]).top;
      targetTop = parseFloat(targetTopStyle) || 112;

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      cardMetrics = Array.from(stackCards).map((card) => {
        const rect = card.getBoundingClientRect();
        return {
          card: card,
          staticTop: rect.top + scrollTop,
          height: rect.height,
          centerYOffset: rect.height / 2
        };
      });

      if (footerEl) {
        const rect = footerEl.getBoundingClientRect();
        footerMetric = {
          staticTop: rect.top + scrollTop,
          height: rect.height
        };
      }

      // Restore default sticky coordinates
      stackCards.forEach(card => {
        card.style.position = '';
      });
    };

    updateLayoutMetrics();
    window.addEventListener('resize', updateLayoutMetrics);

    let targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let currentScrollY = targetScrollY;
    let animationId;
    let isRunning = false;

    const renderStack = (y) => {
      const viewportHeight = window.innerHeight;
      const targetFocusArea = viewportHeight * 0.45; // Focus center at 45% height
      let closestCard = null;
      let minDistance = Infinity;

      cardMetrics.forEach((metric, index) => {
        const { card, staticTop } = metric;
        const currentTop = staticTop - y;
        const scrolledDistance = targetTop - currentTop;

        // 1. Perspective stack scaling and translate offset calculations
        if (scrolledDistance > 0) {
          const calculatedScale = Math.max(1 - (scrolledDistance * 0.0008), 0.82);
          const verticalShift = scrolledDistance * 0.12;
          card.style.transform = `scale(${calculatedScale}) translate3d(0, -${verticalShift}px, 0)`;
        } else {
          card.style.transform = `scale(1) translate3d(0, 0, 0)`;
        }

        // 2. Fade cards smoothly into the background as the next card overlaps
        if (scrolledDistance > 0) {
          if (index < cardMetrics.length - 1) {
            const nextMetric = cardMetrics[index + 1];
            const nextTop = nextMetric.staticTop - y;
            const cardHeight = nextMetric.height || 520;
            const progress = (nextTop - targetTop) / cardHeight;
            card.style.opacity = Math.min(Math.max(progress, 0), 1);
          } else {
            const cardHeight = metric.height || 520;
            const progress = 1 - (scrolledDistance / cardHeight);
            card.style.opacity = Math.min(Math.max(progress, 0), 1);
          }
        } else {
          card.style.opacity = 1;
        }

        // 3. Focal card indicator tracker
        const cardCenterY = currentTop + metric.centerYOffset;
        const distanceToFocus = Math.abs(cardCenterY - targetFocusArea);
        if (distanceToFocus < minDistance) {
          minDistance = distanceToFocus;
          closestCard = card;
        }
      });

      // 4. Reveal footer slide-in
      if (footerEl && footerMetric) {
        const viewportBottom = y + viewportHeight;
        const scrolledIn = viewportBottom - footerMetric.staticTop;
        const revealDistance = 350;

        if (scrolledIn > 0) {
          const progress = Math.min(Math.max(scrolledIn / revealDistance, 0), 1);
          footerEl.style.transform = `scale(${0.92 + progress * 0.08}) translate3d(0, ${(1 - progress) * 30}px, 0)`;
          footerEl.style.opacity = progress;
        } else {
          footerEl.style.transform = `scale(0.92) translate3d(0, 30px, 0)`;
          footerEl.style.opacity = 0;
        }
      }

      // Apply active style overrides
      cardMetrics.forEach(metric => {
        if (metric.card === closestCard) {
          metric.card.classList.add('is-focused-active');
        } else {
          metric.card.classList.remove('is-focused-active');
        }
      });
    };

    const animateLoop = () => {
      const diff = targetScrollY - currentScrollY;
      if (Math.abs(diff) < 0.1) {
        currentScrollY = targetScrollY;
        renderStack(currentScrollY);
        isRunning = false;
      } else {
        currentScrollY += diff * 0.12;
        renderStack(currentScrollY);
        animationId = requestAnimationFrame(animateLoop);
        isRunning = true;
      }
    };

    const handleScroll = () => {
      targetScrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (!isRunning) {
        isRunning = true;
        animationId = requestAnimationFrame(animateLoop);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Global listener for other modules to force layout sync updates
    window.updateLayoutMetrics = () => {
      updateLayoutMetrics();
      renderStack(currentScrollY);
    };

    // Initial draw
    renderStack(targetScrollY);

    return () => {
      window.removeEventListener('resize', updateLayoutMetrics);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animationId);
      delete window.updateLayoutMetrics;
    };
  }, []);

  return (
    <section className="section">
      <div id="featured-projects" className="section-top">
        <div>
          <h2>Featured Projects</h2>
        </div>
        <p>
          Every project focuses on aesthetics, smooth interactions,
          responsive layouts, and modern Architecture and UI inspiration.
        </p>
      </div>

      <div ref={parentRef} className="stacking-showroom-container" aria-label="Timeline scale stack container">
        {PROJECTS_DATA.map((project, index) => (
          <ProjectCard
            key={index}
            project={project}
            index={index}
            onCardSelect={onCardSelect}
            audioControls={audioControls}
          />
        ))}
      </div>
    </section>
  );
}
export { PROJECTS_DATA };
