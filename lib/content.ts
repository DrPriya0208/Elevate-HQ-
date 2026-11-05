// All editable site copy lives here.

export const site = {
  name: "Elevate HQ",
  tagline: "Psychology & Human Development Services",
  founder: "Priyadharshini",
  phone: "+91 98407 38955",
  phoneHref: "tel:+919840738955",
  whatsapp: "https://wa.me/919840738955",
  email: "info@elevatehqservices.com",
  location: "Sholinganallur, Chennai",
  linkedin: "https://www.linkedin.com/in/priyadharshini-balaji-b549031a5/",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://elevatehqservices.com",
  /** Calendly or Cal.com link for the free introductory call. Empty hides the booking card on the contact page. */
  bookingUrl: process.env.NEXT_PUBLIC_BOOKING_URL ?? "",
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

/* ---------- Home ---------- */

export const home = {
  title: "Psychology for every stage of life and work",
  intro:
    "From a first-year student to a seasoned CEO, from a homemaker to a seafarer far from shore, we offer psychology, counselling, assessments and training that help individuals thrive and organisations perform.",
  welcome:
    "Elevate HQ Psychology & Human Development Services is a purpose-led practice for people at every stage of life and work.",
  purpose: "Healthier minds, wholesome lives and workplaces where every person feels safe, valued and inspired to excel.",
  practiceTitle: "A practice for every person and every workplace",
  practice: [
    "Great lives and great workplaces are built by people who feel understood, capable and supported. Yet stress, conflict, burnout, uncertainty and unclear leadership quietly hold many people back, whatever their age, role or industry.",
    "Elevate HQ brings together psychology, counselling, scientific assessment and practical training to address these challenges at the root, and to help you move from coping to thriving.",
  ],
  promise:
    "We go beyond compliance to conscious culture-building: not tick-box sessions, but real and lasting change.",
};

export const whoWeServe: { icon: string; title: string; body: string }[] = [
  { icon: "child", title: "Children and teenagers", body: "Age-appropriate guidance, confidence-building and life skills, in partnership with parents and schools." },
  { icon: "school", title: "Students and young adults", body: "Counselling, career clarity, exam and campus-life support, and preparation for the world of work." },
  { icon: "briefcase", title: "Working professionals and freshers", body: "Support for stress, career transitions, communication and workplace relationships." },
  { icon: "home", title: "Homemakers, parents, couples and families", body: "A confidential space for family concerns, parenting, relationships and personal wellbeing." },
  { icon: "sun", title: "Mature adults and retirees", body: "Support through life transitions, change and emotional wellbeing." },
  { icon: "compass", title: "Leaders, entrepreneurs and business owners", body: "Leadership profiling, coaching conversations and culture-building." },
  { icon: "building", title: "Startups, SMEs and corporates", body: "Training, assessments, PoSH compliance and wellbeing programmes for teams of every size." },
  { icon: "ship", title: "Seafarers, shipping and maritime companies", body: "Psychological support for crew, families and shore staff." },
  { icon: "book", title: "Schools, colleges and universities", body: "Student programmes, staff development and campus-to-corporate readiness sessions." },
  { icon: "hands", title: "NGOs, healthcare and service-sector organisations", body: "Wellbeing, conduct and capability programmes for people-facing teams." },
];

// The four strongest reasons; years of experience and credentials sit in the strip under the hero.
export const whyChoose: { icon: string; text: string }[] = [
  { icon: "ship", text: "Specialist in workplace and maritime psychology. Few practitioners offer both." },
  { icon: "posh", text: "Practising Presiding Officer (Chairperson) of Internal Committees under the PoSH Act." },
  { icon: "psychometric", text: "Evidence-based and ethical. Every method is grounded in behavioural science." },
  { icon: "lock", text: "Inclusive and confidential. Respect for every background, culture and role, and your trust is never taken lightly." },
];

/** Shown in the strip under the home hero until client reviews come in. */
export const credentials: { title: string; detail: string }[] = [
  { title: "14 years", detail: "Combined experience in psychology, counselling, assessments and training" },
  { title: "Presiding Officer", detail: "Internal Committees under the PoSH Act" },
  { title: "Doctoral researcher", detail: "Psychology, Management and Organisational Behaviour (final year)" },
  { title: "Certified trainer", detail: "PoSH and maritime training" },
];

export const howWeWork: { title: string; body: string; icon: string }[] = [
  { title: "Listen", body: "Understand your needs, goals and challenges.", icon: "ear" },
  { title: "Assess", body: "Use the right tools and observations.", icon: "psychometric" },
  { title: "Design", body: "Create a clear, customised plan.", icon: "pencil" },
  { title: "Deliver", body: "Counselling, training or consulting with care.", icon: "handshake" },
  { title: "Review", body: "Measure progress and keep improving.", icon: "refresh" },
];

export const whoChoosesUs = [
  "Students, parents, families and individuals of all ages",
  "Working professionals and leaders",
  "Corporates, startups and service companies",
  "Shipping and maritime organisations",
  "Schools, colleges and institutions",
  "NGOs, healthcare and community organisations",
];

/* ---------- Services ---------- */

export type Service = {
  slug: string;
  title: string;
  /** Short line for cards and the "at a glance" list. */
  summary: string;
  audience: string;
  intro: string[];
  listTitle: string;
  details: string[];
  steps?: { title: string; items: string[] };
  notes?: { label: string; text: string }[];
  cta: string;
  /** Matches an option in enquiryTopics, so the contact form can be pre-filled. */
  topic: string;
};

export const services: Service[] = [
  {
    slug: "counselling",
    title: "Counselling and Therapy",
    summary: "A safe space to talk, heal and grow.",
    audience: "For individuals and families",
    intro: [
      "Life and work can feel heavy at any age. Our counselling sessions offer a private, judgement-free space to understand your emotions, build healthy coping skills and move forward with clarity.",
      "We work with children and teenagers (with parent or guardian involvement), students, adults, couples, families and senior members of the community.",
    ],
    listTitle: "We support you with",
    details: [
      "Stress, anxiety and overwhelm",
      "Burnout and work-life balance",
      "Anger and emotional regulation",
      "Relationship, parenting and family concerns",
      "Workplace conflict and career confusion",
      "Trauma-informed emotional support",
      "Confidence and personal growth",
      "Student, exam and peer-related stress",
      "Life transitions, loss and change",
    ],
    steps: {
      title: "How it works",
      items: [
        "Book a free introductory call or send an enquiry.",
        "Meet your counsellor for a first session.",
        "Build a simple plan together.",
        "Grow at your own pace, online or in person.",
      ],
    },
    notes: [{ label: "Your privacy matters", text: "Every session is strictly confidential." }],
    cta: "Book a session",
    topic: "Personal or family counselling",
  },
  {
    slug: "psychometric",
    title: "Psychometric Assessments",
    summary: "Understand personality, leadership style and strengths with data, not guesswork.",
    audience: "For individuals and organisations",
    intro: [
      "Important decisions about careers and teams deserve more than instinct. Our scientifically designed assessments offer clear, reliable insight into personality, emotional intelligence, leadership potential and behavioural competencies, for school students, graduates, professionals and senior leaders alike.",
    ],
    listTitle: "What we offer",
    details: [
      "Personality and competency assessments",
      "Leadership and emotional intelligence profiling",
      "Behavioural profiling for managerial roles",
      "Career guidance for students and professionals",
      "Detailed interpretation reports",
      "One-to-one developmental feedback sessions",
    ],
    notes: [
      { label: "Benefits for organisations", text: "Better hiring, smarter promotions, stronger succession planning and targeted training." },
      { label: "Benefits for individuals", text: "Self-awareness, career clarity and a roadmap for growth." },
    ],
    cta: "Request an assessment",
    topic: "Psychometric assessment",
  },
  {
    slug: "training",
    title: "Leadership, Behavioural and Soft Skills Training",
    summary: "Practical programmes people actually enjoy and use.",
    audience: "For students, teams and leaders",
    intro: [
      "Our sessions are interactive, story-driven and rooted in real situations. They are designed to suit every audience, from school and college students to frontline teams, managers and the boardroom, with no jargon and no dull slides.",
    ],
    listTitle: "Popular programmes",
    details: [
      "Leadership Development Programme",
      "Emotional Intelligence at Work",
      "Communication and Team Building",
      "Decision-Making and Problem-Solving",
      "Conflict Management",
      "Stress and Burnout Management",
      "Behavioural Interviewing Skills (for hiring managers)",
      "Life Skills and Soft Skills for students and freshers",
      "Campus-to-corporate readiness sessions",
      "Talks and workshops for schools, colleges and institutions",
    ],
    notes: [
      { label: "Formats", text: "Workshops, talks, half-day or full-day programmes, multi-session series, online or on-site." },
    ],
    cta: "Plan a training programme",
    topic: "Leadership or soft skills training",
  },
  {
    slug: "posh",
    title: "PoSH Compliance and Training",
    summary: "Complete support from Internal Committee setup to annual reporting.",
    audience: "For organisations",
    intro: [
      "The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013 requires every eligible organisation to have a properly formed Internal Committee and to follow clear procedures. Non-compliance can lead to penalties and, more importantly, an unsafe culture.",
      "Elevate HQ offers end-to-end PoSH support, from formation to annual reporting, for corporates, startups, shipping companies, educational institutions and service-sector organisations.",
    ],
    listTitle: "Our PoSH services",
    details: [
      "Internal Committee (IC) formation guidance",
      "External Member / Presiding Officer support for the IC",
      "Employee awareness and sensitisation programmes",
      "IC member training and capacity building",
      "Manager sensitisation on roles and responsibilities",
      "Trauma-informed, unbiased inquiry guidance",
      "Notices, circulars, documentation and IC meeting minutes",
      "PoSH policy drafting (in collaboration with your legal advisors)",
      "Annual report preparation",
    ],
    notes: [
      {
        label: "What makes us different",
        text: "We do not just train on the law. As a practising Presiding Officer of Internal Committees, we bring real inquiry experience and a trauma-informed approach, protecting both the complainant and the process.",
      },
    ],
    cta: "Get PoSH support",
    topic: "PoSH compliance or training",
  },
  {
    slug: "organizational",
    title: "Organisational Psychology Consulting",
    summary: "Culture, conflict, wellbeing and behaviour solutions.",
    audience: "For organisations",
    intro: [
      "Strategy succeeds only when culture, communication and wellbeing are strong. We examine what is truly happening within your organisation, whether a start-up, an established corporate, an institution or a service team, and design practical, measurable solutions.",
    ],
    listTitle: "We help with",
    details: [
      "Workplace behaviour analysis and intervention",
      "Leadership behaviour and competency mapping",
      "Team conflict and group dynamics",
      "Employee wellbeing and mental health programmes",
      "Behavioural risk management",
      "Building psychologically safe and inclusive workplaces",
    ],
    cta: "Talk to our consultant",
    topic: "Organisational consulting",
  },
  {
    slug: "maritime",
    title: "Maritime Psychology",
    summary: "Mental health and behavioural support for seafarers and shipping companies.",
    audience: "For seafarers, shore staff and shipping companies",
    intro: [
      "Life at sea involves long separations, isolation, fatigue, pressure and high-risk work. Seafarers, their families and shipping companies need psychological support that genuinely understands this world.",
    ],
    listTitle: "Our maritime services",
    details: [
      "Counselling and psychosocial support for seafarers, shore staff and families",
      "Mental health awareness for crew and shore staff",
      "Stress, fatigue and emotional regulation training",
      "Behavioural assessments for maritime roles",
      "Psychometric assessments for all ranks and shore staff",
      "Superintendent testing",
      "Leadership programmes and team-building sessions for shore staff and seafarers",
      "PoSH awareness sessions, IC building and workplace conduct training for shipping companies and shore staff",
      "Women at Sea sessions and briefings",
      "Onboard daily wellbeing checks",
      "Crisis intervention and psychological emergency support",
    ],
    cta: "Enquire about maritime services",
    topic: "Maritime psychology",
  },
  {
    slug: "students",
    title: "Student Programmes",
    summary: "End-to-end support for students, parents, teachers and institutions.",
    audience: "For students, parents and institutions",
    // Draft intro written from the programme list; confirm wording with Priyadharshini.
    intro: [
      "From exam pressure to career choices, students face challenges that affect both learning and wellbeing.",
      "We offer end-to-end support for students, parents, teachers and institutions, from one-to-one counselling to school and college-wide programmes.",
    ],
    listTitle: "What we offer",
    details: [
      "Psychological counselling: individual, family, child, adolescent and student counselling",
      "Career guidance and career counselling",
      "Student wellbeing: examination stress, academic challenges, anxiety and emotional management",
      "Bullying, harassment, peer pressure and behavioural support",
      "School, college and institutional psychology services",
      "Parent counselling, parenting support and teacher sensitisation",
    ],
    cta: "Plan a student programme",
    topic: "Student or school programme",
  },
];

export const enquiryTopics = [...services.map((s) => s.topic), "Something else"];

/* ---------- About ---------- */

export const about = {
  title: "Where compassion meets science",
  storyBelief:
    "Elevate HQ was founded on one belief: every person deserves to feel mentally strong, and every workplace deserves to be safe, respectful and productive.",
  story: [
    "Our founder, Priyadharshini, is an Organisational and Maritime Psychologist, Psychometric Analyst, Counsellor and certified PoSH Trainer. With 14 years of combined experience and over a decade of specialised work in workplace behaviour, leadership assessment, seafarer mental health and employee wellbeing, she has supported people across corporates, shipping companies, educational institutions and service sectors.",
    "She is also a Presiding Officer (Chairperson) of Internal Committees under PoSH, and is currently in the final year of her doctoral research in Psychology (Management and Organisational Behaviour). This blend of hands-on practice and academic depth shapes everything we do.",
  ],
  mission: "To make psychological wellbeing, healthy and safe workplaces accessible to every individual and organisation.",
  vision:
    "To be a trusted name in psychology and people development, where compassion meets science and every step creates measurable change.",
};

export const values: { letter: string; title: string; body: string }[] = [
  { letter: "E", title: "Empathy", body: "We listen first, then guide." },
  { letter: "L", title: "Learning and Growth", body: "Everyone can grow, at any age and any stage." },
  { letter: "E", title: "Ethics and Confidentiality", body: "Integrity and privacy, always." },
  { letter: "V", title: "Valuing Diversity", body: "Every voice, culture and sector, respected." },
  { letter: "A", title: "Authenticity", body: "Honest conversations, without judgement." },
  { letter: "T", title: "Trust", body: "Dependable, transparent, consistent." },
  { letter: "E", title: "Excellence", body: "Practical delivery that creates real results." },
  { letter: "H", title: "Humanity", body: "People come before processes." },
  { letter: "Q", title: "Quotient", body: "Elevating the Human Quotient wherever people live, learn and work." },
];

export const founder = {
  name: "Priyadharshini",
  role: "Founder",
  titles: [
    "Organisational and Maritime Psychologist",
    "Psychometric Analyst",
    "Counsellor",
    "Presiding Officer, IC-PoSH",
    "Certified PoSH Trainer",
    "Leadership and Soft Skills Trainer",
    "Corporate Trainer",
    "Speaker in schools and institutions",
  ],
  qualifications: [
    "Master's in Psychology (Organisational Behaviour)",
    "Doctorate in Psychology, Management and Organisational Behaviour (final year)",
    "Certified PoSH Trainer",
    "Certified Maritime Trainer",
    "Psychometric Testing and Analysis (multiple tools)",
    "Life Skills and Soft Skills Trainer",
    "Cognitive Behavioural Therapy (CBT)",
    "Trauma-Informed Inquiry and Behavioural Interviewing",
  ],
  alsoOffered:
    "Individual and family counselling; training sessions and talks for schools and institutions; campus-to-corporate sessions and other tailored needs.",
};

export const coFounder = {
  name: "Balaji",
  role: "Co-Founder",
  linkedin: "https://www.linkedin.com/in/balaji-s-67879413/",
  headline: "HR and Marketing Professional · 18 years of experience",
  bio: [
    "Balaji brings 18 years of experience in Human Resources and Marketing, with a deep understanding of how people, culture and communication drive an organisation's success.",
    "As Co-Founder, he shapes the business side of Elevate HQ, building corporate partnerships and strengthening our brand so that every programme stays practical and relevant to real workplace needs.",
    "Together with Priyadharshini, he brings balance: science and compassion on one side, strategy and reach on the other.",
  ],
  strengths: [
    "HR and people management",
    "Business development, marketing and brand building",
    "Corporate partnerships",
    "Employee engagement",
  ],
};

/* ---------- FAQ ---------- */

export const faqs = [
  {
    q: "Who can approach Elevate HQ?",
    a: "Anyone. We work with children and teenagers (with guardian involvement), students, adults, families, senior citizens, professionals, leaders, seafarers and organisations of every size and sector.",
  },
  {
    q: "Is counselling confidential?",
    a: "Yes. Your sessions are private. Exceptions apply only where the law requires disclosure or where there is serious risk to life.",
  },
  {
    q: "Do you offer online sessions?",
    a: "Yes. Counselling and training are available online and in person.",
  },
  {
    q: "Who needs PoSH compliance?",
    a: "Organisations with ten or more employees must have an Internal Committee under the PoSH Act. Smaller workplaces fall under the Local Committee system. We can guide you on what applies to you.",
  },
  {
    q: "Can you customise training for our company or institution?",
    a: "Absolutely. Every programme is tailored to your industry, audience level and goals.",
  },
  {
    q: "How do I know which assessment is right for me or my team?",
    a: "Tell us your purpose, such as hiring, promotion, career choice or development, and we will recommend the right tools.",
  },
  {
    q: "Do you work with students and schools?",
    a: "Yes. We offer counselling, career guidance, life skills programmes and talks for students, parents and institutions.",
  },
  {
    q: "How do I begin?",
    a: "Book a free introductory call. We will understand your needs and suggest the next step.",
  },
];

/* ---------- Reviews ---------- */

export const reviewsCopy = {
  intro: "If Elevate HQ has been useful to you, we would be glad to hear about it.",
  helper:
    "Use your first name or initials, or leave it blank to stay anonymous. Please don't include details about your sessions or about other people.",
  consent: "I agree to my feedback being shown on this website after it has been reviewed.",
  success: "Thank you. Your feedback will appear after it has been reviewed.",
  emptyState: "No feedback has been shared yet. Be the first.",
};
