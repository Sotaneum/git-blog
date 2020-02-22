
function render (md) {

    return "<div></div>";
}

function renderHTag (html, level) {
    return `<h${level}>${html}</h${level}>`;
}

function switchSytax (line) {
    const sytax = /(\t|  )+|([0-9]. )|(\> )|(\#+ )|([\-\*\+] )|((\!|)\[(\w+|)\]\(([\w\.\:\/]+|)\))/g;
    return line(sytax, '');
}

