/** Categorical slot of the skin's chart palette (--chart-1 … --chart-4). Assigned in fixed order; colour follows the entity. */
export type Slot = 1 | 2 | 3 | 4;
export const slotColor = (slot: Slot) => `var(--chart-${slot})`;
/** Sequential step of the skin's ramp (--chart-seq-1 … --chart-seq-5). */
export const seqColor = (step: number) => `var(--chart-seq-${step})`;
