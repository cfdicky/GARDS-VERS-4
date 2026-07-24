---
name: ui-ux-pro-max
description: "Use for UI/UX work: designing or reviewing pages and components, choosing layout, color, typography, motion, responsive behavior, accessibility, interaction patterns, or data visualization. Uses the installed UI/UX Pro Max searchable design database and stack guidance."
---

# UI/UX Pro Max

Use this skill when a request changes how an interface looks, feels, moves, or is used. This includes new pages, components, visual systems, responsive behavior, navigation, animation, accessibility, UI reviews, and UX fixes.

Skip it for backend-only logic, data modeling, infrastructure, or non-visual scripts.

## Local Assets

The installer places the searchable database and scripts at:

```text
.github/prompts/ui-ux-pro-max/
```

Run the bundled search script from the project root. On Windows use `python`; on macOS/Linux use `python3` when needed:

```text
python .github/prompts/ui-ux-pro-max/scripts/search.py "<query>" --domain <domain>
```

The script uses Python's standard library only. If Python is unavailable, do not install it automatically. Continue with the rules in this file and tell the user that database searches were skipped.

## Priority Order

Apply these concerns in order:

1. Accessibility: keyboard access, visible focus, labels, alt text, semantic HTML, and at least 4.5:1 text contrast.
2. Touch and interaction: targets of at least 44 by 44 pixels, clear hover/focus/pressed/loading states, and no hover-only actions.
3. Performance: reserve image space, use appropriate image formats and lazy loading, and avoid layout shift.
4. Style selection: choose a coherent visual language and use SVG icons or the project's icon library, never emoji as interface icons.
5. Responsive layout: start mobile-first, preserve readable line lengths, and prevent horizontal overflow.
6. Typography and color: use semantic design tokens, a base size near 16px, readable line height, and purposeful font pairings.
7. Motion: use motion to communicate state or hierarchy, keep common transitions around 150-300ms, and respect reduced motion.
8. Forms and feedback: visible labels, inline errors, helper text, disabled/loading states, and focus management.
9. Navigation: predictable hierarchy, back behavior, active states, and deep-linkable destinations where relevant.
10. Data visualization: accessible color, labels, legends, and tooltips; never communicate meaning with color alone.

## Workflow

### 1. Analyze the Request

Extract:

- Product type and industry
- Audience and usage context
- Required page or component structure
- Style keywords, mood, density, and light/dark requirements
- Interaction, motion, accessibility, and responsive requirements
- The actual implementation stack from the repository

Detect the stack from project files and dependencies. This workspace uses React with Vite and Tailwind CSS, so use `react` and the applicable web/Tailwind guidance. Do not assume React Native or another stack from an example.

### 2. Generate a Design System for New Pages

For a new page or project, always start with a design-system search:

```text
python .github/prompts/ui-ux-pro-max/scripts/search.py "<product> <industry> <tone> <density>" --design-system -p "<Project Name>"
```

Use the result to choose the page pattern, style, colors, typography, effects, and anti-patterns. For stronger output, combine product, industry, tone, and density keywords instead of searching for a generic term such as `app`.

Optional dials tune the result without changing the query:

```text
python .github/prompts/ui-ux-pro-max/scripts/search.py "<query>" --design-system --variance <1-10> --motion <1-10> --density <1-10>
```

Use lower variance for restrained layouts, higher variance for bold/asymmetric layouts, lower motion for subtle interactions, and higher density for dashboards or operational tools.

### 3. Persist and Retrieve Design Decisions

If design decisions should survive across sessions, persist them to the project root:

```text
python .github/prompts/ui-ux-pro-max/scripts/search.py "<query>" --design-system --persist -p "<Project Name>" --output-dir "."
```

Before regenerating, check whether the generated `design-system/` files already exist. Do not overwrite an existing master without an explicit request or `--force`.

When building a named page, read the master file first and then check for its page override. Page rules override the master only where they explicitly differ.

### 4. Supplement the Search

Use targeted searches when the design system leaves a decision open:

```text
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --domain product
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --domain style
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --domain color
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --domain typography
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --domain landing
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --domain ux
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --domain gsap
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --domain react
python .github/prompts/ui-ux-pro-max/scripts/search.py "<keywords>" --stack react
```

Use the explicit domain when automatic routing could be ambiguous. If a search returns zero results, retry once with broader terms. If it is still empty, say so and use the priority rules above; never invent a database match.

### 5. Implement in the Existing System

Read the nearest components, tokens, and styles before editing. Reuse the project's UI primitives and design tokens. Keep page sections unframed unless they are genuinely cards, modals, or repeated items. Use the existing icon library or add an established icon package only when needed.

For React work, preserve the repository's component patterns and keep state behavior, loading states, error states, keyboard interactions, and focus behavior complete. Use real visual assets when the user needs to inspect a product, place, object, or project; do not substitute decorative placeholders for primary content.

### 6. Validate Before Delivery

Run the narrowest relevant check, then validate the finished UI at mobile and desktop widths. Confirm:

- The application builds and the touched tests or lint checks pass.
- The intended hierarchy is clear without explanatory UI paragraphs.
- Text fits its containers at narrow and wide widths, with no horizontal scroll or overlap.
- All interactive controls have usable hover, focus, pressed, disabled, and loading states.
- Icon-only controls have accessible names and unfamiliar icons have tooltips.
- Images have useful alt text and reserve their layout space.
- Contrast, keyboard navigation, semantic structure, and reduced-motion behavior are correct.
- Animations are purposeful, performant, and do not block the main task.
- The chosen colors, fonts, spacing, and effects are consistent with the generated design system.

For browser-based work, use the available browser or Playwright tooling when available and inspect both a narrow mobile viewport and a wide desktop viewport. Report any validation that could not be run.