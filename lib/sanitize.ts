import sanitizeHtml from "sanitize-html";
import { postFontPattern, postSizePattern } from "@/lib/postFonts";

// Blog HTML comes from the admin editor, but it is cleaned on save anyway.
export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "hr", "code", "pre", "img", "span"],
    allowedAttributes: { a: ["href", "target", "rel"], img: ["src", "alt"], span: ["style"] },
    // Only the editor's font and size choices are kept; any other inline style is dropped
    allowedStyles: { span: { "font-family": [postFontPattern], "font-size": [postSizePattern] } },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["https"] }, // http images would be blocked or upgraded on an https site
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
