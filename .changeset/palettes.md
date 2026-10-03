---
"@robin-dot-lab/tokens": minor
"@robin-dot-lab/css-candy": minor
---

Seven colour palettes, each with a light and a dark theme: Candy (default), Sorbet, Ink, Terracotta, Slate, Moss and Mono Retro. Select one with `data-palette="…"` on `<html>` or on any container; `@robin-dot-lab/tokens/palettes.json` lists them. Every palette is checked at build time: text 4.5:1 on every background and fill, lines and focus rings 3:1, adjacent chart colours distinct with normal vision and under protanopia, deuteranopia and tritanopia. The tomato button hover and the search placeholder now derive from tokens so they follow the palette.
