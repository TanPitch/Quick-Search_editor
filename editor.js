const textArea = document.querySelector("#input_area");
const dispArea = document.querySelector("#disp_area");

// style the table
function tableStyle() {
  document.querySelectorAll("table").forEach((table) => {
    let alignToTop = false;
    table.querySelectorAll("tbody td").forEach((td) => {
      const lines = td.innerHTML.split(/<li>|<\/li>|\r\n|\r|\n/);
      if (lines.length > 10) {
        alignToTop = true;
        return;
      }
    });

    table.querySelectorAll("tbody td").forEach((td) => {
      if (alignToTop) td.style.verticalAlign = "top";
      else td.style.verticalAlign = "middle";
    });

    var tds = table.querySelectorAll("tbody td");
    tds.forEach(function (td) {
      td.style.whiteSpace = "nowrap";
      var textWidth = td.offsetWidth;
      if (textWidth <= 250) {
        td.style.minWidth = textWidth + "px";
      } else {
        td.style.minWidth = "280px";
        td.style.maxWidth = "400px";
        td.style.whiteSpace = "wrap";
      }
    });
    var tableWidth = table.offsetWidth;

    if (tableWidth > 300) {
      table.style.width = "auto";

      // Create a new div wrapper
      var divWrapper = document.createElement("div");
      divWrapper.style.width = "100%";
      divWrapper.style.overflowX = "auto";
      divWrapper.appendChild(table.cloneNode(true)); // Clone the table and append to the wrapper
      table.parentNode.replaceChild(divWrapper, table); // Replace the original container with the wrapper
    } else {
      tds.forEach((td) => {
        td.style.maxWidth = "none";
      });
      table.style.width = "auto";
      table.style.overflowX = "hidden";
    }
  });
}

const renderer = {
  link(token) {
    if (token.href.match(/@drug-/g)) {
      const result = {};
      const el = token.href.split("-");
      el.forEach((element) => {
        if (element.startsWith("#doseMax")) {
          result.dose_max = element.split("*")[1] ? element.split("*")[1] : null;
          result.dose_max_unit = element.split("*")[2] ? element.split("*")[2] : null;
        } else if (element.startsWith("#dose")) {
          const doseArray = element.split("*");
          result.dose = doseArray[1];
          result.dose_unit = doseArray[2];
          result.dose_range =
            doseArray[3] && doseArray[4] && doseArray[5] ? [doseArray[3], doseArray[4]] : null;
          result.dose_range_unit = doseArray[3] && doseArray[4] && doseArray[5] ? doseArray[5] : null;
        } else if (element.startsWith("#freq")) {
          result.freq = element.split("*")[1];
          result.freq_range = element.split("*")[2] ? element.split("*")[2] : null;
        } else if (element.startsWith("#amount")) {
          const amountArray = element.split("*");
          result.amount = amountArray[1];
          result.amount_unit = [amountArray[2], amountArray[3]];
        }
      });

      return `<span onclick="openCalculator(${result.dose}, '${result.dose_unit}', '${result.freq}', ${result.amount}, '${result.amount_unit}', '${result.dose_range}', '${result.dose_range_unit}', ${result.dose_max}, '${result.dose_max_unit}', '${result.freq_range}')" class="drug_dose">${token.text}</span>`;
    }

    if (token.href.match(/@img-/g)) {
      console.log(token)
      const link = token.href.replace("@img-", "");
      return `<img src="${link}" alt="${token.text}"/>`
    }

    switch (token.href) {
      case "@find":
        return `<span class="btn hover-text" onclick="textSearch(this)">${token.text}</span>`;
      case "@text_grey":
        return `<span class="text-grey">${token.text}</span>`;
      case "@text_brown":
        return `<span class="text-brown">${token.text}</span>`;
      case "@text_orange":
        return `<span class="text-orange">${token.text}</span>`;
      case "@text_yellow":
        return `<span class="text-yellow">${token.text}</span>`;
      case "@text_green":
        return `<span class="text-green">${token.text}</span>`;
      case "@text_blue":
        return `<span class="text-blue">${token.text}</span>`;
      case "@text_purple":
        return `<span class="text-purple">${token.text}</span>`;
      case "@text_pink":
        return `<span class="text-pink">${token.text}</span>`;
      case "@text_red":
        return `<span class="text-red">${token.text}</span>`;

      case "@bg_grey":
        return `<span class="bg-grey">${token.text}</span>`;
      case "@bg_brown":
        return `<span class="bg-brown">${token.text}</span>`;
      case "@bg_orange":
        return `<span class="bg-orange">${token.text}</span>`;
      case "@bg_yellow":
        return `<span class="bg-yellow">${token.text}</span>`;
      case "@bg_green":
        return `<span class="bg-green">${token.text}</span>`;
      case "@bg_blue":
        return `<span class="bg-blue">${token.text}</span>`;
      case "@bg_purple":
        return `<span class="bg-purple">${token.text}</span>`;
      case "@bg_pink":
        return `<span class="bg-pink">${token.text}</span>`;
      case "@bg_red":
        return `<span class="bg-red">${token.text}</span>`;

      case "@under":
        return `<span class="text-under">${token.text}</span>`;

      case "@br":
        return `<br>`;
      case "@center":
        return `<center>${token.text}</center>`;
      case "@li":
        return `<li>${token.text}`;
      case "@li_sub":
        return `<ul>${token.text}</ul>`;

      default:
        return `<a href="${token.href}">${token.text}</a>`;
    }
  },
};
marked.use({ renderer });

