# Project Overview & Architecture

**Project Name:** `shallow-review-website`
**Framework:** Next.js 16 (App Router)
**Language:** TypeScript
**Styling:** Tailwind CSS 4
**Package Manager:** `npm`

## 1. High-Level Architecture

The project is a static content website designed to display and explore a "Shallow Review" of AI safety research agendas. It relies on a file-based data system where content is stored in YAML files and served via Next.js Server Components.

### Data Flow
1.  **Source:** Data originates from a master Markdown file (`reference/Shallow Review 2025.md`) or is directly maintained in YAML files in `src/data/`.
2.  **Processing:** Scripts (like `scripts/parse-markdown.js`) parse the raw markdown into structured YAML (e.g., `agendas.yaml`).
3.  **Loading:** The application loads these YAML files at runtime (server-side) using helper functions in `src/lib/loadData.ts`.
4.  **Rendering:** Data is passed to React components for rendering pages, tables, and interactive graphs.

## 2. Directory Structure

```
/
├── reference/                  # Source material (Markdown files)
├── scripts/                    # Data conversion and parsing scripts
│   ├── parse-markdown.js       # Main script to convert MD -> YAML
│   └── ...                     # Other data migration scripts
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── [sectionId]/        # Dynamic routes for research sections
│   │   ├── similarity/         # Interactive similarity graph page
│   │   └── ...                 # Other static pages (methodology, funders, etc.)
│   ├── components/             # Reusable UI components
│   ├── constants/              # App-wide constants (colors, config)
│   ├── data/                   # Structured data files (YAML)
│   └── lib/                    # core logic and types
│       ├── loadData.ts         # YAML file loaders
│       ├── similarity.ts       # Graph similarity logic
│       └── types.ts            # TypeScript interfaces for all data entities
└── next.config.ts              # Next.js configuration
```

## 3. Data Model (`src/lib/types.ts`)

The application is built around several core entities:

*   **Agendas:** The primary unit of content. Represents a research agenda with attributes like `summary`, `theoryOfChange`, `orthodoxProblems`, `broadApproaches`, and `papers`.
*   **Labs:** Research organizations.
*   **Taxonomies:**
    *   `OrthodoxProblem`: Standard problems in the field.
    *   `BroadApproach`: General methodologies.
    *   `TargetCase`: Specific scenarios (e.g., "pessimistic", "worst-case").
    *   `Funder`: Organizations funding the research.
    *   `Keyword`: Tags for categorization.

## 4. Key Components

### `SimilarityGraph` (`src/components/SimilarityGraph.tsx`)
*   **Function:** An interactive force-directed graph (using `react-force-graph-2d`) that visualizes connections between different research agendas.
*   **Features:**
    *   Dynamic filtering by similarity weights (e.g., prioritizing shared "Funders" or "Broad Approaches").
    *   Color-coding by Section, Approach, or Target Case.
    *   Interactive controls for edge density and similarity thresholds.

### `AgendaTable` (`src/components/AgendaTable.tsx`)
*   **Function:** A comprehensive data table for listing and sorting research agendas.
*   **Features:**
    *   Sortable columns (Name, FTEs, Papers, etc.).
    *   Visual badges for Approaches, Problems, and Funders.

### `AgendaLink`, `ApproachBadge`, `PaperCard`
*   Smaller, atomic components used to display specific data entities consistently across the site.

## 5. Build & Scripts

*   **`npm run dev`**: Starts the Next.js development server.
*   **`npm run parse:markdown`**: Runs `scripts/parse-markdown.js` to regenerate `src/data/agendas.yaml` from the reference Markdown file.
*   **`npm run convert:*`**: Various utility scripts for migrating or normalizing data structures.

## 6. Styling & UI

*   **Tailwind CSS 4**: Used for all styling.
*   **UI Library**: Minimal external dependencies; uses `@radix-ui/react-dropdown-menu` and `lucide-react` for icons.
*   **Design System**:
    *   Consistent color coding for sections and taxonomies (defined in `src/components/SimilarityGraph.tsx` and `src/constants/colors.ts`).
    *   Responsive layout with a shared `Header` and navigation.

