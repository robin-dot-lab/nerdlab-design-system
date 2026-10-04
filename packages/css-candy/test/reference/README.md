# Reference (test fixtures)

The original static Candy design — then called **Pop** — frozen as the oracle of the parity tests:

- `design-system.css`: the monolithic stylesheet the package was split from;
- `design-system-preview.html`, `dashboard-preview.html`: the two pages rendered against it.

`scripts/visual-parity.mjs` renders both pages with this stylesheet (plus `../reference-deviations.css`) and with `dist/candy.css`, and requires identical pixels; `@robin-dot-lab/tokens`' `check-parity.mjs` compares the variables. **Never edit these files to make a test pass**: an intended change is declared as a deviation. They still say "Pop" on purpose.
