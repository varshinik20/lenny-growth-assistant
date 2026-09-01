# 🚀 Lenny Growth Assistant

An AI-powered growth assistant and knowledge retrieval system grounded in the insights, frameworks, and advice from **Lenny Rachitsky's** podcast and growth newsletter.

Built with **FastAPI**, **React (Vite)**, **FAISS**, **SentenceTransformers**, and **Ollama (Llama 3.2)**, featuring a split-screen interactive **Artifact Viewer** for live HTML execution and Markdown playbooks.

---

## ✨ Features

- 🧠 **Grounded RAG (Retrieval-Augmented Generation):** Semantic retrieval across podcast transcripts using FAISS vector search and `all-MiniLM-L6-v2` embeddings.
- 💻 **Interactive Artifact Sandbox:** Claude-style live preview panel for HTML/CSS/JS components and rendered Markdown playbooks.
- 💬 **Multi-Session Chat:** Create, switch, and manage conversational sessions backed by SQLAlchemy.
- 🤖 **Local & Cloud LLM Support:** Runs seamlessly with local models via Ollama (`llama3.2`) with extensible support for OpenAI/Anthropic.
- 🎨 **Modern Split-Pane UI:** Dynamic, responsive interface with Dark/Light theme tokens, code copy, refresh, and fullscreen view.

---

## 🛠️ Architecture & Tech Stack

- **Backend:** Python 3.11+, FastAPI, Uvicorn, SQLAlchemy, Pydantic
- **Vector Search & Embeddings:** FAISS (IndexFlatL2), SentenceTransformers (`all-MiniLM-L6-v2`)
- **LLM Engine:** Ollama (`llama3.2:3b`) / LangChain compatible
- **Frontend:** React 19, Vite, Lucide React, Axios, React-Markdown, Remark-GFM
- **Database:** PostgreSQL (Supabase / local) or SQLite

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- [Ollama](https://ollama.com/) (with `llama3.2` pulled)

```bash
ollama pull llama3.2
```

---

### 2. Backend Setup

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # macOS/Linux:
   source .venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to configure your `DATABASE_URL` and `OLLAMA_MODEL`.*

5. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

### 3. Frontend Setup

1. Navigate to the frontend folder:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173`.

---

## 📁 Repository Structure

```
lenny-growth-assistant/
├── backend/
│   ├── app/
│   │   ├── agents/          # Multi-agent specialized logic
│   │   ├── api/             # FastAPI routers (/chat, /sessions)
│   │   ├── database/        # Database models & engine setup
│   │   ├── schemas/         # Pydantic validation models
│   │   ├── services/        # RAG, LLM, embedding & session services
│   │   ├── config.py        # Settings & environment configuration
│   │   └── main.py          # FastAPI application entrypoint
│   ├── data/
│   │   └── transcripts/     # Podcast transcript corpus
│   ├── .env.example         # Sample environment config
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── api/             # API client services
│   │   ├── components/      # React components (Chat, ArtifactViewer, Sidebar)
│   │   ├── hooks/           # Custom React hooks (useLocalStorage)
│   │   ├── App.jsx          # Root application orchestrator
│   │   └── main.jsx         # React DOM entrypoint
│   └── package.json         # Node.js dependencies
└── README.md
```

---

## 📄 License

MIT License.
