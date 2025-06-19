# Timer Hub


"Timer Hub - Manage Your Time" is a web application designed to help users create, manage, and interact with multiple customizable timers. It allows for easy tracking of various activities, provides alerts, and maintains a history of completed timers.

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
