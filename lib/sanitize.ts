import sanitizeHtml from "sanitize-html";

// Blog HTML comes from the admin editor, but it is cleaned on save anyway.
export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["h2", "h3", "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li", "blockquote", "hr", "code", "pre"],
    allowedAttributes: { a: ["href", "target", "rel"] },
    allowedSchemes: ["http", "https", "mailto", "tel"],
    transformTags: {
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer", target: "_blank" }),
    },
  });
}
