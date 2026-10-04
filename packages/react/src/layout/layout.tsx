import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';
import { cn } from '../lib/cn.js';

/** Spacing steps available as gap modifiers (`.nl-gap-*`), shared by every layout primitive. */
export type Gap = 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 'fluid-sm' | 'fluid-md' | 'fluid-lg' | 'fluid-xl';
const gapClass = (gap: Gap | undefined) => (gap === undefined ? undefined : `nl-gap-${gap}`);

interface PrimitiveProps extends ComponentProps<'div'> {
  /** Render the single child element with the layout classes (e.g. `<ul>`, `<section>`). */
  asChild?: boolean;
}

function primitive(base: string, extra: string | undefined, { asChild, className, ...props }: PrimitiveProps) {
  const Comp = asChild ? Slot : 'div';
  return <Comp className={cn(base, extra, className)} {...props} />;
}

/** Centered column, max width `--content-max`, fluid side gutter. */
export function Container(props: PrimitiveProps) {
  return primitive('nl-container', undefined, props);
}

/** Vertical rhythm between page sections (`--section-y`). Renders a `<section>`. */
export function Section({ className, ...props }: ComponentProps<'section'>) {
  return <section className={cn('nl-section', className)} {...props} />;
}

const stackVariants = cva('nl-stack', { variants: { align: { stretch: '', start: 'nl-stack--start', center: 'nl-stack--center' } } });
export interface StackProps extends PrimitiveProps, VariantProps<typeof stackVariants> { gap?: Gap }
/** Vertical flow with a uniform gap. */
export function Stack({ gap, align, ...props }: StackProps) {
  return primitive(stackVariants({ align }), gapClass(gap), props);
}

const clusterVariants = cva('nl-cluster', { variants: { justify: { start: '', center: 'nl-cluster--center', end: 'nl-cluster--end', between: 'nl-cluster--between' } } });
export interface ClusterProps extends PrimitiveProps, VariantProps<typeof clusterVariants> { gap?: Gap }
/** Horizontal group that wraps (buttons, tags, toolbars). */
export function Cluster({ gap, justify, ...props }: ClusterProps) {
  return primitive(clusterVariants({ justify }), gapClass(gap), props);
}

const gridVariants = cva('nl-grid-auto', { variants: { min: { xs: 'nl-grid-auto--xs', sm: 'nl-grid-auto--sm', md: '', lg: 'nl-grid-auto--lg', xl: 'nl-grid-auto--xl' } } });
export interface GridProps extends PrimitiveProps, VariantProps<typeof gridVariants> { gap?: Gap }
/** Intrinsic grid: as many columns as fit, each at least `min` wide, never overflowing. */
export function Grid({ gap, min, ...props }: GridProps) {
  return primitive(gridVariants({ min }), gapClass(gap), props);
}

const splitVariants = cva('nl-split', {
  variants: {
    ratio: { equal: '', '1-2': 'nl-split--1-2', '2-1': 'nl-split--2-1', sidebar: 'nl-split--sidebar', 'sidebar-end': 'nl-split--sidebar-end' },
    /** `stretch` (default): both panes as tall as the taller one. `start`: each pane keeps its content's height. */
    align: { stretch: '', start: 'nl-split--start' },
  },
});
export interface SplitProps extends PrimitiveProps, VariantProps<typeof splitVariants> { gap?: Gap }
/** Two panes: stacked on small screens, side by side from the skin's large breakpoint. */
export function Split({ gap, ratio, align, ...props }: SplitProps) {
  return primitive(splitVariants({ ratio, align }), gapClass(gap), props);
}

/** Content for assistive technologies only. */
export function VisuallyHidden({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('nl-visually-hidden', className)} {...props} />;
}
