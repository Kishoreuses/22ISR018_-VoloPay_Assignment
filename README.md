# Friends of Finance Community CRM (React + Express Edition)

This codebase splits the application into a decoupled client and server setup:
1. **Frontend**: Vite + React + TypeScript + TailwindCSS
2. **Backend**: Express + Node.js + Mongoose (MongoDB Atlas / In-Memory Fallback)

---

## 🚀 How to Run Locally

### 1. Start the Backend
Open a terminal at `./backend`:
```bash
cd backend
npm install
npm run dev
```
- The API will start running at `http://localhost:5000/api`
- Environment settings can be customized in `./backend/.env` (includes `MONGODB_URI` connection string option and `PORT`).
- If no `MONGODB_URI` is provided, it automatically starts in **In-Memory fallback mode** with all 16 fictional seed members pre-loaded!

### 2. Start the Frontend
Open a new terminal at `./frontend`:
```bash
cd frontend
npm install
npm run dev
```
- The Vite development server runs at `http://localhost:5173/`

---

## 🛠️ Verification Checklist
To verify the features:
1. Open the UI at `http://localhost:5173/`
2. Go to **Help & Guide** tab on the sidebar.
3. Walk through the 10-step interactive testing sequence (adding members, logging activities, state recalculation, and rule-based engagement advice generation).
