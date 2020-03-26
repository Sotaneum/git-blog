function h(md) {
  const html = md.replace(/#+ .*/g, targetMd => {
    const hNumber = targetMd.split(" ")[0].length;
    const text = targetMd.slice(hNumber + 1);
    const style = hNumber <= 2 ? "padding-bottom: .3em; border-bottom: 1px solid #eaecef;" : "";
    return `<h${hNumber} style="${style}">${text}</h${hNumber}>`;
  });
  return html;
}

function quoteBox(md) {
  const html = md.replace(/> (.*)\n/g, (_, text) => {
    return `<span style="padding: 0 1em; color: #6a737d; border-left: .25em solid #dfe2e5;">${text}</span>`;
  });
  return html;
}

function bold(md) {
  const html = md.replace(/\*\*(.*)\*\*/g, (_, text) => {
    return `<strong>${text}</strong>`;
  });
  return html;
}

function italic(md) {
  const html = md.replace(/_(.*)_/g, (_, text) => {
    return `<span style="font-style: italic;">${text}</span>`;
  });
  return html;
}

function del(md) {
  const html = md.replace(/~(.*)~/g, (_, text) => {
    return `<span style="text-decoration: line-through;">${text}</span>`;
  });
  return html;
}

function br(md) {
  const html = md.replace(/\\n/g, "<br>");
  return html;
}

function link(md) {
  const html = md.replace(/\[(.*)\]\((.*)\)/g, (_, text, link) => {
    return `<a href="${link}" style="color: #0366d6;
    text-decoration: none;">${text}</a>`;
  });
  return html;
}

function code(md) {
  const html = md.replace(/\`(.*)\`/g, (_, text) => {
    return `<span style="padding: .2em .4em;margin: 0;font-size: 85%;background-color: rgba(27,31,35,.05);border-radius: 3px;">${text}</span>`;
  });
  return html;
}

function md2Html(md) {
  const html = [];
  let isCode = false;
  for(let line of md.split('\n')) {
    const mulitCode = line.replace(/```(.*)/g, (_, text) => {
      if (text.length !== 0) {
        isCode = true;
        return "<code>";
      }
      return "</code>";
    });
    if (isCode) {
      html.push(mulitCode+"<br>");
      if (mulitCode === "</code>") {
        isCode = false;
      }
    } else {
      html.push(h(quoteBox(bold(italic(del(br(code(link(line)))))))));
    }
  }

  //const html = h(quoteBox(bold(italic(del(br(code(mulitCode(link(md)))))))));
  const body = document.getElementById("body");
  body.innerHTML = html.join('');
}

function get(url) {
  const http = new XMLHttpRequest();
  http.open("GET", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function() {
    if (http.readyState == 4) {
      md2Html(http.responseText);
    }
  };
  http.send();
}
