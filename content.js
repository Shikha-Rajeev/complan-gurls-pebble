(function () {
  "use strict";

  if (window.__pebbleLoaded) return;
  window.__pebbleLoaded = true;

  // ---- SCAM PATTERNS ----
  // Each pattern has: regex, a scam type, and a short kid-friendly message

  const PATTERNS = [
    /*{
    "urlPatterns": [
        "free-robux",
        "robux-generator",
        "free-vbucks",
        "vbucks-generator",
        "free-gems",
        "coin-generator",
        "hack-generator",
        "free-skins",
        "claim-prize",
        "winner-selected",
        "gift-card-winner",
        "free-minecraft",
        "fortnite-free"
    ],
    "pagePatterns": [
        "free robux",
        "free v-bucks",
        "free vbucks",
        "you have been selected",
        "you are our lucky winner",
        "you have won",
        "claim your prize",
        "claim your reward",
        "unlimited coins",
        "unlimited gems",
        "enter your password to claim",
        "complete a survey to get",
        "human verification required",
        "verify you are human to receive",
        "free gift card",
        "congratulations you won",
        "send this to 10 friends",
        "your account has been compromised click here"
    ]
    },*/
    {
      pattern: /free\s*robux/i,
      type: "fake_currency",
      flag: "free robux",
      msg: "No website can give you free Robux. This is a scam! 🚨",
      tip: "Robux can only come from the official Roblox site.",
      learn: "Scammers build fake sites that look real. They want your username and password so they can log into your actual account and steal it or sell it."
    },
    {
      pattern: /free\s*v[\-\s]?bucks/i,
      type: "fake_currency",
      flag: "free V-Bucks",
      msg: "Free V-Bucks generators are always fake. Don't enter anything! 🚨",
      tip: "Only buy V-Bucks from the official Fortnite store.",
      learn: "Scammers make fake V-Bucks generators to trick you into giving them your account info."
    },
    {
      pattern: /generate.*robux/i,
      type: "fake_currency",
      flag: "Robux generator",
      msg: "Robux can't be 'generated'. This page is lying to you! 🚨",
      tip: "Scammers use this trick to steal your Roblox account.",
      learn: "Scammers make fake Robux generators to trick you into giving them your account info."
    },
    {
      pattern: /free\s*skins?/i,
      type: "fake_item",
      flag: "free skins",
      msg: "Free skin sites steal your game account. Be careful! ⚠️",
      tip: "Only get skins from official in-game stores.",
      learn: "Scammers make fake skin sites to trick you into giving them your account info."   
    },
    {
      pattern: /enter your (roblox |fortnite |)password/i,
      type: "password_steal",
      flag: "enter your password",
      msg: "STOP! Never give your password to a random website! 🔐",
      tip: "This site is trying to steal your account.",
      learn: "Scammers build fake sites that look real. They want your username and password so they can log into your actual account and steal it or sell it."
    },
    {
      pattern: /verify you('re| are) human to (get|claim|receive)/i,
      type: "verification_scam",
      flag: "verify you're human",
      msg: "This fake 'human check' is a scam trick. Leave now! ⚠️",
      tip: "Real sites don't make you verify to get free things.",
      learn: "Scammers make fake 'human verification' checks to trick you into giving them your account info."  
    },
    {
      pattern: /you('ve| have) (won|been selected|been chosen)/i,
      type: "fake_winner",
      flag: "you've won",
      msg: "You didn't really win anything — this is a trick! 🎭",
      tip: "These 'winner' messages go to everyone who visits.",
      learn: "Scammers make fake 'winner' messages to trick you into giving them your account info."
    },
    {
      pattern: /claim your (free |)gift card/i,
      type: "gift_card",
      flag: "claim your gift card",
      msg: "Free gift card sites are almost always scams! 🎁",
      tip: "They collect your info but never send anything.",
      learn: "Scammers make fake gift card sites to trick you into giving them your account info."
    },
    {
      pattern: /limited time.*free/i,
      type: "urgency",
      flag: "limited time free",
      msg: "That countdown is fake — they're rushing you on purpose! ⏰",
      tip: "Scammers use urgency so you don't stop to think.",
        learn: "Scammers create fake countdowns to pressure you into giving them your account info before you realize it's a trick."
    },
  ];

  // ---- FIND MATCHING TEXT NODE ----
  // Walk the DOM to find a text node that matches a pattern
  // Returns { node, pattern } or null

  function findMatchInPage() {
    // Skip script/style/head tags
    const skipTags = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "HEAD", "META", "LINK"]);

    // TreeWalker gives us all text nodes efficiently
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          // Skip invisible elements
          const style = window.getComputedStyle(parent);
          if (style.display === "none" || style.visibility === "hidden") return NodeFilter.FILTER_REJECT;
          if (node.textContent.trim().length < 3) return NodeFilter.FILTER_SKIP;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );

    let node;
    while ((node = walker.nextNode())) {
      const text = node.textContent;
      for (const p of PATTERNS) {
        if (p.pattern.test(text)) {
          return { node, patternInfo: p };
        }
      }
    }
    return null;
  }

  // ---- HIGHLIGHT THE FLAGGED TEXT ----
  // Wraps the matched phrase in a <mark> span and returns the element

  function highlightMatch(textNode, patternInfo) {
    const text = textNode.textContent;
    const match = text.match(patternInfo.pattern);
    if (!match) return textNode.parentElement;

    const before = text.slice(0, match.index);
    const matched = match[0];
    const after = text.slice(match.index + matched.length);

    const mark = document.createElement("mark");
    mark.className = "pebble-highlight";
    mark.textContent = matched;
    mark.style.cssText = `
      background: #ffd93d !important;
      color: #5a3e2b !important;
      border-radius: 4px !important;
      padding: 1px 3px !important;
      font-weight: 700 !important;
      outline: 2px solid #ff7a2f !important;
      cursor: pointer !important;
      position: relative !important;
      z-index: 9999 !important;
    `;

    const fragment = document.createDocumentFragment();
    if (before) fragment.appendChild(document.createTextNode(before));
    fragment.appendChild(mark);
    if (after) fragment.appendChild(document.createTextNode(after));

    textNode.parentElement.replaceChild(fragment, textNode);
    return mark;
  }

  // ---- BUILD TOOLTIP ----

  function createTooltip(patternInfo) {
  const tip = document.createElement("div");
  tip.id = "pebble-tooltip";
  tip.innerHTML = `
    <div class="pb-inner">
      <div class="pb-top">
        <span class="pb-icon">🛡️</span>
        <div class="pb-text">
          <strong class="pb-msg">${patternInfo.msg}</strong>
          <span class="pb-tip">${patternInfo.tip}</span>
        </div>
        <button class="pb-close" id="pb-close">✕</button>
      </div>

      ${patternInfo.learn ? `
      <div class="pb-learn-section">
        <button class="pb-learn-toggle" id="pb-learn-toggle">
          <span class="pb-learn-icon">💡</span>
          <span class="pb-learn-label">Why is this a scam?</span>
          <span class="pb-learn-chevron">▾</span>
        </button>
        <div class="pb-learn-body" id="pb-learn-body">
          <div class="pb-learn-content">${patternInfo.learn}</div>
        </div>
      </div>
      ` : ''}

      <div class="pb-actions">
        <button class="pb-btn pb-btn-safe" id="pb-safe">🏃 Leave this page</button>
        <button class="pb-btn pb-btn-parent" id="pb-parent">👋 Ask a parent</button>
      </div>
    </div>
    <div class="pb-arrow" id="pb-arrow"></div>
  `;
  return tip;
}

  // ---- POSITION TOOLTIP NEXT TO ELEMENT ----

  function positionTooltip(tooltip, targetEl) {
    document.body.appendChild(tooltip);

    const rect = targetEl.getBoundingClientRect();
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const tipW = tooltip.offsetWidth || 320;
    const tipH = tooltip.offsetHeight || 120;

    const arrow = tooltip.querySelector("#pb-arrow");
    let left, top, arrowClass;

    // Try right of element first
    if (rect.right + tipW + 16 < vw) {
      left = rect.right + scrollX + 12;
      top = rect.top + scrollY + rect.height / 2 - tipH / 2;
      arrowClass = "pb-arrow-left";
    }
    // Try left of element
    else if (rect.left - tipW - 16 > 0) {
      left = rect.left + scrollX - tipW - 12;
      top = rect.top + scrollY + rect.height / 2 - tipH / 2;
      arrowClass = "pb-arrow-right";
    }
    // Fall back: below element
    else {
      left = Math.max(8, rect.left + scrollX + rect.width / 2 - tipW / 2);
      top = rect.bottom + scrollY + 12;
      arrowClass = "pb-arrow-top";
    }

    // Clamp vertically
    top = Math.max(scrollY + 8, Math.min(top, scrollY + vh - tipH - 8));
    // Clamp horizontally
    left = Math.max(8, Math.min(left, vw + scrollX - tipW - 8));

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";

    if (arrow) arrow.className = "pb-arrow " + arrowClass;
  }

  // ---- INJECT STYLES ----

  function injectStyles() {
    if (document.getElementById("pebble-styles")) return;
    const style = document.createElement("style");
    style.id = "pebble-styles";
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Fredoka+One&display=swap');

      #pebble-tooltip {
        position: absolute;
        z-index: 2147483647;
        width: 300px;
        font-family: 'Baloo 2', sans-serif;
        filter: drop-shadow(0 8px 24px rgba(180,100,30,0.25));
        opacity: 0;
        transform: scale(0.88);
        transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
        pointer-events: none;
      }

      #pebble-tooltip.pb-visible {
        opacity: 1;
        transform: scale(1);
        pointer-events: all;
      }

      .pb-inner {
        background: #fff9f0;
        border: 3px solid #ff7a2f;
        border-radius: 18px;
        overflow: hidden;
        box-shadow: 0 6px 0 #e05a10;
      }

      .pb-top {
        display: flex;
        align-items: flex-start;
        gap: 8px;
        padding: 12px 12px 8px;
        background: white;
        border-bottom: 2px solid #fde8cc;
      }

      .pb-icon {
        font-size: 26px;
        line-height: 1;
        flex-shrink: 0;
        animation: pb-icon-bob 2s ease-in-out infinite;
      }

      @keyframes pb-icon-bob {
        0%,100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }

      .pb-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 3px;
      }

      .pb-msg {
        font-size: 13px;
        font-weight: 800;
        color: #cc4400;
        line-height: 1.35;
        display: block;
      }

      .pb-tip {
        font-size: 11.5px;
        font-weight: 600;
        color: #a07850;
        line-height: 1.4;
        display: block;
      }

      .pb-close {
        background: #fde8cc;
        border: none;
        color: #c06030;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 11px;
        font-weight: 900;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        transition: background 0.15s, transform 0.15s;
        font-family: sans-serif;
        padding: 0;
        line-height: 1;
      }

      .pb-close:hover {
        background: #f5c090;
        transform: rotate(90deg);
      }

      .pb-actions {
        display: flex;
        gap: 8px;
        padding: 10px 12px;
      }

      .pb-btn {
        flex: 1;
        padding: 8px 6px;
        border: none;
        border-radius: 12px;
        font-family: 'Fredoka One', cursive;
        font-size: 13px;
        cursor: pointer;
        transition: transform 0.12s, box-shadow 0.12s;
        letter-spacing: 0.2px;
      }

      .pb-btn-safe {
        background: #6bcb77;
        color: white;
        box-shadow: 0 3px 0 #4aa85a;
      }

      .pb-btn-safe:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 0 #4aa85a;
      }

      .pb-btn-safe:active { transform: translateY(2px); box-shadow: 0 1px 0 #4aa85a; }

      .pb-btn-parent {
        background: #4da8ff;
        color: white;
        box-shadow: 0 3px 0 #2d88e0;
      }

      .pb-btn-parent:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 0 #2d88e0;
      }

      .pb-btn-parent:active { transform: translateY(2px); box-shadow: 0 1px 0 #2d88e0; }

      /* ── Arrow ── */
      .pb-arrow {
        position: absolute;
        width: 0; height: 0;
        pointer-events: none;
      }

      .pb-arrow-left {
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-right: 10px solid #ff7a2f;
      }

      .pb-arrow-right {
        right: -10px;
        top: 50%;
        transform: translateY(-50%);
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        border-left: 10px solid #ff7a2f;
      }

      .pb-arrow-top {
        top: -10px;
        left: 50%;
        transform: translateX(-50%);
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-bottom: 10px solid #ff7a2f;
      }

      .pb-learn-section {
  border-top: 2px solid #fde8cc;
  border-bottom: 2px solid #fde8cc;
}

.pb-learn-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 12px;
  background: #fff9f0;
  border: none;
  cursor: pointer;
  font-family: 'Baloo 2', sans-serif;
  font-size: 12px;
  font-weight: 700;
  color: #c06030;
  text-align: left;
  transition: background 0.15s;
}

