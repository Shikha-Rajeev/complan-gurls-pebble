const SAFE_BROWSING_KEY = "YOUR_KEY_HERE";
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";

async function checkSafeBrowsing(url) {
  try {
    const response = await fetch(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client: {
            clientId: "pebble-extension",
            clientVersion: "1.0"
          },
          threatInfo: {
            threatTypes: [
              "MALWARE",
              "SOCIAL_ENGINEERING",
              "UNWANTED_SOFTWARE",
              "POTENTIALLY_HARMFUL_APPLICATION"
            ],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url }]
          }
        })
      }
    );
    const data = await response.json();
    return data.matches && data.matches.length > 0;
  } catch (e) {
    console.error("Safe Browsing error:", e);
    return false;
  }
}
async function notifyParent(url, reason) {
  const { parentEmail, childName } = await chrome.storage.sync.get([
    "parentEmail",
    "childName"
  ]);

  if (!parentEmail) return;

  const reasonText = reason === "safebrowsing"
    ? "Google flagged this site as dangerous (malware or phishing)"
    : "Child clicked 'Ask a Parent' on a suspicious page";

  try {
    await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        template_params: {
          parent_email: parentEmail,
          child_name: childName || "your child",
          suspicious_url: url,
          reason: reasonText,
          time: new Date().toLocaleString()
        }
      })
    });
    console.log("Parent notified:", parentEmail);
  } catch (e) {
    console.error("Email failed:", e);
  }
}
async function isWhitelisted(url) {
  const { whitelist = [] } = await chrome.storage.sync.get("whitelist");
  try {
    const domain = new URL(url).hostname;
    return whitelist.includes(domain);
  } catch {
    return false;
  }
}

async function addToWhitelist(url) {
  const { whitelist = [] } = await chrome.storage.sync.get("whitelist");
  try {
    const domain = new URL(url).hostname;
    if (!whitelist.includes(domain)) {
      whitelist.push(domain);
      await chrome.storage.sync.set({ whitelist });
    }
  } catch (e) {
    console.error("Whitelist error:", e);
  }
}
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete") return;
  if (!tab.url) return;
  if (tab.url.startsWith("chrome://")) return;
  if (tab.url.startsWith("chrome-extension://")) return;

  const whitelisted = await isWhitelisted(tab.url);
  if (whitelisted) return;

  const isDangerous = await checkSafeBrowsing(tab.url);

  if (isDangerous) {
    // Tell content.js to show the bubble
    chrome.tabs.sendMessage(tabId, {
      type: "SHOW_BUBBLE",
      reason: "safebrowsing"
    }).catch(() => {}); // ignore if content script not ready

    // Notify parent automatically
    notifyParent(tab.url, "safebrowsing");
  }
});
chrome.runtime.onMessage.addListener((message, sender) => {
  // Child clicked "Ask a Parent" button in the tooltip
  if (message.type === "NOTIFY_PARENT") {
    notifyParent(message.url, "child_requested");
  }

  // Optional: whitelist a site when child proceeds anyway
  if (message.type === "ADD_TO_WHITELIST") {
    addToWhitelist(message.url);
  }
});
