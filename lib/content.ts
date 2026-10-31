// All editable site copy lives here.

export const site = {
  name: "ElevateHQ",
  tagline: "Psychology & Human Development Services",
  founder: "Priyadharshini",
  phone: "+91 98407 38955",
  phoneHref: "tel:+919840738955",
  whatsapp: "https://wa.me/919840738955",
  email: "Priyadarshini@elevatehqservices.com",
  location: "Sholinganallur, Chennai",
  linkedin: "https://www.linkedin.com/in/priyadharshini-balaji-b549031a5/",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://elevatehqservices.com",
};

// Leave url empty until the profile exists; the icon shows but is not clickable.
export const socials: { name: string; icon: string; url: string }[] = [
  { name: "LinkedIn", icon: "linkedin", url: site.linkedin },
  { name: "Instagram", icon: "instagram", url: "" },
  { name: "Facebook", icon: "facebook", url: "" },
  { name: "YouTube", icon: "youtube", url: "" },
  { name: "X", icon: "x", url: "" },
  { name: "WhatsApp", icon: "whatsapp", url: site.whatsapp },
];

export type Service = {
  slug: string;
  title: string;
  summary: string;
  details: string[];
  audience: "organizations" | "individuals";
};

export const services: Service[] = [
  {
    slug: "posh",
    title: "PoSH compliance and training",
    summary:
      "Awareness sessions, Internal Committee training, and end-to-end compliance from committee formation to annual reporting, with trauma-informed inquiry guidance.",
    details: [
      "PoSH awareness and employee sensitization programs",
      "Internal Committee training and capacity building",
      "End-to-end compliance, from committee formation to annual reporting",
      "Trauma-informed, unbiased inquiry guidance",
      "Notices, circulars and IC meeting minutes",
      "Policy drafting in collaboration with your legal advisors",
      "Manager sensitization on responsibilities and preventive practices",
    ],
    audience: "organizations",
  },
  {
    slug: "organizational",
    title: "Organizational psychology",
    summary:
      "Workplace behavior analysis, leadership competency mapping, emotional intelligence at work, and support for stress, burnout and conflict.",
    details: [
      "Workplace behavior analysis and intervention",
      "Leadership behavior and competency mapping",
      "Emotional intelligence at work",
      "Stress, burnout and mental health interventions",
      "Conflict resolution and behavioral risk management",
    ],
    audience: "organizations",
  },
  {
    slug: "maritime",
    title: "Maritime psychology",
    summary: "Psychological support and training for seafarers and shipping companies, including seafarer mental health.",
    details: [
      "Seafarer mental health",
      "Psychosocial support for seafarers",
      "Training delivered by a certified maritime trainer",
    ],
    audience: "organizations",
  },
  {
    slug: "psychometric",
    title: "Psychometric assessment",
    summary:
      "Leadership, emotional intelligence and behavioral assessments, with personality and competency profiling and developmental feedback.",
    details: [
      "Psychometric testing and analysis across leadership, EQ and behavioral tools",
      "Personality and competency assessments",
      "Interpretation and developmental feedback",
      "Behavioral profiling for leadership and managerial roles",
      "Data-informed decisions for HR and leadership development",
    ],
    audience: "organizations",
  },
  {
    slug: "training",
    title: "Leadership, behavioral and soft skills training",
    summary:
      "Leadership development, communication, team building, decision-making and life skills, taught through case-based and scenario-driven learning.",
    details: [
      "Leadership development programs",
      "Soft skills and life skills training",
      "Team building and communication skills",
      "Behavioral interviewing skills",
      "Decision-making and problem-solving",
      "Experiential, case-based and scenario-driven learning",
    ],
    audience: "organizations",
  },
  {
    slug: "counselling",
    title: "Counselling",
    summary:
      "Individual and workplace counselling for stress, conflict, work-life balance, anger, trauma and emotional wellbeing, using CBT and trauma-informed support. Private sessions are available.",
    details: [
      "Individual and workplace counselling",
      "Cognitive behavioral therapy (CBT)",
      "Trauma-informed support",
      "Anger, stress and emotional regulation",
      "Psychosocial support for employees, seafarers and private clients",
    ],
    audience: "individuals",
  },
];

