# LNMIIT Dashboard Pro 🚀

A premium, immersive grade tracker and dashboard for LNMIIT students. This dashboard provides students with real-time grade calculations, exam countdowns, mess menus, and an AI-powered study advisor.

![Dashboard Preview](https://via.placeholder.com/800x450?text=LNMIIT+Dashboard+Pro+Preview)

## ✨ Features

- **Grade Tracker**: Intelligent grade calculation with branch-specific support (CSE, CCE, ECE).
- **AI Study Advisor**: Personalized study strategies and performance analysis using Google Gemini or NVIDIA NIM.
- **Mess Menu**: Integrated mess schedule for quick access.
- **Immersive UI**: Premium background animations (Memento Mori), smooth transitions, and a futuristic design language.
- **Privacy First**: All grade data is stored locally in your browser's `localStorage`.

## 🛠️ Tech Stack

- **HTML5/CSS3** (with Tailwind CSS via CDN)
- **Vanilla JavaScript** (ES6+)
- **Three.js / WebGL** (for the Memento Mori background)
- **External APIs**: Google Gemini API, NVIDIA NIM (for Study Advisor)

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/lnmiit-dashboard-pro.git
    ```
2.  **Open `index.html`**: Simply open the `index.html` file in any modern web browser.
3.  **Enter your Roll Number**: Access is restricted to 25th YOC roll numbers (e.g., `25UCS001`).

To enable the **AI Study Advisor**, you may configure your own API key.

1.  Copy `js/config.example.js` to `js/config.js`.
2.  Add your Groq or Gemini API key to the `advisorKey` field. (Instructions inside the file).

## 📜 License

The code in this repository is licensed under the [MIT License](LICENSE).
The visual artwork (Memento Mori) is used under [Creative Commons BY-NC-ND 4.0](https://creativecommons.org/licenses/by-nc-nd/4.0/).

---
*Developed with ❤️ for the LNMIIT community.*
