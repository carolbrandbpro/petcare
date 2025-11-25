Figma Design Package - PetCare (Petzillas style)
=================================================

Included:
- reference_screens.png   (the screenshots you provided)
- tokens.md               (design tokens and component specs)
- components.svg         (example SVG placeholders)

How to use:
1. Create a new file in Figma.
2. Drag in reference_screens.png to use as background.
3. Create pages: Colors, Typography, Components, Screens.
4. Use tokens.md to create color styles and text styles.
5. Recreate components (Header, Card, Timeline, Graph) on Components page.
6. Use auto-layout and constrain to build responsive frames.

Design Tokens (suggested)
- Primary: #FF7800 (orange)
- Secondary: #FFFFFF (white)
- Accent: #FFB66B
- Background pattern: subtle paw/outline (use reference image)

Typography:
- Headings: Inter, 700, 20-28px
- Body: Inter, 400, 14-16px
- Labels: Inter, 600, 12px

Key components to build in Figma:
- Header (orange bar, title, back button)
- Pet Card (avatar circle, name, species, age, edit icon)
- Timeline item (date, icon, description, attachments)
- Vaccine modal (form: vaccine, date, photo upload, save)
- Graph (weight history) - build using line with area fill

Exports:
- Export components as SVG for dev.
- Use 1x and 2x raster exports for mobile mockups.

If you want, I can generate a Figma file programmatically, but I would need to use the Figma API and a token. For now this package provides everything a designer needs to recreate the UI quickly.
