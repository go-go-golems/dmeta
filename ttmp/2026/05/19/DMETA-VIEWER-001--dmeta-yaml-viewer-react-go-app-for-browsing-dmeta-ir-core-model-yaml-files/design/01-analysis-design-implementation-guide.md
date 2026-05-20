---
title: "Analysis, Design & Implementation Guide"
doc_type: design
status: active
intent: long-term
topics: [dmeta, yaml-viewer, react, go, swiss-typography]
ticket: DMETA-VIEWER-001
created: 2026-05-19
---

# DMETA YAML Viewer — Analysis, Design & Implementation Guide

## 1. Purpose & Scope

The DMETA YAML Viewer is a self-contained desktop-web application that lets you **browse, read, and navigate** the collection of YAML files that define the DMETA Intermediate Representation (IR). The IR lives under `dmeta/sources/dmeta-ir/` and includes the `core-model/` subdirectory with its archetypes, capabilities, presentations, and domain examples, as well as top-level index and design-language files.

This guide is written for a **new intern** who has never seen the codebase. By the end, you will understand every layer of the system — the data model, the Go backend, the React frontend, the Swiss typography system, and how they fit together. You will also have pseudocode, diagrams, and file references sufficient to implement or extend any part.

---

## 2. What the DMETA IR Is

The DMETA project is a **design-system factory** for high-volume operational applications. Its core abstraction is a typed YAML vocabulary that describes:

- **Archetypes** — broad operational roles (Actor, WorkItem, Resource, Event, TimelineSpan, ActionSpec, ActionInvocation)
- **Capabilities** — reusable semantic affordances that cut across archetypes (identifiable, labelable, stateful, temporal, spatial, relatable, etc.)
- **Presentations** — named display contracts that bridge the semantic model to the widget IR (compact_id, display_label, summary_card, detail_panel, etc.)
- **Domain Examples** — concrete mappings from domain types onto archetypes + capabilities (retail-logistics, agent-workflow)

These YAML files are the **source of truth** for generators, validators, linters, and widget scaffolding tools. Understanding them is the first step to understanding the entire DMETA system.

### Source YAML File Inventory

| File | Artifact Type | Content |
|------|--------------|---------|
| `dmeta-ir/00-index.yaml` | `dmeta_ir_index` | Package index listing all artifacts, their paths, consumers, and validation rules |
| `dmeta-ir/01-core-model.yaml` | `dmeta_core_model` | Core-model package index referencing split files under `core-model/` |
| `dmeta-ir/02-design-language.yaml` | `dmeta_design_language` | Design-language ranges, recipes, states, and lint rules |
| `dmeta-ir/03-widgets.yaml` | `dmeta_widget_ir` | Generic widget classes and contracts |
| `core-model/core-model.yaml` | `dmeta_core_model_metadata` | Shared metadata, logical types, authoring guidelines |
| `core-model/archetypes.yaml` | `dmeta_archetypes` | 7 archetype definitions with default_capabilities and recommended_presentations |
| `core-model/capabilities.yaml` | `dmeta_capabilities` | ~15 capability definitions with projections, presentations, actions, filters |
| `core-model/presentations.yaml` | `dmeta_presentations` | ~20 presentation contracts with layer, applies_to, requires, interaction, style_recipe |
| `core-model/examples/agent-workflow.yaml` | `dmeta_domain_example` | Agent/ToolSpec/ToolRun/ToolEvent/Session domain mapping |
| `core-model/examples/retail-logistics.yaml` | `dmeta_domain_example` | Carrier/Warehouse/Order/Shipment/Package/ScanEvent domain mapping |

---

## 3. Architecture Overview

The application follows a classic **Go backend + React SPA** architecture, embedded into a single binary for distribution.

