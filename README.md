<div align="center">
  <h1>🐼🍌 PandaBanana</h1>
  <p><strong>Transform Your Photos with AI Magic</strong></p>
  
  <br />
  
  <p>
    <img alt="React" src="https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Vite" src="https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
    <img alt="Gemini AI" src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?style=for-the-badge&logo=google&logoColor=white" />
  </p>
  
  <p>
    <a href="#-features"><img src="https://img.shields.io/badge/Features-✨-yellow?style=flat-square" /></a>
    <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-🚀-green?style=flat-square" /></a>
    <a href="#-demo"><img src="https://img.shields.io/badge/Demo-📱-blue?style=flat-square" /></a>
    <a href="#-contributing"><img src="https://img.shields.io/badge/Contributing-🤝-orange?style=flat-square" /></a>
  </p>
  
  <br />
  
  <img src="https://github.com/user-attachments/assets/f6bc13c6-47f3-467f-8418-edf29177ea14" alt="PandaBanana Screenshot" width="300" />
  
</div>

---

## 🌟 What is PandaBanana?

**PandaBanana** is a next-generation AI-powered photo studio that brings the magic of generative AI to your fingertips. Built with cutting-edge technology and powered by Google's Gemini AI, it transforms ordinary photos into extraordinary creations.

> *"Where creativity meets artificial intelligence – one banana at a time 🍌"*

Whether you want to teleport your selfie to a sunset beach, turn any photo into a viral meme, create artistic variations of your images, or generate entirely new artwork from your imagination – PandaBanana makes it effortless and fun!

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🌅 SceneShift
**Teleport to New Worlds**

Transform your photos to different times of day and weather conditions:
- 🌅 **Sunrise** – Soft, warm morning light
- 🌇 **Golden Hour** – Magical warm glow
- 🌃 **Blue Hour** – Deep blue twilight
- 🌉 **Midnight** – Moonlit scenes with stars
- 🌧️ **Rainy** – Moody reflective surfaces
- 🌫️ **Foggy** – Mysterious atmosphere

</td>
<td width="50%">

### 😂 MemeSmith
**Create Viral Content**

Let AI analyze your images and generate perfect meme captions:
- 🤖 Intelligent meme template detection
- ✍️ AI-generated witty captions
- 🎯 Modern and relatable humor
- 📤 Easy sharing options

</td>
</tr>
<tr>
<td width="50%">

### 🎭 CloneCast
**Reimagine Yourself**

Create stunning variations with different poses and scenes:
- 🚶 **Walking** – Full-body walking pose
- 🧍 **Leaning** – Casual leaning pose
- 👤 **Portrait** – Professional waist-up shot
- 🎨 Custom scene descriptions

</td>
<td width="50%">

### 🎨 DreamCanvas
**Imagine & Create**

Generate original artwork from text descriptions:
- 🖼️ Multiple aspect ratios (1:1, 16:9, 9:16)
- ✨ Powered by Imagen 4.0
- 🎯 High-resolution outputs
- 💡 Creative prompt support

</td>
</tr>
</table>

### 🎁 Additional Features

| Feature | Description |
|---------|-------------|
| 📱 **Mobile-First** | Responsive design optimized for all screen sizes |
| 🎨 **Themes** | Three beautiful themes – Q Panda, Mint, and Crimson |
| 💾 **Auto-Save** | Session persistence and local storage for your creations |
| ↩️ **Undo/Redo** | Full history support in SceneShift editor |
| ⚡ **Real-time** | Fast AI processing with loading indicators |

---

## 📱 Demo

<div align="center">
  <img src="https://github.com/user-attachments/assets/f6bc13c6-47f3-467f-8418-edf29177ea14" alt="PandaBanana Home Screen" width="280" />
  &nbsp;&nbsp;&nbsp;
  <img src="https://github.com/user-attachments/assets/273e3c5d-87cd-41b1-9ede-738c95474d10" alt="PandaBanana Upload" width="280" />
