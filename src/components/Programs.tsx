import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Snowflake, Wrench, Clock, ArrowRight, Lock, Sparkles } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import type { CourseData, ProgramData, WorkshopData } from "@/lib/demoSchemas";

type Course = CourseData;

type Workshop = WorkshopData;

type Program = ProgramData;

const iconMap = {
  Sun,
  Snowflake,
  Wrench,
} as const;

const resolveIcon = (icon: Program["icon"]): Program["icon"] => {
  if (typeof icon === "string") {
    return (iconMap[icon as keyof typeof iconMap] ?? Sun) as Program["icon"];
  }
  return icon;
};

const fallbackPrograms: Program[] = [
  {
    id: "summer",
    icon: Sun,
    label: "Summer Internship",
    duration: "8 Weeks",
    content: "Industry-led training with real product builds. Live cohort, mentor reviews and an industry-recognized certificate.",
    courses: [
      { title: "Complete DevOps Bootcamp", hook: "Master CI/CD, Docker, K8s & Cloud in 12 weeks.", duration: "12 WEEKS", level: "BEGINNER â†’ MID", tags: ["Linux", "Jenkins", "AWS"] },
      { title: "Full-Stack Web Engineering", hook: "Ship production apps with React, Node & Postgres.", duration: "10 WEEKS", level: "BEGINNER â†’ MID", tags: ["React", "Node", "SQL"] },
      { title: "Applied AI / ML", hook: "Train, deploy and monitor real ML pipelines.", duration: "12 WEEKS", level: "INTERMEDIATE", tags: ["Python", "PyTorch", "MLOps"] },
    ],
    features: ["Internship", "Certification", "Training Complete", "Practical Session"],
  },
  {
    id: "winter",
    icon: Snowflake,
    label: "Winter Internship",
    duration: "6 Weeks",
    content: "Compact winter cohort focused on shipping a deployable product from day one. Lineup unlocks soon.",
    startsInDays: 45,
    courses: [],
    features: ["Internship", "Certification", "Training Complete", "Practical Session"],
  },
  {
    id: "workshops",
    icon: Wrench,
    label: "Workshops",
    duration: "1â€“3 Days",
    content: "Hands-on workshops on emerging topics â€” pick one and register before seats close.",
    workshops: [
      { title: "AI Agents from Scratch", hook: "Build & deploy an autonomous agent in a day.", date: "JUN 15", startsInDays: 0 },
      { title: "K8s for Builders", hook: "Run real workloads on Kubernetes â€” hands on.", date: "JUL 02", startsInDays: 18 },
      { title: "Edge AI on Device", hook: "Ship ML to phones & micro-devices.", date: "JUL 28", startsInDays: 44 },
    ],
    features: ["Internship", "Certification", "Training Complete", "Practical Session"],
  },
];

const Countdown = ({ targetDays = 21, label = "NEXT BATCH IN" }: { targetDays?: number; label?: string }) => {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  const showInlineLabel = label.trim().length > 0;

  useEffect(() => {
    const target = Date.now() + targetDays * 86400000;
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) return;
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDays]);

  const cells = [
    { v: t.d, l: "DAYS" },
    { v: t.h, l: "HRS" },
    { v: t.m, l: "MIN" },
    { v: t.s, l: "SEC" },
  ];

  return (
    <div className="flex items-center gap-3 justify-center flex-wrap">
      {showInlineLabel && (
        <>
          <Clock size={16} className="text-primary" />
          <span className="font-mono text-xs text-muted-foreground tracking-widest mr-2">{label}</span>
        </>
      )}
      {cells.map((c) => (
        <div key={c.l} className="px-3 py-2 rounded-lg bg-card border border-primary/30 min-w-[60px] text-center">
          <div className="font-display font-bold text-xl text-primary">{String(c.v).padStart(2, "0")}</div>
          <div className="text-[9px] font-mono text-muted-foreground">{c.l}</div>
        </div>
      ))}
    </div>
  );
};

const isLocked = (prog: ProgramItem): boolean => {
  if (prog.isLocked === true) return true;
  if (prog.unlockDate) {
    const unlockDate = new Date(prog.unlockDate);
    return unlockDate > new Date();
  }
  return false;
};

