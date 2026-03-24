# LNMIIT Dashboard Pro 🚀✨

**Your ultimate, all-in-one companion app for surviving and thriving at LNMIIT.**

Whether you need to figure out exactly how many marks you need to get an 'A', check what's for dinner, or ask an AI how to study for Mid-Sems—this dashboard has you completely covered.

> [!IMPORTANT]
> **Branch Support:** This dashboard is currently engineered exclusively for the **CSE**, **CCE**, and **ECE** branches. Unfortunately, other branches are not yet supported for automated subject integration!

## 🌟 What can it do for you?

- 📊 **Smart Grade Tracker**  
  Enter your current marks, and the dashboard will instantly calculate exactly what you need to score on your remaining exams to Pass or secure that 'A' grade. It automatically adapts to your branch (CSE, CCE, ECE).

- 🍽️ **Instant Mess Menu**  
  No more checking random WhatsApp charts. See exactly what's cooking for Breakfast, Lunch, Snacks, and Dinner today, or expand it to see the entire week.

- 🤖 **Personal AI Study Advisor**  
  Feeling lost before exams? Click the AI Advisor! It analyzes your current weak subjects and instantly generates a personalized, realistic study plan or strategy to pull your grades up.

- ⏱️ **Live Exam Countdowns**  
  Visual, ticking countdowns so you know exactly how many days, hours, and minutes are left until your Mid-Sems or End-Sems begin.

- 📁 **Instant Syllabus & Notes**  
  Click on any subject to instantly pull up its official syllabus structure, or hit 'Initiate Uplink' to jump straight into the global Google Drive vault containing past archives and reference notes.

- 🔒 **100% Private & Safe**  
  We respect your privacy. Every single grade, mark, and piece of data you enter is stored **locally on your own device**. It is never sent to any external server. 

## 📲 How to use it?

It's incredibly simple and works perfectly on your laptop or mobile phone.

**First-Time Users (Sign Up):**
Because this app relies on locally secured data tracking, you need to quickly register your branch.
1. Open the website on your browser.
2. Simply click on the **Sign Up / Switch to Sign Up** link.
3. Enter your official **LNMIIT Roll Number** (e.g., `25UCS256`) and create a secure password.
4. Hit submit. Your personalized Dashboard will immediately generate your courses!

**Returning Users:**
1. Open the website.
2. Type in your registered Roll Number and your created password.
3. You're in! Bookmark the page and check in daily.

---
---

<br>

# 💻 For Developers (Technical Documentation)

If you're a developer or want to contribute to the codebase, here is the technical breakdown of how the LNMIIT Dashboard Pro operates under the hood.

### 🛠️ Tech Stack & Architecture
- **Frontend Core**: Standard HTML5 & Vanilla JavaScript (ES6+). No heavy frameworks, ensuring lightning-fast load times.
- **Styling**: Tailwind CSS (via CDN) mixed with highly customized, responsive Vanilla CSS overlays.
- **3D Graphics**: Three.js & WebGL power the interactive, hardware-accelerated "Memento Mori" particle background.
- **Backend/Integrations**: Firebase (Authentication & Firestore compat libraries) and external REST API integrations for the AI models.

### ⚙️ Local Setup & Configuration
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/25ucs256-ui/grade-tracker-lnmiit.git
   ```
2. **Launch the Interface**: 
   Since it runs on Vanilla JS, you do not need Node.js or a bundler. Simply open `index.html` directly in your local browser, or serve it using Live Server.

### 📜 License Information
- Code logic is distributed under the **MIT License**.
- The 3D abstract visual artwork (Memento Mori script) is licensed specifically under **Creative Commons BY-NC-ND 4.0**.

*Developed with ❤️ for the LNMIIT community.*