// replace symbol TODO:
function loadMD(input) {
  dispArea.innerHTML = marked.parse(input);

  // clean blank table
  document.querySelectorAll("th").forEach((el) => {
    if (el.textContent == "") el.remove();
  });

  // replace symbol
  const symbols_dict = {
    ">=": "≥",
    "<=": "≤",
    "!=": "≠",
    "#<-)#": "↶",
    "#(->#": "↷",
    "#(<-)#": "↺",
    "#(->)#": "↻",
    "->": "→",
    "<-": "←",
    "=>": "⇒",
    "=<": "⇐",
    "|->": "↦",
    "<-|": "↤",
    "#up#": "↑",
    "#dn#": "↓",
    "#updb": "⇑",
    "#dndb": "⇓",
    "#upbar#": "↥",
    "#dnbar#": "↧",
    "#triup#": "▲",
    "#tridn#": "▼",
    "#rtlt#": "⇄",
    "#ltrt#": "⇆",
    "#updn#": "⇅",
    "#dnup#": "⇵",
    "#notlt#": "⇷",
    "#notrt#": "⇸",
  };
  document.body.querySelectorAll("*").forEach((el) => {
    if (el.nodeType === Node.ELEMENT_NODE) replaceInTextNodes(el, symbols_dict);
  });

  function replaceInTextNodes(node, dict) {
    if (node.nodeType === Node.TEXT_NODE) {
      let newText = node.textContent;
      Object.entries(dict).forEach(([key, value]) => {
        newText = newText.replaceAll(key, value);
      });
      node.textContent = newText;
    } else {
      var children = node.childNodes;
      for (var i = 0; i < children.length; i++) {
        replaceInTextNodes(children[i], dict);
      }
    }
  }

  // update tableStyle
  tableStyle();

  // replace code for Mermaid
  const mermaidCodeElements = document.querySelectorAll("code.language-mermaid");
  mermaidCodeElements.forEach((element) => {
    const code = element.textContent;
    const container = document.createElement("div");
    container.className = "mermaid";
    container.textContent = code;
    element.replaceWith(container);
  });
  mermaid.contentLoaded();
}

textArea.addEventListener("input", () => {
  const input_txt = textArea.value;
  loadMD(input_txt);
});

const btn_bold = document.querySelector("#btn_bold");
const btn_italic = document.querySelector("#btn_italic");
const btn_strike = document.querySelector("#btn_strike");
const btn_underline = document.querySelector("#btn_underline");

const btn_header1 = document.querySelector("#btn_header1");
const btn_header2 = document.querySelector("#btn_header2");
const btn_header3 = document.querySelector("#btn_header3");
const btn_header4 = document.querySelector("#btn_header4");
const btn_header5 = document.querySelector("#btn_header5");
const btn_header6 = document.querySelector("#btn_header6");

