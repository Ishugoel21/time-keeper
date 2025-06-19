# Timer Hub


"Timer Hub - Manage Your Time" is a web application designed to help users create, manage, and interact with multiple customizable timers. It allows for easy tracking of various activities, provides alerts, and maintains a history of completed timers.

## Features

*   **Multiple Timers:** Create and manage several timers simultaneously.
*   **Customizable Timers:** Set custom names, durations (in HH:MM:SS, MM:SS, or seconds format), and categories for each timer.
*   **Halfway Alerts:** Optional audio and visual alerts when a timer reaches its halfway point.
*   **Timer Controls:** Start, pause, reset, and delete individual timers.
*   **Global Controls:** Start all, pause all, and reset all active timers.
*   **Categorization:** Organize timers by categories. New categories can be created on the fly.
*   **Timer History:** View a log of all completed timers, filterable by category.
*   **Export History:** Download timer history as a JSON file.
*   **Completion Notifications:** A modal pop-up acknowledges when a timer completes.
*   **Persistent Storage:** Timers and history are automatically saved in the browser's local storage.
*   **Responsive Design:** The user interface adapts to different screen sizes, making it usable on desktop and mobile devices.

## Tech Stack

*   **Frontend Framework:** React with TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** Shadcn/UI (Button, Card, Input, Select, Progress, Dialog, Checkbox, etc.)
*   **Routing:** React Router DOM
*   **Form Handling:** React Hook Form, Zod for validation
*   **Client-side State Management:** React Hooks (`useState`, `useEffect`)
*   **Local Storage:** Custom utilities for persisting timer and history data.
*   **Notifications & Toasts:** Sonner, Radix UI Toast (used for halfway alerts)
*   **Linting:** ESLint with TypeScript-ESLint
*   **Icons:** Lucide React
*   **Data Query (Minimal Use):** TanStack React Query (primarily for `QueryClientProvider` setup)

## Getting Started

To get a local copy up and running, follow these simple steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ishugoel21/time-keeper.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd time-keeper
    ```
3.  **Install dependencies:**
    *(Ensure you have Node.js v18.x installed, as specified in `package.json`)*
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will typically be available at `http://localhost:8080`.

## ✅ Assumptions Made During Development

- App runs on latest versions of modern browsers.
- `localStorage` is available and enabled.
- No server or authentication required; purely client-side.
- Users understand common time formats.
- No sound alerts are implemented; all alerts are visual only.
- Layout adapts fluidly across screen sizes.
- Timer precision may slightly vary due to JavaScript/browser timing.
- Minimal accessibility features; WCAG compliance can be improved.
- Form validation is handled by **Zod** via **react-hook-form**.
- `react-query` is included for future use, not currently necessary.
