import React, { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState({ x: -100, y: -100 });
  const [clicked, setClicked] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Hide cursor on touch devices or if reduced motion is requested
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouchDevice || prefersReducedMotion) return;

    setIsVisible(true);

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if target or ancestor has data-cursor attribute
      const targetWithCursor = e.target.closest('[data-cursor]');
      if (targetWithCursor) {
        setCursorText(targetWithCursor.getAttribute('data-cursor') || '');
      } else {
        setCursorText('');
      }
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Add listeners to interactive elements
    const addHoverListeners = () => {
      const interactives = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .clickable, [data-cursor]');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setHovered(true));
        el.addEventListener('mouseleave', () => {
          setHovered(false);
          setCursorText('');
        });
      });
    };

    // Watch DOM changes to re-bind hover states
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    
    addHoverListeners();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      observer.disconnect();
    };
  }, []);

  // Smooth trail following positioning (lerping)
  useEffect(() => {
    let animationFrameId;
    
    const updateTrail = () => {
      setTrail((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.18,
          y: prev.y + dy * 0.18,
        };
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };

    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Ring / Badge */}
      <div
        className={`custom-cursor hidden md:flex items-center justify-center transition-all duration-300 pointer-events-none select-none z-50 ${
          cursorText
            ? 'w-14 h-14 bg-indigo-600/90 border-indigo-400 text-white font-black text-[9px] tracking-widest rounded-full shadow-lg shadow-indigo-500/30'
            : hovered
            ? 'w-10 h-10 border-indigo-400 bg-indigo-500/10 rounded-full'
            : 'w-7 h-7 border-white/20 bg-transparent rounded-full'
        } ${clicked ? 'scale-90 border-pink-400 bg-pink-500/20' : ''}`}
        style={{
          left: `${trail.x}px`,
          top: `${trail.y}px`,
        }}
      >
        {cursorText && <span>{cursorText}</span>}
      </div>

      {/* Inner Dot */}
      {!cursorText && (
        <div
          className={`custom-cursor-dot hidden md:block transition-transform duration-150 pointer-events-none z-50 ${
            hovered ? 'scale-150 bg-indigo-300' : 'bg-white'
          } ${clicked ? 'bg-pink-400' : ''}`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;