const btn_text_black = document.querySelector("#btn_text_black");
const btn_text_grey = document.querySelector("#btn_text_grey");
const btn_text_brown = document.querySelector("#btn_text_brown");
const btn_text_orange = document.querySelector("#btn_text_orange");
const btn_text_yellow = document.querySelector("#btn_text_yellow");
const btn_text_green = document.querySelector("#btn_text_green");
const btn_text_blue = document.querySelector("#btn_text_blue");
const btn_text_purple = document.querySelector("#btn_text_purple");
const btn_text_pink = document.querySelector("#btn_text_pink");
const btn_text_red = document.querySelector("#btn_text_red");

const btn_bg_none = document.querySelector("#btn_bg_none");
const btn_bg_grey = document.querySelector("#btn_bg_grey");
const btn_bg_brown = document.querySelector("#btn_bg_brown");
const btn_bg_orange = document.querySelector("#btn_bg_orange");
const btn_bg_yellow = document.querySelector("#btn_bg_yellow");
const btn_bg_green = document.querySelector("#btn_bg_green");
const btn_bg_blue = document.querySelector("#btn_bg_blue");
const btn_bg_purple = document.querySelector("#btn_bg_purple");
const btn_bg_pink = document.querySelector("#btn_bg_pink");
const btn_bg_red = document.querySelector("#btn_bg_red");

const btn_list_bullet = document.querySelector("#btn_list_bullet");
const btn_list_number = document.querySelector("#btn_list_number");

const btn_checklist = document.querySelector("#btn_checklist");
const btn_quote = document.querySelector("#btn_quote");
const btn_code = document.querySelector("#btn_code");
const btn_table = document.querySelector("#btn_table");
const btn_link = document.querySelector("#btn_link");
const btn_image = document.querySelector("#btn_image");
const btn_br = document.querySelector("#btn_br");
const btn_find = document.querySelector("#btn_find");
const btn_center = document.querySelector("#btn_center");

const btn_symbol_halflt = document.querySelector("#btn_symbol_halflt");
const btn_symbol_halfrt = document.querySelector("#btn_symbol_halfrt");
const btn_symbol_fulllt = document.querySelector("#btn_symbol_fulllt");
const btn_symbol_fullrt = document.querySelector("#btn_symbol_fullrt");
const btn_symbol_up = document.querySelector("#btn_symbol_up");
const btn_symbol_dn = document.querySelector("#btn_symbol_dn");
const btn_symbol_updb = document.querySelector("#btn_symbol_updb");
const btn_symbol_dndb = document.querySelector("#btn_symbol_dndb");
const btn_symbol_upbar = document.querySelector("#btn_symbol_upbar");
const btn_symbol_dnbar = document.querySelector("#btn_symbol_dnbar");
const btn_symbol_uptri = document.querySelector("#btn_symbol_uptri");
const btn_symbol_dntri = document.querySelector("#btn_symbol_dntri");
const btn_symbol_rtlt = document.querySelector("#btn_symbol_rtlt");
const btn_symbol_ltrt = document.querySelector("#btn_symbol_ltrt");
const btn_symbol_updn = document.querySelector("#btn_symbol_updn");
const btn_symbol_dnup = document.querySelector("#btn_symbol_dnup");
const btn_symbol_ltcross = document.querySelector("#btn_symbol_ltcross");
const btn_symbol_rtcross = document.querySelector("#btn_symbol_rtcross");

function replaceText(start, end, mode = "toggle") {
  var selectionStart = textArea.selectionStart;
  var selectionEnd = textArea.selectionEnd;
  var selectedText = textArea.value.substring(selectionStart, selectionEnd);

  if (mode == "toggle" && selectedText.includes(start) && selectedText.includes(end))
    selectedText = selectedText.replaceAll(start, "").replaceAll(end, "");
  else selectedText = `${start}${selectedText}${end}`;

  textArea.value = `${textArea.value.substring(0, selectionStart)}${selectedText}${textArea.value.substring(
    selectionEnd
  )}`;

  loadMD(textArea.value);
  textArea.setSelectionRange(selectionStart, selectionStart + selectedText.length);
}

btn_bold.addEventListener("click", () => {
  replaceText("**", "**");
});
btn_italic.addEventListener("click", () => {
  replaceText("*", "*");
});
btn_strike.addEventListener("click", () => {
  replaceText("~~", "~~");
});
btn_underline.addEventListener("click", () => {
  replaceText("[", "](@under)");
});

