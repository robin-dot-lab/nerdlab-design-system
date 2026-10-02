import { composeRenderProps } from 'react-aria-components';
import { cn } from './cn.js';

/** Prepends nl-* classes to a React Aria className, which may be a string or a render-props function. */
export function composeClass<T>(base: string, className: string | ((values: T & { defaultClassName: string | undefined }) => string) | undefined) {
  return composeRenderProps(className, (resolved) => cn(base, resolved));
}
