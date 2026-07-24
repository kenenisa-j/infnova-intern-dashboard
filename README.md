# 🚀 INFNOVA Intern Management Dashboard

A modern, high-performance administrative portal built using **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4** to streamline the process of review, status tracking, and candidate management for internship applicants.

---

## 📋 Table of Contents
1. [Getting Started & Setup](#-getting-started--setup)
2. [Technologies Used & Rationale](#%EF%B8%8F-technologies-used--rationale)
3. [Architecture & Folder Structure](#-architecture--folder-structure)
4. [Key Architectural Assumptions](#-key-architectural-assumptions)
5. [Future Improvements (With More Time)](#-future-improvements-with-more-time)

---

## 🚀 Getting Started & Setup

Follow these instructions to set up the development environment and run the application locally.

### 1. Prerequisites
Ensure you have the following installed on your machine:
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes with Node) or **pnpm** (recommended)

### 2. Installation
Clone the repository and install all project dependencies:
```bash
npm install
# or
pnpm install
```

### 3. Environment Variables Config
Create a `.env.local` file in the root directory of the project. Define the backend API endpoint base URL:
```env
NEXT_PUBLIC_API_URL=https://infnova-intern.vercel.app/api
```

### 4. Running the Development Server
Launch the local Next.js dev server:
```bash
npm run dev
# or
pnpm dev
```
Once started, open [http://localhost:3000](http://localhost:3000) in your web browser to view the application.

### 5. Building for Production
Compile the project for optimized production deployment:
```bash
npm run build
# or
pnpm build
```
Start the production-built application:
```bash
npm run start
# or
pnpm start
```

### 6. Linting
Verify code formatting and enforce static analysis rules:
```bash
npm run lint
```

---

## 🛠️ Technologies Used & Rationale

| Technology | Purpose | Selection Rationale |
| :--- | :--- | :--- |
| **Next.js 16 (App Router)** | Framework | Next-gen routing system, Server/Client Component isolation, layout preservation, and fast page speeds. |
| **React 19** | UI Library | Built-in support for asynchronous transitions, state synchronization, and simplified DOM interactions. |
| **TypeScript** | Language | Provides compile-time checking, strictly typed API response contracts, and robust self-documenting code. |
| **React Query v5** | State Management | Out-of-the-box caching, background synchronization, automated refetching, and state management for async APIs. |
| **Axios** | HTTP Client | Easy integration of global interceptors for adding Auth headers and handling session expirations globally. |
| **Tailwind CSS v4** | CSS Styling | Ultra-fast performance, modern grid configurations, and utility-driven styling variables. |
| **Sonner** | Notifications | Clean, non-blocking toast animations to notify users of UI states and mutation results. |
| **Lucide Icons** | Iconography | High-fidelity, consistent vector icons that scale cleanly. |

---

## 📐 Architecture & Folder Structure

The application adopts a **Feature-First Architecture** rather than grouping files strictly by technical role (e.g., all components in one folder, all hooks in another). This ensures that files are co-located by domain responsibility, improving codebase maintainability and readability.

```text
src/
├── app/                       # Next.js App Router (Routing and Layout Wrappers)
│   ├── dashboard/             # Protected dashboard space
│   │   ├── applicants/        # Applicants list and detail page paths
│   │   └── page.tsx           # Dashboard home page view
│   ├── login/                 # Authentication portal page
│   ├── layout.tsx             # Root layout wrapping HTML, metadata, and fonts
│   └── page.tsx               # Entry point redirect routing
├── components/                # Shared application-wide UI components
│   ├── layout/                # Global layout wrappers (e.g. sidebar navigation)
│   ├── auth-guard.tsx         # Client-side route authentication controller
│   └── reset-session-button.tsx # Global action to reset mock database session
├── features/                  # Domain-specific feature modules
│   ├── applicants/            # Applicants list, card grid, details, and API hooks
│   ├── auth/                  # Credentials validation & API authentication contracts
│   ├── dashboard/             # Key performance indicators and metrics components
│   ├── reference/             # Query systems for application metadata (tracks, statuses)
│   └── session/               # Database state resets
├── lib/                       # Global clients and config helpers (Axios client config)
├── providers/                 # React Query wrapper context provider
├── types/                     # Application-wide global type models
└── utils/                     # Generic utility functions
```

---

## 📋 Key Architectural Assumptions

During the development process, the following core assumptions and design choices were made:

1. **Authentication State & Storage**:
   - The user session is governed by a JWT `accessToken` persisted in `localStorage`. 
   - Public authentication endpoints are excluded from sending headers, whereas protected resource APIs automatically append the `Authorization: Bearer <token>` header via Axios Request Interceptors.

2. **Session Expiration Interception**:
   - If an API request fails with a `401 Unauthorized` status (indicating an expired or invalid token), an Axios Response Interceptor catches the error, clears the invalid token from storage, and redirects the user to `/login?expired=true`.
   - The login page listens to this query parameter and displays an amber alert banner to guide the user.

3. **URL Search Parameter State Synchronization**:
   - Filters (status, track), search term, pagination indices, and sorting criteria are actively written to the browser's URL search queries.
   - This ensures dashboard views are link-shareable, bookmarkable, and persist across manual browser reloads.

4. **Input Debouncing**:
   - Typing in the search filter uses a local React state and debounces router state pushes by `500ms`. This guarantees high typing responsiveness without freezing inputs or triggering excessive network requests.

5. **Optimistic UI Mutations**:
   - On the applicant detail page, updating candidate statuses (e.g., Accepting or Rejecting) updates the UI state immediately.
   - If the background API patch fails, the mutation automatically rolls back to the previous cached value and flashes a failure toast notification, ensuring the interface remains reliable.

6. **Adaptive Table Viewports**:
   - Large tabular data truncates on mobile screens. The application handles this by hiding the standard table element below `768px` (medium breakpoint) and rendering a list of high-fidelity responsive cards instead.

---

## 💡 Future Improvements (With More Time)

If allotted more development time, the following features and architectural refactors would be implemented:

### 1. Server-Side Middleware Authentication
- **Current Approach**: Uses client-side `<AuthGuard />` routing.
- **Improvement**: Implement a Next.js `middleware.ts` file at the root. The middleware would intercept incoming requests on the server, validate cookies containing the access token, and perform redirects before sending HTML. This eliminates layout shifts and prevents flashing of private pages.

### 2. Silent Token Refresh Flow
- **Current Approach**: Access token expires after 1 hour, causing a hard logout.
- **Improvement**: Switch from `localStorage` to `HttpOnly` cookie storage. Implement a Refresh Token rotation scheme. Axios interceptors would capture 401s, request a token refresh silently, retry the failed requests, and extend the user session transparently.

### 3. Automated Testing Suite
- **Improvement**: 
  - Add unit tests with **Jest** and **React Testing Library** for hooks, search debouncers, and optimistic UI rollback calculations.
  - Implement end-to-end integration tests using **Playwright** to validate the login flow, search/filter criteria updates, and mobile viewport responsive card switches.

### 4. Interactive Data Visualizations
- **Improvement**: Integrate charting libraries like **Recharts** on the Dashboard Overview to replace basic stats cards with dynamic graphs, illustrating tracks breakdown, daily/weekly applicant flow rate, and status transition funnels.

### 5. Theme Customization & Native Dark Mode
- **Improvement**: Leverage Tailwind CSS v4 custom variables to build a clean dark/light mode context provider, saving user preference in cookies.

### 6. Granular Access Roles (RBAC)
- **Improvement**: Configure multiple admin access levels (e.g., *Viewer*, *Reviewer*, *Administrator*). Standard reviewers would be limited to filtering and viewing, while only administrators would be permitted to change candidate statuses or trigger database sessions resets.