# 🪨 Pebble

> A Chrome extension that protects kids from online scams — not by blocking, but by teaching.

Pebble watches for scam patterns and suspicious sites while kids browse, and instead of throwing up a red wall, it pops up a friendly speech bubble right next to the dangerous content explaining *why* it's a scam and what to do.

---

## Why Pebble?

Most parental control tools just block. Kids learn to route around them, and never develop the instinct to spot danger themselves. Pebble is different — every warning is a 10-second lesson. Over time, kids get better at the internet, not just safer while the extension is installed.

---

## Features

- 🔍 **Real-time scam detection** — catches fake currency generators, prize scams, password phishing, and more
- 🛡️ **Google Safe Browsing integration** — flags known malware and phishing sites
- 💬 **Speech bubble warnings** — appears right next to the suspicious text, not as a jarring full-page block
- 👋 **Ask a Parent button** — one tap sends an email alert to the parent with the flagged URL
- 🏃 **Leave this page** — instantly redirects the child to Google
- 🎮 **Kid-specific patterns** — targets how kids actually get scammed (Robux, V-Bucks, free skins, fake winners)

---

## Scam Patterns Detected

| Pattern | Example |
|---|---|
| Fake game currency | "Free Robux", "Free V-Bucks generator" |
| Fake item giveaways | "Free skins", "Unlimited coins" |
| Password harvesting | "Enter your Roblox password to claim" |
| Verification scams | "Verify you're human to receive your prize" |
| Fake winner alerts | "You've been selected", "You've won" |
| Gift card scams | "Claim your free gift card" |
| Urgency manipulation | "Limited time free offer" |

---

## How It Works

```
User visits a page
       │
       ├──► background.js checks URL against Google Safe Browsing API
       │         │
       │         └──► If dangerous → sends SHOW_BUBBLE to content.js
       │
       └──► content.js scans page text for scam patterns
                 │
                 └──► If match found → highlights the flagged text
                                     → shows speech bubble tooltip next to it
                                     → optionally emails parent
```

---

## Project Structure

```
pebble/
├── manifest.json       # Extension config (Manifest V3)
├── background.js       # Safe Browsing API, email notifications, storage
├── content.js          # Pattern detection, highlight, tooltip UI
├── popup.html          # Settings panel UI
├── popup.js            # Settings save/load logic
├── styles/
│   └── popup.css       # Popup styles
└── icons/
    └── icon48.png      # Extension icon
```

---

## Setup & Installation

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/pebble.git
cd pebble
```

### 2. Get a Google Safe Browsing API key

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project called "Pebble"
3. Enable the **Safe Browsing API**
4. Go to Credentials → Create API Key → copy it

Paste it into `background.js`:
```javascript
const SAFE_BROWSING_KEY = "YOUR_KEY_HERE";
```

### 3. Set up EmailJS (for parent notifications)

1. Sign up at [emailjs.com](https://www.emailjs.com) (free tier)
2. Create a service (connect your Gmail)
3. Create an email template with these variables:
   - `{{child_name}}`, `{{suspicious_url}}`, `{{reason}}`, `{{time}}`
4. Copy your Service ID, Template ID, and Public Key

Paste them into `background.js`:
```javascript
const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
```

### 4. Load into Chrome

1. Open Chrome and go to `chrome://extensions`
2. Enable **Developer Mode** (toggle in top right)
3. Click **Load Unpacked**
4. Select the `pebble/` folder

The Pebble icon should appear in your toolbar.

### 5. Configure via the popup

Click the Pebble icon in Chrome toolbar → enter:
- Parent's email address
- Child's name
- Age group (affects detection sensitivity)

---

## Testing

**Test Safe Browsing detection:**

Visit this Google-provided test URL:
```
http://malware.testing.google.test/testing/malware/
```
→ Pebble tooltip should appear on the page.

**Test pattern detection:**

Create a local HTML file:
```html
<!DOCTYPE html>
<html>
<body>
  <h1>Get free robux here!</h1>
</body>
</html>
```
Open it in Chrome via File → Open File → tooltip should appear with a Robux-specific warning.

**Test parent email:**

Click "Ask a Parent" on any Pebble tooltip → check the parent's inbox.

**Debug tips:**
- Background script errors: `chrome://extensions` → Pebble → "Service Worker"
- Content script errors: Any page → Inspect → Console
- Check if content script loaded: In console, type `window.__pebbleLoaded` (should return `true`)

---

## Built With

- **Vanilla JS** — no frameworks, fast and lightweight
- **Chrome Extensions API** (Manifest V3)
- **Google Safe Browsing API** — threat detection
- **EmailJS** — parent notifications with no backend required
- **Chrome Storage Sync** — settings persist across devices

---
