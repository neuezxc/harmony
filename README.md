# 🎭 Prompt Harmonizer

A beautiful, frontend-only AI prompt optimization tool that harmonizes your prompts with LoRA magic using OpenRouter API.

![Prompt Harmonizer](https://img.shields.io/badge/React-19.1.0-blue) ![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-cyan)

## ✨ Features

- **🎨 Anime-inspired Glassmorphism UI** - Beautiful pastel gradients and floating elements
- **🤖 OpenRouter API Integration** - Direct API calls with your API key
- **🎭 LoRA Optimization** - Enhance prompts with LoRA triggers and weights
- **💾 LocalStorage Persistence** - Save prompts, LoRAs, API key, and settings
- **📋 Clipboard Helpers** - One-click copy with visual feedback animation
- **📚 Local History** - Browse and reload previous harmonizations
- **🎭 Preloaded LoRA Profiles** - Quick-start templates for different styles
- **⚙️ Settings Panel** - Dark/light mode and model selection
- **🗑️ Clear All Reset** - Quick reset functionality

## 🚀 Quick Start

1. **Clone & Install**
   ```bash
   git clone <repository-url>
   cd harmony
   npm install
   ```

2. **Get OpenRouter API Key**
   - Visit [OpenRouter](https://openrouter.ai/)
   - Create an account and get your API key
   - The free tier includes GLM-4.5 Air model

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - Navigate to `http://localhost:3000`
   - Enter your API key and start harmonizing!

## 🎯 How to Use

1. **Enter your OpenRouter API key** in the secure input field
2. **Write your positive prompt** describing what you want to see
3. **Add negative prompt** (optional) for what to avoid
4. **Include LoRA triggers** or use preloaded profiles
5. **Click "Optimize Prompt"** to optimize
6. **Copy the results** and use in your AI image generator

## 🎭 LoRA Profiles

Choose from pre-configured LoRA combinations:
- **Anime Style** - Perfect for anime-inspired artwork
- **Realistic Portrait** - High-quality character portraits
- **Fantasy Art** - Magical and fantastical scenes
- **Cyberpunk** - Futuristic aesthetics
- **Watercolor** - Soft painting style
- **Studio Ghibli** - Whimsical animated style

## ⚙️ Settings

- **🌙 Dark Mode** - Toggle between light and dark themes
- **🤖 Model Selection** - Choose from multiple AI models:
  - GLM-4.5 Air (Free)
  - Claude 3 Haiku
  - GPT-4o Mini
  - Llama 3.1 8B

## 📚 History & Persistence

- **Automatic Saving** - All inputs and settings saved locally
- **History Browser** - View and reload previous prompts
- **Local Storage** - No data sent to external servers

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** TailwindCSS v4 with custom glassmorphism
- **State:** React useState with LocalStorage
- **API:** OpenRouter for AI model access
- **Icons:** Unicode emojis for lightweight design

## 🎨 UI Features

- **Flat & Minimalist Design** - Clean, modern interface with subtle shadows
- **Dark Theme Support** - Customizable dark mode with neutral grays (#111111 background)
- **Simple Animations** - Subtle hover transitions and smooth interactions
- **Responsive Layout** - Works seamlessly on desktop and mobile
- **Clean Typography** - Clear hierarchy without distracting elements
- **Accessibility** - Keyboard navigation and screen reader support

## 🔒 Privacy & Security

- **Frontend-only** - No backend server required
- **Local API Key Storage** - Your key stays in your browser
- **No Data Collection** - Everything processed locally
- **Secure API Calls** - Direct connection to OpenRouter

## 🤝 Contributing

This is an open-source project! Feel free to:
- Report bugs or suggest features
- Submit pull requests
- Share your LoRA profiles
- Improve the UI/UX

## 📄 License

MIT License - Free to use and modify for personal and commercial projects.

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai/) for the AI API
- [Next.js](https://nextjs.org/) for the framework
- [TailwindCSS](https://tailwindcss.com/) for styling
- Anime and AI art communities for inspiration

---

**Made with ❤️ for the AI art community**