```
┌──────────────────────────────────────────────────────────────┐
│                    Go Binary (dmeta-viewer)                   │
│                                                              │
│  ┌─────────────────┐     ┌────────────────────────────────┐  │
│  │  HTTP Server     │────▶│  Embedded React SPA (dist/)    │  │
│  │  net/http        │     │  go:embed                      │  │
│  │                  │     └────────────────────────────────┘  │
│  │  /api/*  ────────│──▶  YAML scanner + JSON API           │
│  │  /*      ────────│──▶  Static file server (SPA)         │
│  └─────────────────┘                                        │
│                                                              │
│  CLI flag: --dir <path-to-yaml-dir>                          │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                  React SPA (Vite + RTK Query)                │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │  File Browser │  │  YAML Reader │  │  Cross-reference  │  │
│  │  (sidebar)    │  │  (main)      │  │  Navigator        │  │
│  └──────────────┘  └──────────────┘  └───────────────────┘  │
│                                                              │
│  Redux Store: apiSlice (RTK Query) + uiReducer               │
│  Styling: Tailwind + Swiss Typography (Berkeley Mono)        │
└──────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User opens app
     │
     ▼
React SPA boots → RTK Query calls GET /api/index
     │
     ▼
Go backend scans --dir recursively for *.yaml / *.yml
     │
     ▼
Returns JSON: { files: [{id, name, path, artifact_type, summary, children?}] }
     │
     ▼
React renders sidebar file tree + root content
     │
     ▼
User clicks file → RTK Query calls GET /api/files/:id
     │
     ▼
Go reads YAML → parses to generic map → returns JSON
     │
     ▼
React renders structured YAML view (sections, keys, cross-refs)
```

---

## 4. Go Backend — Detailed Design

### 4.1 Package Structure

```
dmeta-viewer/
├── main.go                  # CLI entry point, --dir flag, embed, HTTP server
├── internal/
│   ├── scanner/
│   │   └── scanner.go       # Walk directory, index YAML files, extract metadata
│   ├── api/
│   │   └── handler.go       # HTTP handlers for /api/index, /api/files/:id, /api/search
│   └── yamlutil/
│       └── yamlutil.go      # YAML → JSON conversion, front-matter extraction
├── frontend/
│   └── dist/                # go:embed target (built by Vite)
├── go.mod
├── go.sum
└── Makefile
```

### 4.2 Scanner (`internal/scanner/scanner.go`)

The scanner walks the configured directory at startup and builds an in-memory index of all YAML files. It extracts lightweight metadata from each file without full parsing.

**Pseudocode:**

```
type FileEntry struct {
    ID           string   // URL-safe ID derived from relative path
    Name         string   // filename without extension
    Path         string   // relative path from --dir root
    ArtifactType string   // value of "artifact_type" field
    Summary      string   // value of "summary" field
    Children     []FileEntry  // sub-files if this is a directory grouping
}

func Scan(dir string) ([]FileEntry, error):
    entries := []
    filepath.WalkDir(dir, func(path, d):
        if not .yaml/.yml: skip
        rel = path relative to dir
        id = slugify(rel)  // e.g. "core-model_archetypes"
        
        // Quick partial parse: read first 30 lines to get artifact_type + summary
        meta = parseFrontMatter(path)  // reads schema_version, artifact_type, summary
        
        entries.append(FileEntry{ID: id, Name: name, Path: rel, 
                                 ArtifactType: meta.ArtifactType, Summary: meta.Summary})
    )
    return buildTree(entries)  // arrange into directory-based tree
```

### 4.3 API Handlers (`internal/api/handler.go`)

Three endpoints using Go 1.22+ `http.ServeMux` route patterns:

| Method | Pattern | Response |
|--------|---------|----------|
| `GET` | `/api/index` | Full file tree with metadata |
| `GET` | `/api/files/{id}` | Parsed YAML content as JSON |
| `GET` | `/api/search?q={query}` | Search across file names and summaries |

**Handler pseudocode:**

