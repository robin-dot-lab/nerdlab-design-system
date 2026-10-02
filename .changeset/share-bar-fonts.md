---
"@robin-dot-lab/charts": patch
---

`ShareBar` measures its segment labels again once web fonts have loaded, so a percentage is no longer dropped (or left overflowing) when the first render happened before the fonts arrived.
