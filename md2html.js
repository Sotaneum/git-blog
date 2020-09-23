class Md2Html {
  constructor() {
    this.html = "";
  }

  loadURL(url, callback) {
    const http = new XMLHttpRequest();
    http.open("GET", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = () => {
      if (http.readyState == 4) {
        this.loadMarkdown(http.responseText);
        callback(this.renderToHTML());
      }
    };
    http.send();
    return this;
  }

  loadMarkdown(markdown) {
    const compile = new (class {
      constructor(markdown) {
        this.html = markdown;
      }
      h() {
        const { html } = this;
        const resHtml = [];
        for (let line of html.split("\n")) {
          resHtml.push(line.replace(/^(#+) (.*)/g, (_, h, text) => {
            const style =
              h.length <= 2
                ? "padding-bottom: .3em; border-bottom: 1px solid #eaecef;"
                : "";
            return `<h${h.length} style="${style}">${text}</h${h.length}>`;
          }));
        }
        this.html = resHtml.join('');
        return this;
      }

      bold() {
        const { html } = this;
        this.html = html.replace(/\*\*(.*)\*\*/g, (_, text) => {
          return `<strong>${text}</strong>`;
        });
        return this;
      }
      italic() {
        const { html } = this;
        this.html = html.replace(/_(.*)_/g, (_, text) => {
          return `<span style="font-style: italic;">${text}</span>`;
        });
        return this;
      }
      del() {
        const { html } = this;
        this.html = html.replace(/~(.*)~/g, (_, text) => {
          return `<span style="text-decoration: line-through;">${text}</span>`;
        });
        return this;
      }
      br() {
        const { html } = this;
        this.html = html.replace(/\\n/g, "<br>");
        return this;
      }
      link() {
        const { html } = this;
        this.html = html.replace(/\[(.*)\]\((.*)\)/g, (_, text, link) => {
          return `<a href="${link}" style="color: #0366d6;
            text-decoration: none;">${text}</a>`;
        });
        return this;
      }
      code() {
        const { html } = this;
        this.html = html.replace(/\`(.*)\`/g, (_, text) => {
          return `<span style="padding: .2em .4em;margin: 0;font-size: 85%;background-color: rgba(27,31,35,.05);border-radius: 3px;">${text}</span>`;
        });
        return this;
      }
    })(markdown);
    this.html = compile
      .h()
      .bold()
      .italic()
      .del()
      .br()
      .link()
      .code().html;
    return this;
  }

  renderToHTML() {
    return this.html;
  }
}

const md2Html = new Md2Html();
md2Html.loadURL(
  "https://raw.githubusercontent.com/Sotaneum/PostgreSQL-Extension-Installer/beta/README.md",
  html => {
    const body = document.getElementById("body");
    body.innerHTML = html;
  }
);
