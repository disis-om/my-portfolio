# ⌥ OmOS Creative Portfolio — Om Rajput

<div align="center">
  <h3>Creative Developer & Interface Architect</h3>
  <p>Crafting high-fidelity digital interfaces, custom micro-interactions, and premium typographic layouts.</p>
  <p>
    <a href="https://github.com/disis-om"><img src="https://img.shields.io/github/followers/disis-om?label=Follow&style=social" alt="GitHub Follow"></a>
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white" alt="Vite">
    <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React">
    <img src="https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind">
    <img src="https://img.shields.io/badge/Three.js-r184-000000?logo=three.js&logoColor=white" alt="Three.js">
  </p>
</div>

---

## 🖥️ Overview: The OmOS Simulator

The centerpiece of this portfolio is a high-fidelity **interactive computer chassis simulator** ("OmOS") that mimics a premium operating system experience inside a custom virtual monitor.

### Key OS Features:
- **Interactive Power Flow:** Starts in a powered-off state with a pulsing hardware symbol. Clicking the button starts an Apple-style booting loader.
- **Dynamic Lockscreen:** Synchronizes automatically with the user's local system time and date, featuring micro-animations and a vertical slide-up transition.
- **Guest Authentication:** stylized Guest login interface that triggers authentic startup chime feedback.
- **macOS-Style Magnified Dock:** Custom 5-item bell curve magnification on hover using advanced CSS `:has()` chains.
- **macOS-Style Control Center:** A drop-down widget featuring toggles (Wi-Fi, Bluetooth), volume controls, display brightness range sliders (tied directly to a simulated hardware opacity overlay filter), and system power controls (Restart/Shut Down).
- **Smooth Entry Animations:** The menu bar slides down and the dock slides up with a custom spring bezier bounce upon login.

---

## 🚀 Featured Projects

Here are the signature projects showcased inside this portfolio:

### 1. **Strophe AI** (`https://strophe.abacusai.app`)
- **Status:** *Currently Down*
- An all-in-one AI companion featuring specialized modes for coding, studying, and general chat, utilizing GPT-4o and Claude. Offers integrated productivity tools like Pomodoro timers, auto-generated flashcards, and live code previews.

### 2. **Clarimap** (`https://clarimap.edgeone.app`)
- **Status:** *Coming Soon*
- An AI-powered visualization engine that instantly translates complex code bases, system architectures, and study concepts into interactive diagrams and visual workflows in real-time.

### 3. **Rivelo AI** (`https://riveloai.edgeone.app`)
- **Status:** *Paused*
- A high-performance AI workspace utilizing a "bring-your-own-model" approach via OpenRouter. Features four distinct developer/reasoning personas, voice inputs, and secure local history.

### 4. **Custom LLM Family** (`https://strophe.edgeone.app`)
- **Status:** *Upcoming*
- Custom reasoning-focused LLM family with a bespoke tokenizer, scaling from the edge-optimized *Strophe 1* to the frontier-grade research model *Aion*.

### 5. **Prompchitect** (`https://prompchitect.edgeone.app`)
- **Status:** *Active*
- Advanced AI Orchestration Dashboard built for prompt architects. Deep integration of state management and real-time API controllers accessing 350+ LLMs via OpenRouter.

### 6. **Sunday Cups & Codecamy**
- **Status:** *UI-Design Showcases*
- High-end UI/UX landing sites focusing on typographic contrast, bold digital identity, and intentional whitespace.

---

## 🛠️ Stack & Architecture

- **Framework:** React 18 (Vite-powered SPA)
- **Styling:** Vanilla CSS (for layout physics & keyframe mechanics) + TailwindCSS (for utility structures)
- **Graphics:** Three.js (for rendering rich fluid mesh shaders and dynamic backgrounds)
- **Transitions:** Advanced cubic-beziers for native spring-like physics
- **SEO & Performance:** Fully structured HTML5 semantic structure, lightweight meta updates, and minimal layout shifts.

---

## 💻 Local Development Setup

To run the portfolio locally on your machine, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/disis-om/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up local variables (Optional):**
   Create a `.env.local` file inside the root directory:
   ```env
   VITE_OPENROUTER_API_KEY=your_key_here
   ```

4. **Launch the development server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build for production:**
   ```bash
   npm run build
   ```

---

<div align="center">
  <p>Designed & Developed by <strong>Om Rajput</strong> // © 2026</p>
</div>