const InternshipCard = ({ prog }: { prog: ProgramItem }) => {
  const [hovered, setHovered] = useState(false);
  const locked = isLocked(prog);
  const daysLeft = locked && prog.unlockDate ? daysUntil(prog.unlockDate) : 0;
  const isWorkshop = prog.icon === "Wrench";

  return (
    <motion.div
      className="relative rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Card image or gradient background */}
      <div
        className="relative h-48 w-full"
        style={prog.imageUrl
          ? { backgroundImage: `url(${prog.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: "linear-gradient(135deg, hsl(220 25% 18%), hsl(220 20% 10%))" }
        }
      >
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-transparent to-background/80" />
        
        {/* Lock overlay on image area when locked */}
        {locked && (
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <Lock size={28} className="text-primary" />
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">LOCKED</span>
            {daysLeft > 0 && <Countdown targetDays={daysLeft} label="" />}
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-display font-bold text-xl">{prog.label}</h3>
          <span className="font-mono text-xs text-muted-foreground bg-card border border-border px-2 py-1 rounded-full flex-shrink-0">
            {isWorkshop ? "WORKSHOP" : prog.duration}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">{prog.content}</p>
        {!locked && prog.startsInDays && prog.startsInDays > 0 && (
          <div className="mt-4">
            <Countdown targetDays={prog.startsInDays} label="NEXT BATCH IN" />
          </div>
        )}
      </div>

      {/* Hover aside panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute inset-0 rounded-2xl bg-background border border-primary/40 p-6 flex flex-col justify-between"
          >
            <div>
              <p className="font-mono text-xs tracking-widest text-primary mb-4">WHAT'S INCLUDED</p>
              <div className="space-y-3">
                {(prog.features?.length
                  ? prog.features
                  : ["Internship", "Certification", "Training Complete", "Practical Session"]
                ).map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <span className="text-green-400 font-bold">✓</span>
                    <span className="text-green-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            {locked ? (
              <button
                disabled
                className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border-2 border-foreground/20 font-medium text-sm text-muted-foreground cursor-not-allowed mt-4"
              >
                <Lock size={14} /> Unlocks in {daysLeft}d
              </button>
            ) : (
              <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border-2 border-foreground/80 hover:bg-foreground/10 font-medium text-sm mt-4">
                View More <ArrowRight size={14} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SummerBG = () => (
  <motion.div key="summer-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
    className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 80% 60% at 80% 110%, hsl(35 100% 55% / 0.35), transparent 60%), radial-gradient(ellipse 60% 50% at 20% 100%, hsl(15 90% 50% / 0.25), transparent 60%), linear-gradient(180deg, transparent 50%, hsl(30 80% 25% / 0.15))"
    }} />
    <motion.div
      initial={{ y: 200, scale: 0.8 }}
      animate={{ y: 60, scale: 1 }}
      transition={{ duration: 1.4, ease: "easeOut" }}
      className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full"
      style={{ background: "radial-gradient(circle, hsl(45 100% 65%), hsl(25 100% 55% / 0.4) 50%, transparent 70%)", filter: "blur(2px)" }}
    />
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className="absolute bottom-[-100px] right-[15%] w-[500px] h-[500px] opacity-30"
      style={{
        background: "conic-gradient(from 0deg, transparent 0deg, hsl(45 100% 60% / 0.4) 10deg, transparent 20deg, transparent 40deg, hsl(45 100% 60% / 0.3) 50deg, transparent 60deg, transparent 90deg, hsl(45 100% 60% / 0.4) 100deg, transparent 110deg)"
      }}
    />
  </motion.div>
);

const WinterBG = () => (
  <motion.div key="winter-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
    className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 80% 60% at 50% -20%, hsl(200 90% 70% / 0.25), transparent 60%), linear-gradient(180deg, hsl(210 60% 15% / 0.4), transparent 70%)"
    }} />
    {[...Array(20)].map((_, i) => (
      <motion.span
        key={i}
        initial={{ y: -30, x: Math.random() * 100 + "%", opacity: 0 }}
        animate={{ y: "110vh", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 8 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 5, ease: "linear" }}
        className="absolute text-white/60"
        style={{ left: Math.random() * 100 + "%", fontSize: 8 + Math.random() * 14 }}
      >
        â„
      </motion.span>
    ))}
  </motion.div>
);

const WorkshopBG = () => (
  <motion.div key="workshop-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
    className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute inset-0" style={{
      background: "radial-gradient(ellipse 60% 50% at 30% 30%, hsl(280 80% 50% / 0.25), transparent 60%), radial-gradient(ellipse 50% 40% at 70% 80%, hsl(190 90% 50% / 0.2), transparent 60%)"
    }} />
    <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10">
      <Wrench size={420} className="text-primary" strokeWidth={0.5} />
    </motion.div>
  </motion.div>
);

const CourseCard = ({ course, accent }: { course: Course; accent: string }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="group/course relative rounded-2xl border-2 border-foreground/90 bg-background overflow-hidden shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-shadow"
  >
    <div className="relative h-40 overflow-hidden" style={{ background: accent }}>
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 text-[10px] font-mono">
        <Sparkles size={10} className="text-primary" /> HYBRID
      </div>
      <div className="absolute bottom-3 right-3 text-right">
        <div className="font-display font-bold text-xs text-foreground">{course.duration}</div>
        <div className="text-[9px] font-mono text-muted-foreground">{course.level}</div>
      </div>
      <div className="absolute bottom-3 left-3 max-w-[70%]">
        <div className="font-display font-bold text-lg leading-tight text-foreground drop-shadow">{course.title}</div>
      </div>
    </div>

    <div className="relative p-5">
      <p className="text-xs text-muted-foreground leading-relaxed transition-opacity duration-300 group-hover/course:opacity-0">
        {course.hook}
      </p>

      <div className="absolute inset-0 p-5 opacity-0 translate-y-2 group-hover/course:opacity-100 group-hover/course:translate-y-0 transition-all duration-300 bg-background flex flex-col justify-between">
        <div className="flex flex-wrap gap-1.5">
          {course.tags.map((tag) => (
            <span key={tag} className="text-[10px] font-mono px-2 py-1 rounded-md bg-secondary text-secondary-foreground">{tag}</span>
          ))}
        </div>
        <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:gap-3 transition-all">
          Explore <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

const WorkshopCard = ({ w }: { w: Workshop }) => {
  const locked = w.startsInDays > 0;
  return (
    <motion.div
      whileHover={{ y: -6 }}
      className="group/wk relative rounded-2xl border-2 border-foreground/90 bg-background overflow-hidden shadow-[6px_6px_0_0_hsl(var(--foreground))]"
    >
      <div className="relative h-40 overflow-hidden"
        style={{ background: "linear-gradient(135deg, hsl(280 70% 30%), hsl(217 91% 30%))" }}>
        <div className="absolute inset-0 grid-overlay opacity-30" />
        {locked && (
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
            <Lock size={28} className="text-primary" />
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">UNLOCKS IN</span>
            <div className="font-display font-bold text-2xl text-primary">{w.startsInDays}D</div>
          </div>
        )}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 text-[10px] font-mono">
          <Wrench size={10} className="text-primary" /> WORKSHOP
        </div>
        <div className="absolute bottom-3 left-3">
          <div className="font-display font-bold text-lg text-foreground drop-shadow">{w.title}</div>
          <div className="text-[10px] font-mono text-muted-foreground">{w.date}</div>
        </div>
      </div>
      <div className="relative p-5">
        <p className="text-xs text-muted-foreground leading-relaxed transition-opacity duration-300 group-hover/wk:opacity-0">
          {w.hook}
        </p>
        <div className="absolute inset-0 p-5 opacity-0 group-hover/wk:opacity-100 transition-all duration-300 bg-background flex items-end">
          {locked ? (
            <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg border-2 border-foreground/80 font-medium text-sm">
              <Lock size={14} /> Pre-Register
            </button>
          ) : (
            <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm">
              View Details <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// â”€â”€ Local type keeps icon as raw string for unambiguous grouping â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type TabId = "summer" | "winter" | "workshops";

type ProgramItem = {
  id: string;
  icon: string;          // raw Supabase string: "Sun" | "Snowflake" | "Wrench"
  label: string;
  duration: string;
  content: string;
  startsInDays?: number;
  imageUrl?: string | null;
  courses: Course[];
  workshops: Workshop[];
  features: string[];
  isLocked?: boolean;
  unlockDate?: string | null;
};

// â”€â”€ Convert fallback Program[] (which use component refs) to ProgramItem[] â”€â”€â”€â”€
const toIconString = (icon: Program["icon"]): string => {
  if (typeof icon === "string") return icon;
  if (icon === Snowflake) return "Snowflake";
  if (icon === Wrench)    return "Wrench";
  return "Sun";
};

const fallbackItems: ProgramItem[] = fallbackPrograms.map((p) => ({
  id: p.id,
  icon: toIconString(p.icon),
  label: p.label,
  duration: p.duration,
  content: p.content,
  startsInDays: p.startsInDays,
  imageUrl: null,
  courses: (p.courses ?? []) as Course[],
  workshops: (p.workshops ?? []) as Workshop[],
  features: p.features ?? ["Internship", "Certification", "Training Complete", "Practical Session"],
  isLocked: false,
  unlockDate: null,
}));

// â”€â”€ Fixed 3 tabs â€” always rendered regardless of DB data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const TABS: { id: TabId; label: string; Icon: typeof Sun }[] = [
  { id: "summer",    label: "Summer Internship", Icon: Sun       },
  { id: "winter",    label: "Winter Internship",  Icon: Snowflake },
  { id: "workshops", label: "Workshops",           Icon: Wrench    },
];

// â”€â”€ ProgramCard â€” same visual design as CourseCard, driven by program fields â”€â”€
const ProgramCard = ({ prog, accent }: { prog: ProgramItem; accent: string }) => (
  <motion.div
    whileHover={{ y: -6 }}
    className="group/prog relative rounded-2xl border-2 border-foreground/90 bg-background overflow-hidden shadow-[6px_6px_0_0_hsl(var(--foreground))] transition-shadow"
  >
    <div
      className="relative h-40 overflow-hidden"
      style={
        prog.imageUrl
          ? { backgroundImage: `url(${prog.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
          : { background: accent }
      }
    >
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/90 text-[10px] font-mono">
        <Sparkles size={10} className="text-primary" /> HYBRID
      </div>
      <div className="absolute bottom-3 right-3 text-right">
        <div className="font-display font-bold text-xs text-foreground">{prog.duration}</div>
      </div>
      <div className="absolute bottom-3 left-3 max-w-[70%]">
        <div className="font-display font-bold text-lg leading-tight text-foreground drop-shadow">{prog.label}</div>
      </div>
    </div>
    <div className="relative p-5">
      <p className="text-xs text-muted-foreground leading-relaxed transition-opacity duration-300 group-hover/prog:opacity-0">
        {prog.content}
      </p>
      <div className="absolute inset-0 p-5 opacity-0 translate-y-2 group-hover/prog:opacity-100 group-hover/prog:translate-y-0 transition-all duration-300 bg-background flex flex-col justify-end">
        <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:gap-3 transition-all">
          Explore <ArrowRight size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

const daysUntil = (dateStr: string): number => {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

const Programs = () => {
  const [active, setActive] = useState<TabId>("summer");
  const [items, setItems] = useState<ProgramItem[]>(fallbackItems);
  const [settings, setSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const mapProgramItem = (p: any): ProgramItem => ({
      id: p.id,
      icon: p.icon ?? "Sun",
      label: p.label,
      duration: p.duration,
      content: p.content,
      startsInDays: p.starts_in_days ?? undefined,
      imageUrl: p.image_url ?? null,
      courses: p.website_program_courses?.map((c: any) => ({
        title: c.title,
        hook: c.hook,
        duration: c.duration,
        level: c.level,
        tags: c.tags ?? [],
        desc: c.description ?? "",
        skills: c.skills ?? [],
        icon: "Brain",
      })) ?? [],
      workshops: p.website_program_workshops?.map((w: any) => ({
        title: w.title,
        hook: w.hook,
        date: w.date,
        startsInDays: w.starts_in_days ?? 0,
      })) ?? [],
      features: (() => {
        try {
          const parsed = JSON.parse(p.features ?? "[]");
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return ["Internship", "Certification", "Training Complete", "Practical Session"];
        }
      })(),
      isLocked: p.is_locked ?? false,
      unlockDate: p.unlock_date ?? null,
    });

    const load = async () => {
      const { data, error } = await supabase
        .from("website_programs")
        .select(
          "id, icon, label, duration, content, starts_in_days, image_url, features, is_locked, unlock_date, website_program_courses(*), website_program_workshops(*)"
        )
        .eq("is_active", true);

      if (!error && data && data.length > 0) {
        console.log("Program icons from Supabase:", data.map((p: any) => ({ label: p.label, icon: p.icon })));
        setItems(data.map((p: any): ProgramItem => mapProgramItem(p)));
        return;
      }

      if (error?.message?.includes("is_timer_only")) {
        console.warn("Schema cache still references is_timer_only. Falling back to base program fetch.");
        const { data: fallbackData, error: fallbackError } = await supabase
          .from("website_programs")
          .select("id, icon, label, duration, content, starts_in_days, image_url, features")
          .eq("is_active", true);

        if (!fallbackError && fallbackData && fallbackData.length > 0) {
          console.log(
            "Program icons from Supabase:",
            fallbackData.map((p: any) => ({ label: p.label, icon: p.icon }))
          );
          setItems(
            fallbackData.map((p: any): ProgramItem =>
              mapProgramItem({ ...p, website_program_courses: [], website_program_workshops: [] })
            )
          );
          return;
        }
      }
    };

    void load();
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const loadSettings = async () => {
      const { data } = await supabase
        .from("website_settings")
        .select("key, value");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((s: any) => { map[s.key] = s.value; });
        setSettings(map);
      }
    };
    void loadSettings();
  }, []);

  // Group by raw icon string â€” simple, unambiguous, no component-ref comparison
  const summer    = items.filter((p) => p.icon === "Sun");
  const winter    = items.filter((p) => p.icon === "Snowflake");
  const workshops = items.filter((p) => p.icon === "Wrench");

  const courseAccents = [
    "linear-gradient(135deg, hsl(35 90% 50%), hsl(15 85% 45%))",
    "linear-gradient(135deg, hsl(217 80% 45%), hsl(260 75% 45%))",
    "linear-gradient(135deg, hsl(160 70% 40%), hsl(190 80% 40%))",
  ];

  return (
    <section id="programs" className="relative py-32 overflow-hidden">
      <AnimatePresence mode="wait">
        {active === "summer"    && <SummerBG />}
        {active === "winter"    && <WinterBG />}
        {active === "workshops" && <WorkshopBG />}
      </AnimatePresence>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <p className="font-mono text-xs tracking-[0.3em] text-primary mb-8">â€” PROGRAMS â€”</p>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-8">Choose Your Orbit</h2>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          {/* â”€â”€ Fixed 3 tab buttons â€” always rendered â”€â”€ */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full border transition-all ${
                  active === id
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_30px_hsl(var(--primary)/0.4)]"
                    : "border-border bg-card/30 hover:border-primary/40"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>

          {/* â”€â”€ Tab panel â”€â”€ */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="rounded-3xl border border-border bg-card/40 backdrop-blur-md p-6 md:p-10"
            >
              {/* â”€â”€ Summer â”€â”€ */}
              {active === "summer" && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                    <div>
                      <p className="font-mono text-xs tracking-widest text-primary mb-1">— SUMMER INTERNSHIP —</p>
                      <h3 className="font-display text-3xl font-bold">Build Real. Ship Real.</h3>
                    </div>
                    {settings.summerNextBatch && (
                      <Countdown targetDays={daysUntil(settings.summerNextBatch)} label="NEXT BATCH IN" />
                    )}
                  </div>
                  {summer.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {summer.map((prog) => (
                        <InternshipCard key={prog.id} prog={prog} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-6">
                      {settings.summerNextBatch
                        ? <Countdown targetDays={daysUntil(settings.summerNextBatch)} label="NEXT BATCH IN" />
                        : <p className="text-sm text-muted-foreground">No programs scheduled yet.</p>
                      }
                    </div>
                  )}
                </div>
              )}

              {/* â”€â”€ Winter â€” cards if data exists, countdown fallback otherwise â”€â”€ */}
              {active === "winter" && winter.length > 0 && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                    <div>
                      <p className="font-mono text-xs tracking-widest text-primary mb-1">— WINTER INTERNSHIP —</p>
                      <h3 className="font-display text-3xl font-bold">Winter Cohort</h3>
                    </div>
                    {settings.winterNextBatch && (
                      <Countdown targetDays={daysUntil(settings.winterNextBatch)} label="NEXT BATCH IN" />
                    )}
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {winter.map((prog) => (
                      <InternshipCard key={prog.id} prog={prog} />
                    ))}
                  </div>
                </div>
              )}
              {active === "winter" && winter.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-6">
                  {settings.winterNextBatch
                    ? <Countdown targetDays={daysUntil(settings.winterNextBatch)} label="NEXT BATCH IN" />
                    : <p className="text-sm text-muted-foreground">No programs scheduled yet.</p>
                  }
                </div>
              )}

              {/* â”€â”€ Workshops â€” each program row becomes a WorkshopCard â”€â”€ */}
              {active === "workshops" && (
                <div className="space-y-10">
                  <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
                    <div>
                      <p className="font-mono text-xs tracking-widest text-primary mb-1">— WORKSHOPS —</p>
                      <h3 className="font-display text-3xl font-bold">Learn by Doing</h3>
                    </div>
                    {settings.workshopNextBatch && (
                      <Countdown targetDays={daysUntil(settings.workshopNextBatch)} label="NEXT BATCH IN" />
                    )}
                  </div>
                  {workshops.length > 0 ? (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {workshops.map((prog) => (
                        <InternshipCard key={prog.id} prog={prog} />
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 gap-6">
                      {settings.workshopNextBatch
                        ? <Countdown targetDays={daysUntil(settings.workshopNextBatch)} label="NEXT BATCH IN" />
                        : <p className="text-sm text-muted-foreground">No programs scheduled yet.</p>
                      }
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Programs;

