import type { LucideIcon } from "lucide-react";

export type CourseData = {
  icon: LucideIcon | string;
  title: string;
  desc: string;
  skills: string[];
  duration: string;
  hook?: string;
  level?: string;
  tags?: string[];
  imageUrl?: string | null;
};

export type TestimonialData = {
  name: string;
  role: string;
  text: string;
  rating?: number;
};

export type WorkshopData = {
  title: string;
  hook: string;
  date: string;
  startsInDays: number;
};

export type ProgramData = {
  id: string;
  icon: LucideIcon | string;
  label: string;
  duration: string;
  content: string;
  courses?: CourseData[];
  workshops?: WorkshopData[];
  startsInDays?: number;
};

export const demoDataSchema = {
  courses: {
    title: "Course card schema for the EXPLORE COURSES / Find Your Path section",
    fields: [
      { name: "icon", type: "LucideIcon | string", required: true, description: "Visual icon for the course card." },
      { name: "title", type: "string", required: true, description: "Headline for the course card." },
      { name: "desc", type: "string", required: true, description: "Short description text shown under the title." },
      { name: "skills", type: "string[]", required: true, description: "List of primary skills taught by the course." },
      { name: "duration", type: "string", required: true, description: "Course length or time label, e.g. '10 weeks'." },
      { name: "hook", type: "string", required: false, description: "Optional marketing hook text used in deeper program cards." },
      { name: "level", type: "string", required: false, description: "Optional difficulty or level label for program details." },
      { name: "tags", type: "string[]", required: false, description: "Optional list of tag badges shown on hover cards." },
    ],
  },
  testimonials: {
    title: "Testimonial card schema for TRUSTED BY MANY / Voices from Orbit section",
    fields: [
      { name: "name", type: "string", required: true, description: "Student or alumni name shown in the card." },
      { name: "role", type: "string", required: true, description: "Job title or cohort role displayed below the name." },
      { name: "text", type: "string", required: true, description: "Quote or testimonial body text." },
      { name: "rating", type: "number", required: false, description: "Optional star rating value used for visual trust signals." },
    ],
  },
  programs: {
    title: "Program state schema for Choose Your Orbit section",
    fields: [
      { name: "id", type: "'summer' | 'winter' | 'workshops'", required: true, description: "Unique program state key used for tab selection." },
      { name: "icon", type: "LucideIcon | string", required: true, description: "Icon shown next to the program label." },
      { name: "label", type: "string", required: true, description: "CTA label for the program tab." },
      { name: "duration", type: "string", required: true, description: "Program duration label shown in the header." },
      { name: "content", type: "string", required: true, description: "Summary text shown under the program title." },
      { name: "courses", type: "CourseData[]", required: false, description: "Optional course list for the active program." },
      { name: "workshops", type: "WorkshopData[]", required: false, description: "Optional workshop list for the active program." },
      { name: "startsInDays", type: "number", required: false, description: "Optional countdown value used for future unlock states." },
    ],
  },
} as const;