</div>

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16.0.0 or higher
- **npm** or **yarn**
- **Gemini API Key** – Get one free at [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/harryneopotter/PandaBanana.git

# 2. Navigate to the project directory
cd PandaBanana

# 3. Install dependencies
npm install

# 4. Set up your API key
echo "API_KEY=your_gemini_api_key_here" > .env.local

# 5. Start the development server
npm run dev
```

### 🎉 That's it! 

Open [http://localhost:5173](http://localhost:5173) in your browser and start creating!

---

## 🏗️ Tech Stack

<div align="center">

| Category | Technology |
|----------|------------|
| **Frontend** | React 19.1.1 |
| **Language** | TypeScript 5.8.2 |
| **Build Tool** | Vite 6.2.0 |
| **AI Engine** | Google Gemini AI |
| **Image Generation** | Gemini 2.5 Flash + Imagen 4.0 |
| **State** | React Hooks |
| **Storage** | Browser localStorage |

</div>

---

## 📁 Project Structure

```
PandaBanana/
├── 📄 App.tsx                  # Main application component
├── 📄 index.tsx                # Application entry point
├── 📄 index.html               # HTML template
├── 📄 types.ts                 # TypeScript type definitions
├── 📄 themes.ts                # Theme configurations
├── 📄 constants.ts             # App constants & scene options
├── 📂 components/              # React UI components
│   ├── 📄 Header.tsx           # App header with navigation
│   ├── 📄 BottomNav.tsx        # Bottom navigation bar
│   ├── 📄 ImageUploader.tsx    # Drag & drop image upload
│   ├── 📄 SceneShiftEditor.tsx # Scene transformation editor
│   ├── 📄 MemeSmithEditor.tsx  # Meme creation editor
│   ├── 📄 CloneCastEditor.tsx  # Image variation editor
│   ├── 📄 DreamCanvas.tsx      # Text-to-image generator
│   ├── 📄 SavedImages.tsx      # Gallery of saved creations
│   ├── 📄 Settings.tsx         # Theme & app settings
│   ├── 📄 LoadingShimmer.tsx   # Loading animations
│   └── 📄 Icons.tsx            # SVG icon components
├── 📂 services/                # API services
│   └── 📄 geminiService.ts     # Google Gemini AI integration
├── 📄 package.json             # Dependencies & scripts
├── 📄 tsconfig.json            # TypeScript configuration
└── 📄 vite.config.ts           # Vite configuration
```

> **Note:** This project uses a flat structure with source files at the root level instead of a traditional `src/` directory.

---

## 🎨 Available Themes

<table>
<tr>
<td align="center" width="33%">

### 🐼 Q Panda
*Default theme*

Vibrant cyan & purple
Dark modern aesthetic

</td>
<td align="center" width="33%">

### 🌿 Mint
*Fresh & calming*

Emerald & cyan tones
Slate background

</td>
<td align="center" width="33%">

### 🔥 Crimson
*Bold & warm*

Rose, orange & yellow
Zinc dark mode

</td>
</tr>
</table>

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build
```

---

## 🤝 Contributing

We love contributions! Here's how you can help make PandaBanana even better:

1. 🍴 **Fork** the repository
2. 🌿 **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. 💻 **Commit** your changes
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. 📤 **Push** to the branch
   ```bash
   git push origin feature/amazing-feature
   ```
5. 🎉 **Open** a Pull Request

### Guidelines

- ✅ Follow TypeScript best practices
- ✅ Write clean, readable code
- ✅ Include proper error handling
- ✅ Test your changes thoroughly
- ✅ Follow existing code patterns

---

## 📄 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

<div align="center">

| | |
|---|---|
| 🤖 **Google Gemini AI** | For powering our image transformations |
| ⚛️ **React Team** | For the incredible UI framework |
| ⚡ **Vite Team** | For the blazing fast build tool |
| 🌍 **Open Source Community** | For inspiration and tools |

</div>

---

<div align="center">
  
  ## ⭐ Star Us!
  
  If you find PandaBanana helpful, please give us a star! It helps others discover the project.
  
  [![Star this repo](https://img.shields.io/github/stars/harryneopotter/PandaBanana?style=social)](https://github.com/harryneopotter/PandaBanana)
  
  ---
  
  <p>
    <a href="https://github.com/harryneopotter/PandaBanana/issues/new?labels=bug">🐛 Report Bug</a>
    &nbsp;•&nbsp;
    <a href="https://github.com/harryneopotter/PandaBanana/issues/new?labels=enhancement">✨ Request Feature</a>
  </p>
  
  <br />
  
  **Made with 🍌 and ❤️ by the PandaBanana team**
  
  <sub>Transform your photos. Unleash your creativity. 🐼🍌</sub>

</div>
