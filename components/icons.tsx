import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  posh: <path d="M12 3l7 3v5c0 4.6-3 8.3-7 10-4-1.7-7-5.4-7-10V6l7-3z" />,
  organizational: (
    <>
      <circle cx="9" cy="8" r="2.5" />
      <circle cx="17" cy="9" r="2" />
      <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5M14.5 14.2c2.3.3 4 2.1 4 4.3" />
    </>
  ),
  maritime: <path d="M4 18l1.5-5h13L20 18M7 13V7h10v6M12 3v4M3 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />,
  psychometric: <path d="M4 20V10M10 20V4M16 20v-7M4 20h16" />,
  training: <path d="M3 8l9-4 9 4-9 4-9-4zM7 10.5V16c0 1.3 2.2 3 5 3s5-1.7 5-3v-5.5" />,
  counselling: (
    <path d="M12 20s-7-4.4-7-9.6C5 7 7.2 5 9.8 5c1.3 0 2.5.7 3.2 1.8.7-1.1 1.9-1.8 3.2-1.8 2.6 0 4.8 2 4.8 5.4C21 15.6 12 20 12 20z" />
  ),
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
  message: <path d="M4 5h16v11H8l-4 4V5z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5A7 7 0 0119 9.5C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  award: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13l-1.5 8 5-3 5 3-1.5-8" />
    </>
  ),
  book: <path d="M4 5.5A2.5 2.5 0 016.5 3H20v15H6.5A2.5 2.5 0 004 20.5v-15zM4 20.5A2.5 2.5 0 016.5 23H20" />,
  ear: <path d="M7 10a5 5 0 0110 0c0 3-3 4-3 7a3 3 0 01-6 0M10 10a2 2 0 014 0" />,
  compass: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </>
  ),
  building: <path d="M4 21V5l8-3v19M12 8h8v13M8 9h.01M8 13h.01M8 17h.01M16 12h.01M16 16h.01M2 21h20" />,
  ship: <path d="M4 18l1.5-5h13L20 18M7 13V7h10v6M12 3v4M3 21c1.5 1 3 1 4.5 0s3-1 4.5 0 3 1 4.5 0 3-1 4.5 0" />,
  school: <path d="M3 8l9-4 9 4-9 4-9-4zM7 10.5V16c0 1.3 2.2 3 5 3s5-1.7 5-3v-5.5" />,
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" />
    </>
  ),
  person: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.9 3.1-7 7-7s7 3.1 7 7" />
    </>
  ),
  linkedin: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M7.5 10.5v6M7.5 7.5v.01M11 16.5v-6M11 13.5c0-1.7 1.1-3 2.7-3s2.8 1.1 2.8 3v3" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.3 6.7v.01" />
    </>
  ),
  facebook: <path d="M15.5 3.5H13a4 4 0 00-4 4V10H6.5v3.5H9v7h3.5v-7H15l.5-3.5h-3V8a1 1 0 011-1h2V3.5z" />,
  youtube: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
      <path d="M10 9.3v5.4l4.6-2.7L10 9.3z" />
    </>
  ),
  x: <path d="M4 4h4.6l11.4 16h-4.6L4 4zM19.5 4l-6.4 7.1M4.5 20l6.4-7.1" />,
  whatsapp: (
    <>
      <path d="M3.5 20.5l1.4-4.1A8.5 8.5 0 1112 20.5a8.6 8.6 0 01-4.3-1.2l-4.2 1.2z" />
      <path d="M9 8.6c0 3.4 2.9 6.3 6.3 6.3l.9-1.5-2-1-.9.8a4.8 4.8 0 01-2.4-2.4l.8-.9-1-2L9 8.6z" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  "eye-off": (
    <path d="M3 3l18 18M10.6 5.1A10.4 10.4 0 0112 5c6.4 0 10 7 10 7a17.6 17.6 0 01-3.2 4.2M6.6 6.6C3.9 8.4 2 12 2 12s3.6 7 10 7a9.7 9.7 0 005.4-1.6M9.9 9.9a3 3 0 004.2 4.2" />
  ),
};

export function Icon({ name, className = "h-6 w-6" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name] ?? <circle cx="12" cy="12" r="8" />}
    </svg>
  );
}
