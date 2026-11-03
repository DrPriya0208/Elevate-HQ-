// Fonts the admin can pick in the blog editor. Each family is loaded in app/layout.tsx;
// the extra ones are not preloaded, so a page only downloads a font that its text actually uses.
export const postFonts = [
  { label: "Inter", css: "Inter, system-ui, sans-serif" },
  { label: "Poppins", css: "Poppins, system-ui, sans-serif" },
  { label: "Nunito", css: "Nunito, system-ui, sans-serif" },
  { label: "Lora", css: "Lora, Georgia, serif" },
  { label: "Merriweather", css: "Merriweather, Georgia, serif" },
  { label: "Playfair Display", css: "'Playfair Display', Georgia, serif" },
] as const;

const names = postFonts.map((f) => f.label).join("|");

/** Matches a font-family value whose first font is one of the choices above (quotes optional). */
export const postFontPattern = new RegExp(`^\\s*['"]?(${names})['"]?\\s*(,\\s*['"]?[\\w -]+['"]?\\s*)*$`, "i");