```
mux := http.NewServeMux()

mux.HandleFunc("GET /api/index", func(w, r):
    respondJSON(w, scanner.Index())
)

mux.HandleFunc("GET /api/files/{id}", func(w, r):
    id := r.PathValue("id")
    entry := scanner.FindByID(id)
    if not found: 404
    data := yamlutil.ParseToJSON(entry.FullPath)
    respondJSON(w, data)
)

mux.HandleFunc("GET /api/search", func(w, r):
    q := r.URL.Query().Get("q")
    results := scanner.Search(q)
    respondJSON(w, results)
)
```

### 4.4 YAML → JSON Utility (`internal/yamlutil/yamlutil.go`)

Converts any YAML file into a JSON-compatible structure. Uses `gopkg.in/yaml.v3` to parse into `interface{}` then marshals to JSON. This preserves all structure (maps, lists, nested objects) while making it trivially consumable by the React frontend.

**Pseudocode:**

```
func ParseToJSON(path string) (any, error):
    bytes := os.ReadFile(path)
    var data any
    yaml.Unmarshal(bytes, &data)
    // yaml.v3 maps are map[string]any → directly JSON-serializable
    return data, nil
```

### 4.5 Main Entry Point (`main.go`)

- Accepts `--dir` flag (required: path to YAML directory)
- Accepts `--port` flag (default: 8080)
- Calls `scanner.Scan(dir)` at startup
- Registers API handlers + static file server for embedded SPA
- Starts HTTP server

```go
//go:embed frontend/dist
var frontendFS embed.FS

func main() {
    dir := flag.String("dir", "", "Path to YAML directory")
    port := flag.Int("port", 8080, "HTTP port")
    flag.Parse()
    
    index := scanner.Scan(*dir)
    api := api.New(index)
    
    mux := http.NewServeMux()
    mux.Handle("GET /api/", api.Handler())
    mux.Handle("/", http.FileServer(http.FS(frontendFS)))
    
    log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", *port), mux))
}
```

---

## 5. React Frontend — Detailed Design

### 5.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Build | Vite | Fast HMR, production builds |
| UI Framework | React 19 | Component model |
| State | Redux Toolkit + RTK Query | Server state cache, UI state |
| Routing | React Router v7 | Client-side navigation |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Typography | Berkeley Mono (self-hosted woff2) | Swiss monospace design system |
| Dev tools | Storybook 8 | Component isolation and documentation |

### 5.2 Package Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── .storybook/
│   ├── main.js
│   └── preview.js
├── public/
│   └── fonts/
│       ├── BerkeleyMono-Regular.woff2
│       ├── BerkeleyMono-Bold.woff2
│       ├── BerkeleyMono-Oblique.woff2
│       └── BerkeleyMono-Bold-Oblique.woff2
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   └── apiSlice.js
│   ├── app/
│   │   ├── store.js
│   │   └── reducer.js
│   ├── styles/
│   │   ├── fonts.css
│   │   ├── programme.css
│   │   ├── layout.css
│   │   └── components.css
│   ├── components/
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── TopBar.jsx
│   │   ├── StatusBar.jsx
│   │   └── EmptyState.jsx
│   ├── features/
│   │   ├── browser/
│   │   │   ├── FileTree.jsx
│   │   │   └── FileTreeNode.jsx
│   │   ├── viewer/
│   │   │   ├── YamlViewer.jsx
│   │   │   ├── SectionView.jsx
│   │   │   └── KeyValueView.jsx
│   │   └── search/
│   │       └── SearchView.jsx
│   └── stories/
│       ├── Layout.stories.jsx
│       ├── FileTree.stories.jsx
│       ├── YamlViewer.stories.jsx
│       └── Typography.stories.jsx
```

### 5.3 RTK Query API Slice (`src/api/apiSlice.js`)

This is the single source of truth for all backend communication. RTK Query provides automatic caching, refetching, and loading states.

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['File', 'Index'],
  endpoints: (builder) => ({
    getIndex: builder.query({
      query: () => '/index',
      providesTags: ['Index'],
    }),
    getFile: builder.query({
      query: (id) => `/files/${id}`,
      providesTags: (_r, _e, id) => [{ type: 'File', id }],
    }),
    searchFiles: builder.query({
      query: (q) => ({ url: '/search', params: { q } }),
      providesTags: ['Index'],
    }),
  }),
});

export const { useGetIndexQuery, useGetFileQuery, useSearchFilesQuery } = apiSlice;
```

