# Todo-assistance-summary


This is a modern, full-featured Todo App built with **React + Tailwind CSS** that supports:
- Managing todos (create, edit, delete, toggle)
- Summarizing todos using the **Groq LLM API**
- Sending summaries to a **Slack channel**
- Clean, responsive UI using Tailwind (no UI libraries)

---

## 🚀 Features

- 🧠 **LLM-Powered Summaries** — Uses Groq's blazing-fast models like LLaMA 3 to generate task summaries
- 💬 **Slack Integration** — Send summarized task updates directly to a Slack channel
- ✅ **Filter Todos** — Tabs for All, Active, and Completed tasks
- 🌈 **Beautiful UI** — TailwindCSS-based design with clean UX

---

## 📦 Tech Stack

| Layer    | Stack                                      |
|----------|--------------------------------------------|
| Frontend | React + TailwindCSS                        |
| Backend  | Node.js + Express                          |
| LLM      | Groq API (LLaMA 3, Mixtral, etc.)          |
| Slack    | Incoming Webhooks                          |
| Databse  | Firebase                                   |


---

## 🛠️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/chhetri-aryan/todo-assistance-summary.git
cd todo-assistance-summary
```
### 2. Install Dependencies

Frontend
```bash
cd frontend
npm install
npm run dev
```

Backend
```bash
cd backend
npm install
npm run dev
```

### 3. API KEYS

🤖 LLM Setup (Groq API)
1. Go to https://console.groq.com
2. Generate an API Key
3. Choose a supported model (e.g., llama3-70b-8192)
4. Copy it and paste in the frontend in API Crendentials

💬 Slack Integration
1. Go to https://api.slack.com/messaging/webhooks
2. Choose a channel and create an Incoming Webhook
3. Copy the Webhook URL
4. Copy it and paste in the frontend in API Crendentials

## 🧠 Architecture Decisions
Frontend
- Built with React using functional components
- UI built with TailwindCSS (no component libraries for full control)
- Local context state management via useTodos()

Backend
- Lightweight Express server
- Routes: /summarize, /slack, /todos (basic CRUD or Firebase integration)
- Middleware for dotenv, cors

Integration Design
- Slack webhook and Groq API are entered in frontend
- LLM summary is generated on-demand when the user clicks "Summarize"
- Slack button sends the same summary to a Slack channel
