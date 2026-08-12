# 🚀 Meme Rush

**Meme Rush** is a fast-paced, interactive web application built for creating, sharing, and battling trending memes in real time. Designed for maximum engagement and lightning-fast performance.

---

## ✨ Features

- ⚡ **Instant Meme Generator**: Easily upload custom templates or choose from trending bases, add custom text, stickers, and dynamic effects.
- 🏆 **Meme Battles & Voting**: Pit memes against each other in fast-paced community voting rounds.
- 🔥 **Trending Feed**: Discover real-time viral memes ranked by community votes and engagement.
- 📱 **Fully Responsive**: Seamlessly optimized for mobile, tablet, and desktop viewports.
- 🎨 **Modern Dark Mode UI**: Crisp, vibrant visual design with smooth transitions and micro-interactions.
- 🔗 **One-Click Share & Export**: Instantly export high-resolution memes or share directly to social platforms.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 19, App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS / Tailwind CSS & Modern UI Tokens
- **Icons**: Lucide React / Feather Icons
- **Deployment**: Vercel

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18.0.0 or higher) and package manager of your choice installed.

- **Node.js**: `>= 18.0.0`
- **npm** / **yarn** / **pnpm** / **bun**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/meme-rush.git
   cd meme-rush
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   # or
   yarn install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📁 Project Structure

```text
meme-rush/
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # Reusable UI components (MemeEditor, BattleCard, Feed, etc.)
│   ├── lib/              # Helper utilities, custom hooks, and state management
│   ├── styles/           # Global styles and design system tokens
│   └── types/            # TypeScript interfaces & types
├── public/               # Static assets, fallback templates, and icons
├── README.md             # Project documentation
├── package.json
└── tsconfig.json
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](../../issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