btn_header1.addEventListener("click", () => {
  replaceText("# ", "");
});
btn_header2.addEventListener("click", () => {
  replaceText("## ", "");
});
btn_header3.addEventListener("click", () => {
  replaceText("### ", "");
});
btn_header4.addEventListener("click", () => {
  replaceText("#### ", "");
});
btn_header5.addEventListener("click", () => {
  replaceText("##### ", "");
});
btn_header6.addEventListener("click", () => {
  replaceText("###### ", "");
});

btn_text_black.addEventListener("click", () => {
  replaceText("", "", "");
});
btn_text_grey.addEventListener("click", () => {
  replaceText("[", "](@text_grey)", "");
});
btn_text_brown.addEventListener("click", () => {
  replaceText("[", "](@text_brown)", "");
});
btn_text_orange.addEventListener("click", () => {
  replaceText("[", "](@text_orange)", "");
});
btn_text_yellow.addEventListener("click", () => {
  replaceText("[", "](@text_yellow)", "");
});
btn_text_green.addEventListener("click", () => {
  replaceText("[", "](@text_green)", "");
});
btn_text_blue.addEventListener("click", () => {
  replaceText("[", "](@text_blue)", "");
});
btn_text_purple.addEventListener("click", () => {
  replaceText("[", "](@text_purple)", "");
});
btn_text_pink.addEventListener("click", () => {
  replaceText("[", "](@text_pink)", "");
});
btn_text_red.addEventListener("click", () => {
  replaceText("[", "](@text_red)", "");
});

btn_bg_none.addEventListener("click", () => {
  replaceText("", "", "");
});
btn_bg_grey.addEventListener("click", () => {
  replaceText("[", "](@bg_grey)", "");
});
btn_bg_brown.addEventListener("click", () => {
  replaceText("[", "](@bg_brown)", "");
});
btn_bg_orange.addEventListener("click", () => {
  replaceText("[", "](@bg_orange)", "");
});
btn_bg_yellow.addEventListener("click", () => {
  replaceText("[", "](@bg_yellow)", "");
});
btn_bg_green.addEventListener("click", () => {
  replaceText("[", "](@bg_green)", "");
});
btn_bg_blue.addEventListener("click", () => {
  replaceText("[", "](@bg_blue)", "");
});
btn_bg_purple.addEventListener("click", () => {
  replaceText("[", "](@bg_purple)", "");
});
btn_bg_pink.addEventListener("click", () => {
  replaceText("[", "](@bg_pink)", "");
});
btn_bg_red.addEventListener("click", () => {
  replaceText("[", "](@bg_red)", "");
});

btn_list_bullet.addEventListener("click", () => {
  replaceText("- ", "");
});
btn_list_number.addEventListener("click", () => {
  replaceText("1. ", "");
});

btn_checklist.addEventListener("click", () => {
  replaceText("- [ ]", "");
});
btn_quote.addEventListener("click", () => {
  replaceText("> ", "");
});
btn_code.addEventListener("click", () => {
  replaceText("    ", "");
});
btn_table.addEventListener("click", () => {
  replaceText("|  |  |\n|--|--|\n|  |  |", "", "");
});
btn_link.addEventListener("click", () => {
  replaceText("[", "](url)");
});
btn_image.addEventListener("click", () => {
  replaceText("![", "](url)");
});
btn_br.addEventListener("click", () => {
  replaceText("<br>", "");
});
btn_find.addEventListener("click", () => {
  replaceText("[", "](@find)");
});
btn_center.addEventListener("click", () => {
  replaceText("[", "](@center)");
});