### 5.4 Redux Store (`src/app/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '../api/apiSlice';
import uiReducer from './reducer';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefault) => getDefault().concat(apiSlice.middleware),
});
```

The `uiReducer` tracks: `selectedFileId`, `sidebarOpen`, `searchQuery`.

### 5.5 Component Architecture

#### Layout (`src/components/Layout.jsx`)

The shell component — a fixed sidebar + scrollable main area + status bar.

```
┌─────────────────────────────────────────────────────┐
│  TopBar: [≡] DMETA Viewer        [Search] [□ □ □]  │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │                                          │
│          │                                          │
│ ▸ core-  │    YAML Viewer / Empty State             │
│   model/ │                                          │
│   arch…  │                                          │
│   cap…   │                                          │
│   pres…  │                                          │
│   exam…  │                                          │
│          │                                          │
├──────────┴──────────────────────────────────────────┤
│  StatusBar: 6 files loaded · core-model/ · 8080     │
└─────────────────────────────────────────────────────┘
```

#### Sidebar (`src/components/Sidebar.jsx`)

Renders the file tree from `useGetIndexQuery`. Each node is clickable; clicking sets `selectedFileId` in the store.

#### YamlViewer (`src/features/viewer/YamlViewer.jsx`)

The heart of the app. Takes a parsed JSON object (from `useGetFileQuery`) and renders it as a structured, readable document — not as raw YAML text. Key design decisions:

- **Top-level keys** become sections with label headers
- **Scalar values** render as key-value pairs with the Swiss `label` / `body` roles
- **Lists** render as enumerated items or compact pill rows (for short string lists)
- **Nested objects** render recursively with indentation
- **Cross-references** (values matching known artifact IDs) become clickable links

**Rendering pseudocode:**

```
function YamlViewer({ data }):
  return <div className="yaml-viewer">
    {Object.entries(data).map(([key, value]) =>
      <SectionView key={key} sectionKey={key} value={value} />
    )}
  </div>

function SectionView({ sectionKey, value }):
  if isScalar(value):
    return <KeyValueView label={sectionKey} value={value} />
  if isList(value):
    return <div>
      <h3 className="label">{sectionKey}</h3>
      {value.map(item => <YamlViewer data={item} />)}
    </div>
  if isObject(value):
    return <div>
      <h3 className="label">{sectionKey}</h3>
      <div className="section-indent">
        <YamlViewer data={value} />
      </div>
    </div>
