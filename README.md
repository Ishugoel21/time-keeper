# Timer Hub - Manage Your Time

Timer Hub is a web application that allows users to create, manage, and interact with multiple customizable timers. It offers features such as halfway alerts, categorized timers, history tracking, and persistent local storage.

---

## ⚙️ Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/ishugoel21/time-keeper.git
cd time-keeper
2. Install Dependencies
Ensure you have Node.js v18.x installed.

bash
Copy
Edit
npm install
3. Start the Development Server
bash
Copy
Edit
npm run dev
The app will be available at: http://localhost:8080

✅ Assumptions Made During Development
The app runs in modern browsers (latest Chrome, Firefox, Edge, Safari).

All timers and history data are stored in the browser’s localStorage.

No backend or database is required; the app is entirely client-side.

Users will input durations in standard formats like HH:MM:SS, MM:SS, or just seconds.

Audio and visual alerts (halfway and completion) rely on browser permission for sound.

Basic accessibility is assumed but not fully WCAG-compliant.

Screen responsiveness is supported using Tailwind CSS and mobile-aware design patterns.

Shadcn/UI and Radix UI are used for UI components and dialogs.

Timer accuracy may vary slightly depending on browser throttling or system performance.

React Query setup is present but unused for now; planned for future server sync capability.

Form validation is handled using Zod + React Hook Form.

