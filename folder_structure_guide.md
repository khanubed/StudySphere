# Folder Structure Guide — StudySphere Monorepo

Welcome to the StudySphere workspace. This repository is organized as a monorepo using **npm workspaces** to coordinate multiple applications and share schemas, types, and UI tokens between them.

---

## Workspace Layout

```
studysphere/
  ├── apps/                  # Deployable applications
  │   ├── web/               # Client Web Application (Vite + React + TS)
  │   ├── api/               # Express Backend Server (Node.js + Prisma)
  │   └── mobile/            # Client Mobile Application (Expo / React Native)
  │
  ├── packages/              # Shared library packages
  │   ├── ui-tokens/         # Design system tokens (colors, spacing, layout)
  │   ├── shared-schemas/    # Shared Zod validation schemas
  │   └── shared-types/      # Common TypeScript interfaces and models
  │
  ├── docs/                  # Project specifications and architecture documentation
  │   ├── StudySphere-Architecture.md
  │   ├── StudySphere-Design.md
  │   ├── StudySphere-PRD.md
  │   └── ... (other markdown documentation files)
  │
  ├── package.json           # Root workspace configuration
  └── tsconfig.json          # Shared compiler configuration
```

---

## Detailed Directory Breakdown

### 1. Applications (`apps/`)

#### 💻 [apps/web](file:///d:/CODING/Collage/Mini/apps/web)
Vite + React 19 + Tailwind CSS + Redux Toolkit web application.
*   `src/components/`: Reusable UI layouts and widgets (e.g. [MainLayout](file:///d:/CODING/Collage/Mini/apps/web/src/components/MainLayout.tsx), [TokenUsageIndicator](file:///d:/CODING/Collage/Mini/apps/web/src/components/TokenUsageIndicator.tsx)).
*   `src/pages/`: Core page views mapped to frontend routes:
    *   [Landing](file:///d:/CODING/Collage/Mini/apps/web/src/pages/Landing.tsx): Visual index.
    *   [Login](file:///d:/CODING/Collage/Mini/apps/web/src/pages/Login.tsx) & [Register](file:///d:/CODING/Collage/Mini/apps/web/src/pages/Register.tsx): Auth forms.
    *   [Dashboard](file:///d:/CODING/Collage/Mini/apps/web/src/pages/Dashboard.tsx): Analytics view.
    *   [ResourceHub](file:///d:/CODING/Collage/Mini/apps/web/src/pages/ResourceHub.tsx): Shared study materials list.
*   `src/store/`: State management container:
    *   [index.ts](file:///d:/CODING/Collage/Mini/apps/web/src/store/index.ts): Configures Redux store.
    *   [authSlice.ts](file:///d:/CODING/Collage/Mini/apps/web/src/store/authSlice.ts): Session state.
    *   [uiSlice.ts](file:///d:/CODING/Collage/Mini/apps/web/src/store/uiSlice.ts): Dynamic theme/collapsible panel toggles.
    *   `api/baseApi.ts`: Baseline RTK Query fetch client.
*   `tailwind.config.js`: Integrated with Tailwind CSS styles mapped to shared UI tokens.

#### ⚙️ [apps/api](file:///d:/CODING/Collage/Mini/apps/api)
Node.js Express backend server written in TypeScript.
*   `prisma/`: PostgreSQL schema definition and database migrations:
    *   [schema.prisma](file:///d:/CODING/Collage/Mini/apps/api/prisma/schema.prisma): Includes models for User, Resource, AIGeneration, PlannerTask, and AuditLog.
*   `src/routes/`: Route mappings:
    *   [index.ts](file:///d:/CODING/Collage/Mini/apps/api/src/routes/index.ts): Aggregates routes.
    *   [auth.routes.ts](file:///d:/CODING/Collage/Mini/apps/api/src/routes/auth.routes.ts): Register and Login.
    *   [resource.routes.ts](file:///d:/CODING/Collage/Mini/apps/api/src/routes/resource.routes.ts): File sharing routes.
*   `src/middlewares/`: Centralized request filtering:
    *   [error.middleware.ts](file:///d:/CODING/Collage/Mini/apps/api/src/middlewares/error.middleware.ts): Error interceptor transforming Zod issues and custom codes.

#### 📱 [apps/mobile](file:///d:/CODING/Collage/Mini/apps/mobile)
Scaffolded skeleton for React Native Expo app.
*   [App.tsx](file:///d:/CODING/Collage/Mini/apps/mobile/App.tsx): Main entry screen.

---

### 2. Shared Packages (`packages/`)

#### 🎨 [packages/ui-tokens](file:///d:/CODING/Collage/Mini/packages/ui-tokens)
*   [colors.ts](file:///d:/CODING/Collage/Mini/packages/ui-tokens/src/colors.ts): Sells HSL color tokens for Light and Dark modes matching the design guide. Includes spacing scales and border-radii values.

#### 📝 [packages/shared-schemas](file:///d:/CODING/Collage/Mini/packages/shared-schemas)
*   [auth.ts](file:///d:/CODING/Collage/Mini/packages/shared-schemas/src/auth.ts): Validation schemas (`loginSchema`, `registerSchema`) imported on both client (for react-hook-form) and server (for express request validation).

#### 🏷️ [packages/shared-types](file:///d:/CODING/Collage/Mini/packages/shared-types)
*   [index.ts](file:///d:/CODING/Collage/Mini/packages/shared-types/src/index.ts): Type interfaces like `ApiResponse`, `UserProfile`, and `TokenUsage`.

---

## Running Commands

Run workspace-scoped tasks directly from the root directory:

*   **Install all dependencies**:
    ```bash
    npm install
    ```
*   **Compile shared packages**:
    ```bash
    npm run build -w packages/ui-tokens
    npm run build -w packages/shared-schemas
    npm run build -w packages/shared-types
    ```
*   **Run Web App Dev Server (Vite)**:
    ```bash
    npm run dev:web
    ```
*   **Run API Backend Dev Server (Express)**:
    ```bash
    npm run dev:api
    ```
*   **Build Web App Production Package**:
    ```bash
    npm run build:web
    ```
*   **Build API Backend Production Package**:
    ```bash
    npm run build:api
    ```