```

### 5.6 Swiss Typography System — "Programme № 1"

The typography system is lifted directly from the image-collector reference project. It follows the **Swiss/International Typographic Style** with these strict constraints:

- **1 font family**: Berkeley Mono
- **1 weight in use**: 400 (regular), with 700 for display emphasis
- **2 sizes**: `--a: 13px` (body) and `--b: 28px` (display)
- **4 roles**: `.body`, `.label`, `.caption`, `.display`

**CSS Custom Properties (from `programme.css`):**

```css
:root {
  --paper: #f8f7f5;
  --ink:   #111111;
  --mute:  #8a8a85;
  --faint: #c5c5c0;
  --rule:  #111111;
  --hover: #00000010;
  --a: 13px;    /* body size */
  --b: 28px;    /* display size */
  --u: 8px;     /* base spacing unit */
  --tracking: 0.06em;
  --leading: 1.5;
  --family: "Berkeley Mono", ui-monospace, monospace;
  --pad: 56px;
}
```

**Why this matters:** The DMETA YAML files are dense, structured, technical documents. A monospace Swiss typography system mirrors the precision and regularity of the data itself. There are no decorative elements — just type, rules, and spacing. The paper-grain background texture adds subtle physicality without distraction.

### 5.7 Tailwind Configuration

Tailwind is used primarily for utility classes (flexbox, grid, padding, margins) while the Swiss typography system is defined in custom CSS. Tailwind's theme is extended to reference the same CSS variables:

```javascript
// tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        mute: 'var(--mute)',
        faint: 'var(--faint)',
      },
      fontFamily: {
        mono: ['var(--family)'],
      },
      spacing: {
        u: 'var(--u)',
        u2: 'var(--u2)',
        u3: 'var(--u3)',
        u4: 'var(--u4)',
        u6: 'var(--u6)',
        u8: 'var(--u8)',
      },
    },
  },
  plugins: [],
};
```

### 5.8 Storybook Stories

Each major component gets a Storybook story for isolated development and visual regression:

- **`Typography.stories.jsx`** — shows `.body`, `.label`, `.caption`, `.display` roles, paper grain, rules
- **`FileTree.stories.jsx`** — file tree with nested directories and leaf files
- **`YamlViewer.stories.jsx`** — renders a sample capability definition and an archetype definition
- **`Layout.stories.jsx`** — full shell with sidebar and viewer

---

## 6. API Reference

### `GET /api/index`

Returns the complete file tree for the configured directory.

**Response:**

```json
{
  "files": [
    {
      "id": "00-index",
      "name": "00-index",
      "path": "00-index.yaml",
      "artifact_type": "dmeta_ir_index",
      "summary": "Minimal DMETA v0 IR package for dense operational presentation-based UI design systems."
    },
    {
      "id": "core-model_archetypes",
      "name": "archetypes",
      "path": "core-model/archetypes.yaml",
      "artifact_type": "dmeta_archetypes",
      "summary": "Reusable operational archetypes for the DMETA core model.",
      "children": []
    }
  ]
}
```

### `GET /api/files/{id}`

Returns the full parsed content of a YAML file as JSON.

**Response:** The JSON representation of the YAML file. For example, `archetypes.yaml` would return:

```json
{
  "schema_version": 0,
  "artifact_type": "dmeta_archetypes",
  "summary": "Reusable operational archetypes...",
  "archetypes": {
    "Actor": {
      "description": "Entity that can perform, own, receive, or be assigned work.",
      "default_capabilities": ["identifiable", "labelable", "actionable", "relatable", "inspectable"],
      "recommended_presentations": ["compact_ref", "inline_token", "summary_card", "detail_panel"],
      "examples": ["Agent", "User", "Carrier", "Warehouse", "Service"]
    }
  }
}
```

### `GET /api/search?q={query}`

Searches file names and summaries.

**Response:**

```json
{
  "results": [
    {
      "id": "core-model_archetypes",
      "name": "archetypes",
      "path": "core-model/archetypes.yaml",
      "artifact_type": "dmeta_archetypes",
      "summary": "Reusable operational archetypes for the DMETA core model.",
      "match": "name"
    }
  ],
  "total": 1
}
```

---

## 7. Cross-Reference Navigation

One of the most valuable features of the viewer is **cross-reference linking**. The DMETA IR is heavily cross-referenced: archetypes reference capabilities, capabilities reference presentations, domain examples reference both. The viewer should detect these references and make them clickable.

**Detection heuristic:** When a string value matches a known ID (artifact type name, archetype name, capability name, presentation name, domain type name), render it as a clickable link that navigates to the corresponding file section.

**Implementation approach:**
1. At index load time, build a lookup map: `{name → fileId}` for all top-level artifact names
2. In the YAML viewer, when rendering a string value, check if it exists in the lookup map
3. If yes, render as `<a onClick={() => navigateToFile(fileId)}>` with the `.label` role styling
4. Initial version: simple file-level navigation (clicking opens the whole file)
5. Future: section-level anchoring (scroll to the specific archetype/capability within a file)

---

## 8. Build & Development Workflow

### 8.1 Makefile Targets

```makefile
.PHONY: dev dev-go dev-frontend build build-frontend build-go clean