.pb-learn-toggle:hover {
  background: #fde8cc;
}

.pb-learn-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.pb-learn-label {
  flex: 1;
}

.pb-learn-chevron {
  font-size: 13px;
  transition: transform 0.25s ease;
  display: inline-block;
}

.pb-learn-chevron.open {
  transform: rotate(180deg);
}

.pb-learn-body {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease;
  background: #fffaf5;
}

.pb-learn-body.expanded {
  grid-template-rows: 1fr;
}

.pb-learn-content {
  overflow: hidden;
  font-size: 12px;
  font-weight: 600;
  color: #7a6050;
  line-height: 1.6;
  padding: 0 12px;
  transition: padding 0.3s ease;
}

.pb-learn-body.expanded .pb-learn-content {
  padding: 10px 12px;
}
    `;
    document.head.appendChild(style);
  }

  // ---- SHOW TOOLTIP ----

  function showTooltip(targetEl, patternInfo) {
    if (document.getElementById("pebble-tooltip")) return;

    injectStyles();
    const tooltip = createTooltip(patternInfo);
    positionTooltip(tooltip, targetEl);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => tooltip.classList.add("pb-visible"));
    });

    // Reposition on scroll/resize
    const reposition = () => positionTooltip(tooltip, targetEl);
    window.addEventListener("scroll", reposition, { passive: true });
    window.addEventListener("resize", reposition);

    // Buttons
    document.getElementById("pb-close").addEventListener("click", () => {
      tooltip.classList.remove("pb-visible");
      setTimeout(() => {
        tooltip.remove();
        window.removeEventListener("scroll", reposition);
        window.removeEventListener("resize", reposition);
      }, 300);
    });

    document.getElementById("pb-safe").addEventListener("click", () => {
      window.location.href = "https://www.google.com";
    });

    document.getElementById("pb-parent").addEventListener("click", () => {
      chrome.runtime.sendMessage({ type: "NOTIFY_PARENT", url: window.location.href });
      document.getElementById("pb-parent").textContent = "✓ Done!";
    });

    const learnToggle = document.getElementById("pb-learn-toggle");
if (learnToggle) {
  const learnBody = document.getElementById("pb-learn-body");
  const chevron = learnToggle.querySelector(".pb-learn-chevron");
  const learnLabel = learnToggle.querySelector(".pb-learn-label");

  learnToggle.addEventListener("click", () => {
    const isOpen = learnBody.classList.contains("expanded");

    learnBody.classList.toggle("expanded");
    chevron.classList.toggle("open");
    learnLabel.textContent = isOpen ? "Why is this a scam?" : "Got it, thanks!";

    // Reposition tooltip after expand since height changes
    setTimeout(() => positionTooltip(tooltip, targetEl), 320);
  });
}
  }

  // ---- RUN ----

  function run() {
    const result = findMatchInPage();
    if (!result) return;

    const { node, patternInfo } = result;
    const highlightEl = highlightMatch(node, patternInfo);
    showTooltip(highlightEl, patternInfo);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }

  // Second pass for dynamically loaded content
  setTimeout(run, 2500);

// Listen for Safe Browsing danger signal from background.js
  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === "SHOW_BUBBLE") {
      const safeBrowsingPattern = {
        msg: "Google detected this site is dangerous! It may try to steal your info. 🚨",
        tip: "This site is flagged for malware or phishing. Leave now to stay safe."
      };
      // Create a fake anchor point at top of page
      const anchor = document.body;
      showTooltip(anchor, safeBrowsingPattern);
    }
  });

})();