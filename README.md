# 🎨 AI Studio — Social Media Content Generator

> Turn a rough idea into a polished, ready-to-post social media carousel in seconds.

**Live Demo:** [social-media-studio-rust.vercel.app](https://social-media-studio-rust.vercel.app)  

---

## 📸 What is AI Studio?

AI Studio is a full-stack AI-powered social media content creation tool. A user types a rough idea — like *"5 healthy breakfast ideas for kids"* — and the app instantly generates a beautiful, multi-slide carousel with AI-generated text, relevant images, captions, and hashtags — all ready to post on Instagram.

No design skills needed. Just an idea.

---

## ✨ Features

- **AI Carousel Generator** — Converts any idea into a multi-slide carousel using Groq's LLaMA 3.3 70B model
- **AI Image Integration** — Each slide gets a contextually relevant photo via the Pexels API
- **Multiple Formats** — Square (1:1), Story (9:16), Portrait (4:5)
- **5 Themes** — Neon, Cyber, Sunset, Ocean, Forest
- **Tone Selector** — Educational, Inspirational, Professional, Funny
- **Slide Count Selector** — Generate 3, 5, or 7 slides
- **Inline Slide Editing** — Click directly on slide text to edit
- **Regenerate Single Slide** — Redo just one slide without restarting
- **Drag & Drop Reorder** — Rearrange slides with drag and drop (@dnd-kit)
- **Caption & Hashtag Generator** — AI-generated Instagram caption + 10 relevant hashtags
- **Export PNG** — Download any single slide as a high-res PNG
- **Export All as ZIP** — Download all slides in one click
- **Post History** — All generations saved to your account, with remix & delete
- **Templates** — Pre-built ideas to get started instantly
- **Authentication** — JWT-based signup/login with protected routes
- **Dark / Light Mode** — Full theme support
- **Fully Responsive** — Works on mobile and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Usage |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations & transitions |
| @dnd-kit | Drag and drop |
| html-to-image | Slide PNG export |
| JSZip + file-saver | ZIP export |
| Axios | HTTP client |
| React Router v6 | Client-side routing |
| Lucide React | Icons |

### Backend
| Technology | Usage |
|---|---|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Groq SDK (LLaMA 3.3 70B) | AI content generation |
| Pexels API | Image fetching |
| dotenv | Environment config |

### Infrastructure
| Service | Usage |
|---|---|
| Vercel | Frontend deployment |
| Render | Backend deployment |
| MongoDB Atlas | Cloud database |

---

## 🏗️ Architecture

```
User
 │
 ├── Frontend (Vercel)
 │    ├── React + Vite
 │    ├── Auth Pages (Login / Signup)
 │    ├── Dashboard (Generator)
 │    ├── History
 │    ├── Templates
 │    └── Settings
 │
 └── Backend (Render)
      ├── /api/auth        → Register, Login, Get Me
      ├── /api/generate    → AI carousel generation (Groq)
      ├── /api/regenerate-slide → Single slide redo
      ├── /api/generate-caption → Caption + hashtags
      ├── /api/proxy-image → Pexels image proxy
      ├── /api/posts       → History CRUD
      └── MongoDB Atlas    → Persistent storage
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Pexels API key (free at [pexels.com/api](https://www.pexels.com/api))

### 1. Clone the repo

```bash
git clone https://github.com/piyushchauhan3554/Social-Media-Studio.git
cd social-media-studio
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=your_groq_api_key
PEXELS_API_KEY=your_pexels_api_key
PORT=5000
```

Start the server:
```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:5000
```

Start the dev server:
```bash
npm run dev
```

App will be live at `http://localhost:5173`

---

## 📁 Project Structure

```
ai-studio/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── AnimatedBackground.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Login.jsx
│   │       ├── Signup.jsx
│   │       ├── Dashboard.jsx
│   │       ├── History.jsx
│   │       ├── Templates.jsx
│   │       └── Settings.jsx
│   └── public/
│       └── favicon.svg
│
└── server/
    ├── config/
    │   └── db.js
    ├── controllers/
    │   ├── authController.js
    │   ├── generateController.js
    │   └── imageController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   ├── User.js
    │   └── Post.js
    ├── routes/
    │   ├── authRoute.js
    │   ├── generateRoute.js
    │   └── imageRoute.js
    ├── services/
    │   └── aiService.js
    └── server.js
```

---

## 🔐 Environment Variables

### Backend
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `GROQ_API_KEY` | Groq API key for LLaMA model |
| `PEXELS_API_KEY` | Pexels API key for images |
| `PORT` | Server port (default: 5000) |

### Frontend
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL |

---

## 🎯 Key Technical Decisions

**Why Groq?**  
Groq's inference speed is significantly faster than OpenAI for structured JSON generation — critical for a real-time content tool where users expect near-instant results.

**Why Pexels over AI image generation?**  
Direct AI image generation APIs (like DALL-E, Pollinations) had inconsistent CORS policies and rate limits in a browser context. Pexels provides stable, high-quality, royalty-free photos via a backend proxy — eliminating CORS issues entirely.

**Why dnd-kit over react-beautiful-dnd?**  
react-beautiful-dnd is deprecated. @dnd-kit is actively maintained, supports pointer sensors natively, and has better TypeScript support.

**Background image loading strategy:**  
Slides render immediately with text — images load in the background via `forEach` + `setSlides` state updates. This gives users instant feedback without waiting for all images to load.

---

## 📊 API Reference

### Auth
```
POST /api/auth/register    → Create account
POST /api/auth/login       → Login
GET  /api/auth/me          → Get current user (protected)
```

### Generation
```
POST /api/generate              → Generate carousel (protected)
POST /api/regenerate-slide      → Regenerate one slide (protected)
POST /api/generate-caption      → Generate caption + hashtags (protected)
```

### Posts
```
GET    /api/posts          → Get user's history (protected)
DELETE /api/posts/:id      → Delete a post (protected)
```

### Image
```
GET /api/proxy-image?prompt=...&seed=...  → Fetch image from Pexels
```

---

## 🚢 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [social-media-studio-rust.vercel.app](https://social-media-studio-rust.vercel.app) |
| Backend | Render | [ai-studio-backend-zoey.onrender.com](https://ai-studio-backend-zoey.onrender.com) |
| Database | MongoDB Atlas | Cloud hosted |

---

## 👨‍💻 Author

**Piyush**  
Built as part of the Cuemath Social Media Studio Task.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.