/**
 * Orbital Learn LMS
 * @author prashB2D (https://github.com/prashB2D)
 * @copyright 2025 Orbital Learn. All rights reserved.
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, ChevronLeft, ChevronRight } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { TestimonialData } from "@/lib/demoSchemas";
import gridBg from "@/assets/grid-bg.png";
import "./Testimonials.css";

const fallbackItems: TestimonialData[] = [
  { name: "Aarav Mehta", role: "Software Engineer Intern", text: "I shipped real production code in week 3. The workflow felt like an actual tech company — Git, reviews, deploys, the whole loop." },
  { name: "Priya Sharma", role: "ML Intern", text: "The mentorship and structured sprints turned theory into muscle memory. I now contribute confidently from day one." },
  { name: "Rohan Iyer", role: "Full-Stack Developer", text: "Orbital Learn doesn't teach you to pass exams — it trains you to build systems that scale." },
];

const cardBackgrounds = [
  "radial-gradient(circle, rgba(252, 240, 142, 1) 0%, rgba(246, 173, 32, 1) 40%, rgba(192, 142, 8, 1) 100%)",
  "radial-gradient(circle, rgba(142, 249, 252, 1) 0%, rgba(32, 164, 246, 1) 40%, rgba(8, 81, 192, 1) 100%)",
  "radial-gradient(circle, rgba(222, 128, 233, 1) 0%, rgba(213, 32, 246, 1) 40%, rgba(139, 6, 157, 1) 100%)"
];

const Testimonials = () => {
  const [items, setItems] = useState<TestimonialData[]>(fallbackItems);
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const loadTestimonials = async () => {
      const { data, error } = await supabase
        .from("website_testimonials")
        .select("id, name, role, text, rating")
        .eq("is_active", true);

      console.log("Testimonials fetch result:", { data, error });

      if (!error && data) {
        setItems(
          data.map((item: any) => ({
            name: item.name,
            role: item.role,
            text: item.text,
            rating: item.rating ?? undefined,
          }))
        );
      }
    };

    void loadTestimonials();
  }, []);

  const nextCard = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevCard = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleManualNav = (dir: 'next' | 'prev') => {
    if (dir === 'next') nextCard();
    else prevCard();

    timerRef.current = setTimeout(() => {
      // After 5 seconds, resume the normal interval
      timerRef.current = setInterval(nextCard, 2500);
    }, 5000);
  };

  useEffect(() => {
    if (items.length <= 1) return;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setInterval(nextCard, 2500);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        clearTimeout(timerRef.current);
      }
    };
  }, [items.length, nextCard]);

  const getPositionVariant = (index: number) => {
    const total = items.length;
    if (total <= 1) return "center";

    if (index === activeIndex) return "center";
    if (index === (activeIndex + 1) % total) return "right";
    if (index === (activeIndex - 1 + total) % total) return "left";

    return "hidden";
  };

  const cardVariants = {
    center: {
      zIndex: 2,
      x: "0px",
      y: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }
    },
    left: {
      zIndex: 0,
      x: "-125px", 
      y: 56, 
      rotate: -10,
      scale: 0.95,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }
    },
    right: {
      zIndex: 0,
      x: "125px",
      y: 56,
      rotate: 10,
      scale: 0.95,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] as const }
    },
    hidden: {
      zIndex: -1,
      x: "0px",
      y: 80,
      rotate: 0,
      scale: 0.8,
      opacity: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Grid backdrop with glow */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-70"
          style={{ backgroundImage: `url(${gridBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
        {/* Soft glowing orbs */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/20 blur-[120px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-4 glow-text">— TRUSTED BY MANY —</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-foreground glow-text">Voices from Orbit</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col justify-center w-full items-center"
        >
          <div className="wrap_card">
            <AnimatePresence initial={false}>
              {items.map((t, i) => {
                const bg = cardBackgrounds[i % cardBackgrounds.length];
                const variant = getPositionVariant(i);

                return (
                  <motion.div
                    key={t.name}
                    className="anim-card shadow-2xl"
                    style={{ background: bg }}
                    variants={cardVariants}
                    initial="hidden"
                    animate={variant}
                  >
                    <div className="page" style={{ margin: 0, width: 'calc(100% - 8px)', height: 'calc(100% - 8px)' }}>
                      <div className="margin"></div>
                      <div className="stars-container">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={16} className="star-gold" />
                        ))}
                      </div>
                      <div className="page-header">
                        <div className="profile-icon">
                          <User size={20} />
                        </div>
                        <div className="author-info">
                          <p className="author-name">{t.name}</p>
                          <p className="author-role">{t.role}</p>
                        </div>
                      </div>
                      <p className="testimonial-text">{t.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <svg style={{ visibility: "hidden", width: 0, height: 0, position: 'absolute' }}>
              <defs>
                <linearGradient id="gradient-full" x1="0%" y1="0%" x2="120%" y2="120%">
                  <stop offset="0%" stopColor="#ffffff"></stop>
                  <stop offset="100%" stopColor="#ffffff00"></stop>
                </linearGradient>
                <linearGradient id="gradient-half" x1="-50%" y1="-50%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffffff"></stop>
                  <stop offset="100%" stopColor="#ffffff00"></stop>
                </linearGradient>
              </defs>
            </svg>

            <div className="lines">
              <div className="line"></div>
              <div className="line"></div>
            </div>
          </div>

          {/* Controls */}
          {items.length > 1 && (
            <div className="flex gap-4 mt-8 relative z-10">
              <button
                onClick={() => handleManualNav('prev')}
                className="w-12 h-12 rounded-full border border-primary/20 bg-background/50 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary/20 transition-all hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => handleManualNav('next')}
                className="w-12 h-12 rounded-full border border-primary/20 bg-background/50 backdrop-blur flex items-center justify-center text-foreground hover:bg-primary/20 transition-all hover:scale-110 active:scale-95 shadow-[0_0_15px_rgba(var(--primary),0.1)]"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
