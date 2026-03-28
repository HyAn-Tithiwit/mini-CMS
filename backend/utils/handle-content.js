const { marked } = require("marked");
const sanitizeHtml = require("sanitize-html");

exports.processContent = (markdown) => {
  if (!markdown) {
    return "";
  }
  // B1: convert Markdown → HTML
  const rawHtml = marked(markdown);

  // B2: sanitize (lọc XSS)
  const cleanHtml = sanitizeHtml(rawHtml, {
    allowedTags: [
      "p", "h1", "h2", "h3",
      "ul", "ol", "li",
      "strong", "em",
      "a", "img", "blockquote", "code", "pre"
    ],
    allowedAttributes: {
      a: ["href", "target"],
      img: ["src", "alt"]
    },
    allowedSchemes: ["http", "https", "mailto"]
  });

  return cleanHtml;
};