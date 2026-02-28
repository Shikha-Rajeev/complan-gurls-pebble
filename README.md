<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# PEBBLE 🎯

## Basic Details

### Team Name: Complan Gurls

### Team Members
- Member 1: Angelina Rose M - TKM COLLEGE OF ENGINEERING
- Member 2: Shikha Rajeev - TKM COLLEGE OF ENGINEERING

### Hosted Project Link
Since it's a browser extension, it cannot be deployed in any free manner. So we are sharing the github link:
https://github.com/Shikha-Rajeev/Pebble.git

### Project Description
Pebble watches for scam patterns and suspicious sites while kids browse, and instead of throwing up a red wall, it pops up a friendly speech bubble right next to the dangerous content explaining why it's a scam and what to do. Most parental control tools just block. Kids learn to route around them, and never develop the instinct to spot danger themselves. Pebble is different - every warning is a 10-second lesson. Over time, kids get better at the internet, not just safer while the extension is installed.

### The Problem statement
Children lack the experience to recognize online scams, and existing parental controls simply block content without teaching kids why something is dangerous - leaving them permanently vulnerable the moment a blocker fails.

### The Solution
Pebble is a Chrome extension that detects scam patterns in real time and surfaces a friendly, educational warning bubble directly next to suspicious content - explaining the trick, notifying parents, and building the child's own instinct to stay safe online.

---

## Technical Details

### Technologies/Components Used

For Software:

Languages used: JavaScript, HTML, CSS
Frameworks used: Chrome Extensions API (Manifest V3)
Libraries used: EmailJS (parent notifications), Google Safe Browsing API (threat detection), Google Fonts (Baloo 2, Fredoka One)
Tools used: VS Code, Git, GitHub, Chrome Developer Mode

For Hardware:

Not applicable — Pebble is a browser extension that runs entirely in Chrome on any standard computer or laptop. No hardware components required.

---

## Features

List the key features of your project:
- Feature 1:  Real-time scam detection — catches fake currency generators, prize scams, password phishing, and more
- Feature 2: Google Safe Browsing integration — flags known malware and phishing sites
- Feature 3: Speech bubble warnings — appears right next to the suspicious text, not as a jarring full-page block
- Feature 4: Ask a Parent button — one tap sends an email alert to the parent with the flagged URL
- Feature 5: Leave this page — instantly redirects the child to Google
- Feature 6: Kid-specific patterns — targets how kids actually get scammed (Robux, V-Bucks, free skins, fake winners)

---

## Implementation

1. Clone the repo
bashgit clone https://github.com/YOUR_USERNAME/pebble.git
cd pebble
2. Get a Google Safe Browsing API key

Go to console.cloud.google.com
Create a new project called "Pebble"
Enable the Safe Browsing API
Go to Credentials → Create API Key → copy it

Paste it into background.js:
javascriptconst SAFE_BROWSING_KEY = "YOUR_KEY_HERE";
3. Set up EmailJS (for parent notifications)

Sign up at emailjs.com (free tier)
Create a service (connect your Gmail)
Create an email template with these variables:

{{child_name}}, {{suspicious_url}}, {{reason}}, {{time}}


Copy your Service ID, Template ID, and Public Key

Paste them into background.js:
javascriptconst EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY";
4. Load into Chrome

Open Chrome and go to chrome://extensions
Enable Developer Mode (toggle in top right)
Click Load Unpacked
Select the pebble/ folder

The Pebble icon should appear in your toolbar.
5. Configure via the popup
Click the Pebble icon in Chrome toolbar → enter:

Parent's email address
Child's name
Age group (affects detection sensitivity)


---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

<img width="333" height="644" alt="image" src="https://github.com/user-attachments/assets/3824aa22-f735-4153-9db6-998fdfe6386d" />

Pebble's parent settings panel 

<img width="711" height="379" alt="image" src="https://github.com/user-attachments/assets/eec53da5-25ff-47fc-b8a0-3239ad875dfa" />

A scam being flagged and pop up being shown explaining the scam

<img width="848" height="296" alt="image" src="https://github.com/user-attachments/assets/f7b525a6-5b90-4c32-88e5-e56adf3aa8e7" />

The pop up and additional explanation regarding the scam.

---

## Project Demo

### Video
(https://drive.google.com/file/d/1eO0WQPaH1-OBtNgL9Sx-BCufQrVXz10Z/view?usp=drive_link)

The video opens with the Pebble extension loaded in Chrome, showing the popup settings panel where a parent enters their email address, child's name, and selects an age group. Settings are saved with one click.
The first demonstration visits a page containing "free robux" in the content. Within milliseconds of the page loading, Pebble's pattern scanner fires — the phrase is highlighted in amber directly on the page and a friendly speech bubble appears beside it, identifying the scam type, explaining why it's dangerous in kid-friendly language, and offering two actions: leave the page immediately or notify a parent.
The "Why is this a scam?" section is expanded, revealing a plain-language explanation of exactly how this type of scam works and what the scammer is actually after — turning the warning into a teachable moment.
Next, the "Ask a Parent" button is clicked. The button confirms the action instantly, and within seconds a formatted email arrives in the parent's inbox containing the flagged URL, the reason it was flagged, the child's name, and a timestamp.

### Additional Demos
(https://drive.google.com/file/d/1f3M5AES2OoluGFP5SjMV9eOAU7Vo3muD/view?usp=drive_link)

---

## AI Tools Used (Optional - For Transparency Bonus)

Tool Used: Claude (Anthropic)

Generated the initial Chrome Manifest V3 boilerplate and service worker structure
Suggested the Google Safe Browsing API and EmailJS as the core backend stack
Produced the background.js architecture including tab listeners and message passing
Debugged content script injection and IIFE scoping issues in real time
Helped structure the tooltip positioning logic for different screen edge cases
Reviewed and improved scam pattern regex for better coverage
Generated kid-friendly warning copy and educational explanations for each scam type

Key Prompts Used:

"Divide the task for two people and give execution step by step for an 8-hour hackathon"
"Explain what Person A should do in detail, step by step till hour 5"
"These tests are not working — Safe Browsing and pattern detection both failing"
"We are changing from a full warning page to a speech bubble next to spam links — update the approach"
"What small features can be added given our current codebase"

Percentage of AI-generated code: ~60%
Human Contributions:

Final architecture decisions and tech stack choices
Custom scam pattern library based on real kid-targeted scam research
Visual design direction for the popup and tooltip aesthetic
Integration, testing, and debugging across both detection layers
Decision to pivot from full-page blocking to inline speech bubbles — the core UX insight that shaped the whole product
Real-time problem solving when tests failed and adapting the approach mid-build

---

## Team Contributions

- Angelina Rose M: Frontend & User Experience
Built the entire visual layer — the DOM-based scam pattern scanner, amber text highlighting, smart-positioned animated tooltip, and the "Why is this a scam?" expandable section. Designed the full popup UI including the mascot hero, age group chip selector, and all kid-friendly warning copy.
- Shikha Rajeev: Backend & Detection Engineering
Integrated Google Safe Browsing API into the Chrome service worker, built the full background.js architecture including tab listeners, message passing, whitelist logic, and parent email notifications via EmailJS. Handled all Chrome Manifest V3 configuration and chrome.storage.sync for persistent settings.

---


Made with ❤️ at TinkerHub
