# Design System

## Direction

A close adaptation of the Sawad portfolio system using Chrislyr's real identity and work, distinguished by a Forest + Bone palette. A warm-bone sticky portrait card anchors a deep evergreen canvas while a scrolling content column uses two-tone display headings, lichen and sand feature panels, compact project and education rows, a tool index, working notes, and a ruled contact index.

## Color

- Canvas: deep forest, `oklch(16% .02 155)`
- Raised navigation: evergreen, `oklch(21% .028 154)`
- Primary text and profile surface: warm bone, `oklch(94% .018 92)`
- Recessed heading: shadow green, `oklch(27% .03 154)`
- Muted text: sage gray, `oklch(70% .025 145)`
- Primary accent: lichen, `oklch(80% .13 126)`
- Secondary accent: sand, `oklch(84% .045 82)`
- Light-surface accent: deep moss, `oklch(43% .1 143)`

## Typography

- Display and body: Poppins in weights 400 through 700.
- Desktop hero type is 110px; section headings are 90px with a white first line and recessed second line.
- Mobile headings reduce to 43-56px while preserving the two-line treatment.
- Body copy remains below 72 characters per line.

## Layout

- Desktop uses a centered 1,140px frame: a 344px sticky identity panel, a 100px gutter, and a 696px scrolling content column.
- The identity panel stops 40px from the viewport top and remains visible while work, education, tools, and contact content scrolls.
- The fixed icon dock is 292px by 48px. Project rows are 175px, education rows are 198px, and desktop tool cells are 343px by 92px.
- Mobile becomes a 350px single column with 20px side margins and a 350px by 461px profile card in normal flow.
- Contact details appear as three ruled rows for copyable email, GitHub, and downloadable CV, followed by a compact identity footer.

## Motion

- A minimal inline loading screen prevents unstyled white frames before JavaScript loads; a single orange trace follows a fluid path into the portfolio.
- The loader remains visible for at least 700ms on first entry, then exits with a short opacity and focus-pull transition once the page is ready.
- Initial profile and content reveals use opacity and transform only.
- Section reveals run once as content enters the viewport; active navigation follows the visible section.
- Lenis smooths wheel and anchor navigation while preserving native scrolling, sticky positioning, and accessibility.
- Hover transitions last 250–500ms with exponential easing and avoid layout-property animation.
- Lenis and all nonessential movement honor `prefers-reduced-motion` changes without requiring a reload.
- Reduced-motion visitors receive an immediate loader handoff with a static progress trace.