btn_symbol_halflt.addEventListener("click", () => {
  replaceText("#<-)#", "", "");
});
btn_symbol_halfrt.addEventListener("click", () => {
  replaceText("#->)#", "", "");
});
btn_symbol_fulllt.addEventListener("click", () => {
  replaceText("#(<-)#", "", "");
});
btn_symbol_fullrt.addEventListener("click", () => {
  replaceText("#(->)#", "", "");
});
btn_symbol_up.addEventListener("click", () => {
  replaceText("#up#", "", "");
});
btn_symbol_dn.addEventListener("click", () => {
  replaceText("#dn#", "", "");
});
btn_symbol_updb.addEventListener("click", () => {
  replaceText("#updb#", "", "");
});
btn_symbol_dndb.addEventListener("click", () => {
  replaceText("#dndb#", "", "");
});
btn_symbol_upbar.addEventListener("click", () => {
  replaceText("#upbar#", "", "");
});
btn_symbol_dnbar.addEventListener("click", () => {
  replaceText("#dnbar#", "", "");
});
btn_symbol_uptri.addEventListener("click", () => {
  replaceText("#triup#", "", "");
});
btn_symbol_dntri.addEventListener("click", () => {
  replaceText("#tridn#", "", "");
});
btn_symbol_rtlt.addEventListener("click", () => {
  replaceText("#rtlt#", "", "");
});
btn_symbol_ltrt.addEventListener("click", () => {
  replaceText("#ltrt#", "", "");
});
btn_symbol_updn.addEventListener("click", () => {
  replaceText("#updn#", "", "");
});
btn_symbol_dnup.addEventListener("click", () => {
  replaceText("#dnup#", "", "");
});
btn_symbol_ltcross.addEventListener("click", () => {
  replaceText("#notlt#", "", "");
});
btn_symbol_rtcross.addEventListener("click", () => {
  replaceText("#notrt#", "", "");
});

// #region : keyboard shortcut

textArea.addEventListener("keydown", (e) => {
  const startPos = textArea.selectionStart;
  const endPos = textArea.selectionEnd;
  const value = textArea.value;

  function getLinePositions(cursorPos) {
    let lineStart = cursorPos;
    let lineEnd = cursorPos;
    while (lineStart > 0 && value.charAt(lineStart - 1) !== "\n") lineStart--;
    while (lineEnd < value.length && value.charAt(lineEnd) !== "\n") lineEnd++;
    return { lineStart, lineEnd };
  }

  // TODO: move line using alt + arrow
  if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
    // e.preventDefault();
    // const { lineStart, lineEnd } = getLinePositions(startPos);
    // const currentLine = value.substring(lineStart, lineEnd);
    // const prevLineStart = value.lastIndexOf("\n", lineStart - 2) + 1;
    // const nextLineEnd = value.indexOf("\n", lineEnd + 1);
    // const nextLineStart = value.indexOf("\n", lineEnd + 1) + 1;
    // if (e.key === "ArrowUp" && prevLineStart >= 0) {
    //   const prevLineEnd = nextLineStart - 1;
    //   const prevLineContent = value.substring(prevLineStart, prevLineEnd);
    //   const newValue =
    //     value.substring(0, prevLineStart) +
    //     currentLine +
    //     value.substring(lineEnd, nextLineStart) +
    //     value.substring(prevLineEnd, lineStart) +
    //     value.substring(lineStart, lineEnd) +
    //     value.substring(nextLineEnd);
    //   textArea.value = newValue;
    //   textArea.setSelectionRange(prevLineStart, prevLineEnd);
    // } else if (e.key === "ArrowDown" && nextLineEnd < value.length) {
    //   // Move the line down
    //   const nextLineContent = value.substring(nextLineStart, nextLineEnd);
    //   const newValue =
    //     value.substring(0, lineStart) +
    //     value.substring(nextLineStart, nextLineEnd) +
    //     value.substring(lineEnd, nextLineEnd) +
    //     value.substring(lineStart, lineEnd) +
    //     value.substring(nextLineEnd);
    //   textArea.value = newValue;
    //   textArea.setSelectionRange(nextLineStart, nextLineEnd);
    // }
  } else if (e.key === "c" && e.ctrlKey) {
    // Ctrl + C to copy that line
    if (startPos !== endPos) return;
    e.preventDefault();
    const { lineStart, lineEnd } = getLinePositions(startPos);
    const lineText = "\n" + value.substring(lineStart, lineEnd);
    navigator.clipboard.writeText(lineText);
  } else if (e.key === "[" || e.key === "(" || e.key === "{" || e.key === "<") {
    if (startPos == endPos) return;
    e.preventDefault();
    switch (e.key) {
      case "[":
        replaceText("[", "]", "");
        break;
      case "(":
        replaceText("(", ")", "");
        break;
      case "<":
        replaceText("<", ">", "");
        break;
      case "{":
        replaceText("{", "}", "");
        break;
    }
  }
});

// #endregion
