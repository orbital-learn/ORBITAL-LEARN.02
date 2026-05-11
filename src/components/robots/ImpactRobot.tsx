/**
 * Orbital Learn LMS
 * @author prashB2D (https://github.com/prashB2D)
 * @copyright 2025 Orbital Learn. All rights reserved.
 */

import { useEffect, useState, useRef, type RefObject } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import './ImpactRobot.css';

interface ImpactRobotProps {
  /**
   * Customizable robot colors via CSS variables
   * @default { bg: '#1a1a1a', accent: '#30d0de' }
   */
  colors?: {
    bg?: string;
    accent?: string;
  };
  /**
   * Position offset from the right edge (percentage)
   * @default -5
   */
  rightOffset?: number;
  /**
   * Vertical position offset (percentage from section top)
   * @default 30
   */
  topOffset?: number;
  /**
   * Optional anchor for section-relative scroll tracking.
   */
  anchorRef?: RefObject<HTMLDivElement>;
}

/**
 * ImpactRobot - Premium animated BB-8 style robot for Mission & Vision / Impact section
 *
 * Features:
 * - Black body with cyan accent (customizable)
 * - Scroll-linked smooth animation
 * - Head tilt based on scroll velocity
 * - Body rolling animation
 * - Section-relative positioning
 * - Responsive on all devices
 * - Non-intrusive (pointer-events: none, safe z-index)
 */
export default function ImpactRobot({
  colors = { bg: '#1a1a1a', accent: '#30d0de' },
  rightOffset = -5,
  topOffset = 30,
  anchorRef,
}: ImpactRobotProps) {
  const internalAnchorRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const scrollVelocityRef = useRef(0);
  const scrollProgressRef = useRef(0);

  const trackedAnchorRef = anchorRef ?? internalAnchorRef;
  const clampedTopOffset = Math.max(0, Math.min(100, topOffset));

  // Smooth spring animations for premium feel
  const headRotation = useSpring(0, { stiffness: 100, damping: 20 });
  const bodyRotation = useSpring(45, { stiffness: 50, damping: 15 });
  const xPosition = useSpring(0, { stiffness: 120, damping: 20 });
  const leftPosition = useTransform(xPosition, (value) => `${value}%`);

  useEffect(() => {
    const target = trackedAnchorRef.current;
    if (!target) return;

    let animationFrameId: number;

    const handleScroll = () => {
      const rect = target.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const isVisible = rect.top < windowHeight && rect.bottom > 0;
      setIsActive(isVisible);

      if (!isVisible) {
        return;
      }

      // Start moving when the section top enters from the bottom of the viewport
      // and finish when the section reaches the top of the viewport (so user can see it finish)
      const startOffset = windowHeight;
      const endOffset = 0;
      const currentOffset = rect.top;
      const fullRange = startOffset - endOffset;
      const progress = Math.max(0, Math.min(1, (startOffset - currentOffset) / fullRange));
      
      xPosition.set(progress * 95);

      if (Math.abs(progress - scrollProgressRef.current) > 0.003) {
        scrollProgressRef.current = progress;
        setScrollProgress(progress);
      }

      // Velocity calculation for head tilt
      const now = Date.now();
      const timeDelta = now - lastTime.current;
      const scrollDelta = window.scrollY - lastScrollY.current;
      const velocity = timeDelta > 0 ? scrollDelta / timeDelta : 0;
      scrollVelocityRef.current = velocity;
      lastScrollY.current = window.scrollY;
      lastTime.current = now;

      // Head tilts based on velocity
      const tilt = Math.max(-20, Math.min(20, velocity * 30));
      headRotation.set(tilt);

      // Body rolls continuously but not too fast
      const rollAmount = progress * 360;
      bodyRotation.set(45 + rollAmount);
    };

    let timeoutId: number;
    const resetHead = () => {
      timeoutId = window.setTimeout(() => {
        if (Math.abs(scrollVelocityRef.current) < 0.01) {
          headRotation.set(0);
        }
      }, 150);
    };

    const scrollHandler = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        handleScroll();
      });
      clearTimeout(timeoutId);
      resetHead();
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('resize', handleScroll);
      clearTimeout(timeoutId);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [trackedAnchorRef, bodyRotation, headRotation]);

  // Robot moves horizontally from left to right as we scroll down
  // Starts on the left side (0%) and moves to the right side (100%)

  return (
    <>
      {!anchorRef && <div ref={internalAnchorRef} className="impact-robot-container" />}
      <div
        className="impact-robot-container"
        style={
          {
            '--robot-bg': colors.bg,
            '--robot-accent': colors.accent,
          } as React.CSSProperties
        }
      >
        {isActive && (
          <motion.div
            className="bb8-scroll robot-black"
            style={{
              left: leftPosition,
              top: `${clampedTopOffset}%`, // Fixed vertical position inside relative container
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
          {/* Head Container */}
          <motion.div
            className="bb8__head-container"
            style={{ rotate: headRotation }}
          >
            {/* Antennas */}
            <div className="bb8__antenna"></div>
            <div className="bb8__antenna"></div>
            {/* Head */}
            <div className="bb8__head"></div>
          </motion.div>

          {/* Body Sphere */}
          <motion.div
            className="bb8__body"
            style={{ rotate: bodyRotation }}
          />
        </motion.div>
      )}
    </div>
    </>
  );
}