# Development (both servers)
dev: dev-frontend dev-go

dev-frontend:
	cd frontend && npm run dev

dev-go:
	go run . --dir ../../dmeta/sources/dmeta-ir --port 8080

# Production build
build: build-frontend build-go

build-frontend:
	cd frontend && npm install && npm run build

build-go: build-frontend
	go build -o bin/dmeta-viewer .

clean:
	rm -rf frontend/dist bin/
```

### 8.2 Development Mode

During development, two servers run simultaneously:

- **Vite dev server** (port 5173) — serves the React SPA with HMR, proxies `/api` to the Go server
- **Go API server** (port 8080) — serves the API endpoints, reads YAML files

The Vite proxy config forwards API calls:

```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
});
```

### 8.3 Production Mode

`make build` compiles the React SPA into `frontend/dist/`, then `go build` embeds that directory into the binary. The result is a single `dmeta-viewer` executable that serves both the API and the SPA.

---

## 9. File References

### Source YAML Files (read-only, not modified)

- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/00-index.yaml` — IR package index
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/01-core-model.yaml` — Core model index
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/02-design-language.yaml` — Design language IR
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/03-widgets.yaml` — Widget IR
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/core-model.yaml` — Core model metadata
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/archetypes.yaml` — Archetype definitions
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/capabilities.yaml` — Capability definitions
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/presentations.yaml` — Presentation contracts
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/examples/agent-workflow.yaml` — Agent workflow example
- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/dmeta/sources/dmeta-ir/core-model/examples/retail-logistics.yaml` — Retail logistics example

### Reference Project (reuse patterns, not code directly)

- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/2026-05-19--image-collector/app/` — Swiss typography + RTK Query reference

### Font Source

- `/home/manuel/code/wesen/fonts/2605182V8RZQQYM2/TX-02-PXVK22M6/*.woff2` — Berkeley Mono woff2 files

### Implementation Directory

- `/home/manuel/workspaces/2026-05-19/dmeta-dsl/2026-05-19--dmeta-viewer/` — Git repo for the viewer app

---

## 10. Implementation Checklist (Tasks)

These map directly to the tasks created in the ticket:

1. **Scaffold Go project** — `main.go`, `internal/` packages, `go.mod`, Makefile
2. **Implement YAML scanner** — Walk directory, extract metadata, build file index
3. **Implement API handlers** — `/api/index`, `/api/files/{id}`, `/api/search`
4. **Scaffold React project** — Vite + React + RTK Query + Tailwind + Storybook
5. **Implement Swiss typography** — `fonts.css`, `programme.css`, `layout.css`, Berkeley Mono fonts
6. **Implement Layout + Sidebar + TopBar** — App shell with file tree navigation
7. **Implement YamlViewer** — Structured rendering of parsed YAML data
8. **Implement search** — Search bar + results view
9. **Implement cross-reference navigation** — Clickable links between related artifacts
10. **Embed SPA in Go binary** — `go:embed`, production build, single-binary distribution
11. **Storybook stories** — Typography, FileTree, YamlViewer, Layout stories
12. **End-to-end test** — Run against real `dmeta-ir/` directory, verify all features

---

## 11. Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Go backend instead of Express | Single-binary distribution, strong stdlib, `go:embed` for SPA |
| `net/http` ServeMux (no framework) | Minimal dependencies, Go 1.22+ pattern matching sufficient |
| RTK Query instead of raw fetch | Automatic caching, loading states, refetching — ideal for read-heavy viewer |
| Swiss typography (Berkeley Mono) | Mirrors the precision of the data; monospace is natural for structured data |
| Structured viewer (not raw YAML) | Readability: sections, labels, cross-refs beat scrolling raw text |
| Tailwind for layout only | Utilities for flexbox/grid; custom CSS for the typography system |
| Directory-argument (`--dir`) | Viewer is generic: point it at any YAML directory, not just DMETA |
