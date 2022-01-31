import { cleanUrl, escape } from "./helpers.js";

import { defaults } from "./defaults.js";

/**
 * Renderer
 */
export class Renderer {
  constructor(options) {
    this.options = options || defaults;
  }

  async code(code, infostring, escaped) {
    const lang = (infostring || "").match(/\S*/)[0];
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang);
      if (out != null && out !== code) {
        escaped = true;
        code = out;
      }
    }

    code = code.replace(/\n$/, "") + "\n";

    if (!lang) {
      return (
        "<pre><code>" +
        (escaped ? code : escape(code, true)) +
        "</code></pre>\n"
      );
    }

    return (
      '<pre><code class="' +
      this.options.langPrefix +
      escape(lang, true) +
      '">' +
      (escaped ? code : escape(code, true)) +
      "</code></pre>\n"
    );
  }

  async blockquote(quote) {
    return "<blockquote>\n" + quote + "</blockquote>\n";
  }

  async html(html) {
    return html;
  }

  async heading(text, level, raw, slugger) {
    if (this.options.headerIds) {
      return (
        "<h" +
        level +
        ' id="' +
        this.options.headerPrefix +
        slugger.slug(raw) +
        '">' +
        text +
        "</h" +
        level +
        ">\n"
      );
    }
    // ignore IDs
    return "<h" + level + ">" + text + "</h" + level + ">\n";
  }

  async hr() {
    return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
  }

  async list(body, ordered, start) {
    const type = ordered ? "ol" : "ul",
      startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
  }

  async listitem(text) {
    return "<li>" + text + "</li>\n";
  }

  async checkbox(checked) {
    return (
      "<input " +
      (checked ? 'checked="" ' : "") +
      'disabled="" type="checkbox"' +
      (this.options.xhtml ? " /" : "") +
      "> "
    );
  }

  async paragraph(text) {
    return "<p>" + text + "</p>\n";
  }

  async table(header, body) {
    if (body) body = "<tbody>" + body + "</tbody>";

    return (
      "<table>\n" + "<thead>\n" + header + "</thead>\n" + body + "</table>\n"
    );
  }

  async tablerow(content) {
    return "<tr>\n" + content + "</tr>\n";
  }

  async tablecell(content, flags) {
    const type = flags.header ? "th" : "td";
    const tag = flags.align
      ? "<" + type + ' align="' + flags.align + '">'
      : "<" + type + ">";
    return tag + content + "</" + type + ">\n";
  }

  // span level renderer
  async strong(text) {
    return "<strong>" + text + "</strong>";
  }

  async em(text) {
    return "<em>" + text + "</em>";
  }

  async codespan(text) {
    return "<code>" + text + "</code>";
  }

  async br() {
    return this.options.xhtml ? "<br/>" : "<br>";
  }

  async del(text) {
    return "<del>" + text + "</del>";
  }

  async link(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }
    let out = '<a href="' + escape(href) + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }

  async image(href, title, text) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
    if (href === null) {
      return text;
    }

    let out = '<img src="' + href + '" alt="' + text + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += this.options.xhtml ? "/>" : ">";
    return out;
  }

  async text(text) {
    return text;
  }
}
