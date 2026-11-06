import {
  Caveat,
  Cormorant_Garamond,
  Dancing_Script,
  DM_Sans,
  EB_Garamond,
  Libre_Baskerville,
  Lora,
  Merriweather,
  Montserrat,
  Nunito,
  Open_Sans,
  Playfair_Display,
  Poppins,
  Raleway,
} from "next/font/google";

// Extra fonts for the blog editor's font menu (lib/postFonts.ts). Inter is already loaded by the site
// layout. Import this module only where post content is shown or edited (the blog post page and the
// admin panel), so other pages don't carry these @font-face rules. Not preloaded: a page only
// downloads a font its text actually uses.
const openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans", display: "swap", preload: false, style: ["normal", "italic"] });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap", preload: false, style: ["normal", "italic"] });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora", display: "swap", preload: false, style: ["normal", "italic"] });
const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  display: "swap",
  preload: false,
  weight: ["400", "700"],
  style: ["normal", "italic"],
});
const nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito", display: "swap", preload: false, style: ["normal", "italic"] });
const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  preload: false,
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat", display: "swap", preload: false, style: ["normal", "italic"] });
const raleway = Raleway({ subsets: ["latin"], variable: "--font-raleway", display: "swap", preload: false, style: ["normal", "italic"] });
const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap", preload: false, style: ["normal", "italic"] });
const ebGaramond = EB_Garamond({ subsets: ["latin"], variable: "--font-eb-garamond", display: "swap", preload: false, style: ["normal", "italic"] });
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-libre-baskerville",
  display: "swap",
  preload: false,
  weight: ["400", "700"],
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});
const dancingScript = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing-script", display: "swap", preload: false });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat", display: "swap", preload: false });

/** Class names for the element wrapping post content, so every editor font's @font-face rules are available. */
export const postFontVariables = [
  openSans,
  playfair,
  lora,
  merriweather,
  nunito,
  poppins,
  montserrat,
  raleway,
  dmSans,
  ebGaramond,
  libreBaskerville,
  cormorant,
  dancingScript,
  caveat,
]
  .map((f) => f.variable)
  .join(" ");
