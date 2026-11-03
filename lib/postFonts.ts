// Fonts and text sizes the admin can pick in the blog editor. Each family is loaded in app/layout.tsx;
// the extra ones are not preloaded, so a page only downloads a font that its text actually uses.
type PostFont = { label: string; css: string };

export const postFontGroups: { group: string; fonts: PostFont[] }[] = [
  {
    group: "Modern",
    fonts: [
      { label: "Inter", css: "Inter, system-ui, sans-serif" },
      { label: "Poppins", css: "Poppins, system-ui, sans-serif" },
      { label: "Montserrat", css: "Montserrat, system-ui, sans-serif" },
      { label: "Nunito", css: "Nunito, system-ui, sans-serif" },
      { label: "Open Sans", css: "'Open Sans', system-ui, sans-serif" },
      { label: "Raleway", css: "Raleway, system-ui, sans-serif" },
      { label: "DM Sans", css: "'DM Sans', system-ui, sans-serif" },
    ],
  },
  {
    group: "Classic",
    fonts: [
      { label: "Lora", css: "Lora, Georgia, serif" },
      { label: "Merriweather", css: "Merriweather, Georgia, serif" },
      { label: "Playfair Display", css: "'Playfair Display', Georgia, serif" },
      { label: "EB Garamond", css: "'EB Garamond', Georgia, serif" },
      { label: "Libre Baskerville", css: "'Libre Baskerville', Georgia, serif" },
      { label: "Cormorant Garamond", css: "'Cormorant Garamond', Georgia, serif" },
    ],
  },
  {
    group: "Handwritten",
    fonts: [
      { label: "Dancing Script", css: "'Dancing Script', cursive" },
      { label: "Caveat", css: "Caveat, cursive" },
    ],
  },
];

export const postFonts: PostFont[] = postFontGroups.flatMap((g) => g.fonts);

const names = postFonts.map((f) => f.label).join("|");

/** Matches a font-family value whose first font is one of the choices above (quotes optional). */
export const postFontPattern = new RegExp(`^\\s*['"]?(${names})['"]?\\s*(,\\s*['"]?[\\w -]+['"]?\\s*)*$`, "i");

// Relative sizes (em) so they scale with the text on phones and desktops
export const postSizes = [
  { label: "Small", css: "0.875em" },
  { label: "Large", css: "1.25em" },
  { label: "Extra large", css: "1.5em" },
  { label: "Huge", css: "2em" },
] as const;

export const postSizePattern = new RegExp(`^(${postSizes.map((s) => s.css.replace(".", "\\.")).join("|")})$`);