export const clients = [
  "Corporates",
  "Shipping companies",
  "Educational institutions",
  "Service sectors",
  "Individuals (private sessions)",
];

export const founderProfile = {
  headline: "Organizational & Maritime Psychologist · Psychometric Analyst · Counsellor",
  experience:
    "14 years of combined experience in psychology, counselling, psychometric assessment, training and behavioral sciences, including more than 10 years of specialized work in workplace behavior, leadership assessment, seafarer mental health and employee wellbeing.",
  doctorate: "Final year of a doctorate in psychology (management and organizational behavior).",
};

export const qualifications: string[] = [
  "Master's degree in Psychology (specialization: Organizational Behaviour)",
  "Doctorate in Psychology (PhD), management and organizational behavior: currently pursuing, final year",
];

export const certifications: string[] = [
  "Certified PoSH Trainer",
  "Certified Maritime Trainer",
  "Psychometric Testing and Analysis (multiple tools)",
  "Life Skills and Soft Skills Trainer",
  "Cognitive Behavioral Therapy (CBT)",
  "Trauma-Informed Inquiry and Behavioral Interviewing",
];

// CONFIRM WITH CLIENT before enabling
export const showPoshRole = false;
export const poshRole = "Presiding Officer (Chairperson), Internal Committee (IC-PoSH)";

export const steps = [
  {
    title: "Get in touch",
    body: "Send a message, call, or use WhatsApp. Tell us briefly whether you are enquiring as an organization or an individual, and what you would like support with.",
  },
  {
    title: "Have a first conversation",
    body: "We talk through what is going on, what you want to achieve, and whether we are the right fit.",
  },
  {
    title: "Begin the work",
    body: "Together we agree the format, whether sessions, a training program, an assessment or a compliance program, and review progress as it continues.",
  },
];

export const faqs = [
  {
    q: "Do you work with organizations as well as individuals?",
    a: "Yes. We work with corporates, shipping companies, educational institutions and service-sector organizations, as well as offering private counselling sessions for individuals.",
  },
  {
    q: "Do I need a diagnosis, or to be in crisis, to book?",
    a: "No. Many people and organizations come because they feel stuck, want to prevent a problem, or simply want to understand themselves or their teams better.",
  },
  {
    q: "What happens in the first session?",
    a: "We get to know each other. You share as much as you are comfortable with, we talk about your goals, and you can ask anything about how the work will proceed.",
  },
  {
    q: "Is what I share confidential?",
    a: "Yes. What you share stays confidential, apart from the exceptions the law requires, such as a serious risk to someone's safety.",
  },
  {
    q: "How do I enquire or book?",
    a: "Use the contact page, call, or message on WhatsApp. We will reply to confirm the next step.",
  },
];

export const principles = [
  {
    title: "Listening comes first",
    body: "Before any technique or tool, we make sure we understand your situation, or your organization's situation, as you see it.",
  },
  {
    title: "Practical, not abstract",
    body: "Sessions, assessments and training end with something you can use, so progress shows up in ordinary days and real workplaces.",
  },
  {
    title: "Confidentiality is protected",
    body: "What you share is kept confidential within the limits the law sets.",
  },
];

export const reviewsCopy = {
  intro: "If ElevateHQ has been useful to you, we would be glad to hear about it.",
  helper:
    "Use your first name or initials, or leave it blank to stay anonymous. Please don't include details about your sessions or about other people.",
  consent: "I agree to my feedback being shown on this website after it has been reviewed.",
  success: "Thank you. Your feedback will appear after it has been reviewed.",
  emptyState: "No feedback has been shared yet. Be the first.",
};
