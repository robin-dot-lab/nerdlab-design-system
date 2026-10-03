// Hand-drawn on a 24×24 grid for strokes of 2 units with round caps: shapes keep about 3 units
// from the edge so the stroke never clips, and corners stay soft to match the Candy outlines.
import type { ReactNode } from 'react';
import { Icon, type IconProps } from './icon.js';

export type IconComponentProps = Omit<IconProps, 'children'>;

function createIcon(displayName: string, shapes: ReactNode) {
  const Component = (props: IconComponentProps) => <Icon {...props}>{shapes}</Icon>;
  Component.displayName = displayName;
  return Component;
}

export const Check = createIcon('Check', <path d="M5 12.5l4.5 4.5L19 7.5" />);

export const Close = createIcon('Close', <path d="M6 6l12 12M18 6L6 18" />);

export const ChevronDown = createIcon('ChevronDown', <path d="M6 9l6 6 6-6" />);
export const ChevronUp = createIcon('ChevronUp', <path d="M6 15l6-6 6 6" />);
export const ChevronLeft = createIcon('ChevronLeft', <path d="M15 6l-6 6 6 6" />);
export const ChevronRight = createIcon('ChevronRight', <path d="M9 6l6 6-6 6" />);

export const ArrowLeft = createIcon('ArrowLeft', <path d="M19 12H5M11 6l-6 6 6 6" />);
export const ArrowRight = createIcon('ArrowRight', <path d="M5 12h14M13 6l6 6-6 6" />);

export const Plus = createIcon('Plus', <path d="M12 5v14M5 12h14" />);
export const Minus = createIcon('Minus', <path d="M5 12h14" />);

export const Search = createIcon(
  'Search',
  <>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="M15.5 15.5l5 5" />
  </>,
);

export const Menu = createIcon('Menu', <path d="M4 6h16M4 12h16M4 18h16" />);

export const Info = createIcon(
  'Info',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.5h.01" />
  </>,
);

export const Warning = createIcon(
  'Warning',
  <>
    <path d="M10.3 4.2L2.6 17.5a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4M12 17h.01" />
  </>,
);

export const Error = createIcon(
  'Error',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M9 9l6 6M15 9l-6 6" />
  </>,
);

export const Success = createIcon(
  'Success',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </>,
);

export const Calendar = createIcon(
  'Calendar',
  <>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
  </>,
);

export const User = createIcon(
  'User',
  <>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c.8-3.8 3.8-6 7.5-6s6.7 2.2 7.5 6" />
  </>,
);

export const ExternalLink = createIcon(
  'ExternalLink',
  <>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </>,
);

export const Pause = createIcon(
  'Pause',
  <>
    <rect x="6" y="5" width="4" height="14" rx="1" />
    <rect x="14" y="5" width="4" height="14" rx="1" />
  </>,
);

export const Play = createIcon('Play', <path d="M7 5.1v13.8a1 1 0 0 0 1.5.9l11-6.9a1 1 0 0 0 0-1.8l-11-6.9A1 1 0 0 0 7 5.1Z" />);

export const Sort = createIcon('Sort', <path d="M8 20V4M4 8l4-4 4 4M16 4v16M12 16l4 4 4-4" />);

export const Home = createIcon(
  'Home',
  <>
    <path d="M3.5 11L12 4l8.5 7" />
    <path d="M5.5 9.5V20H10v-5.5h4V20h4.5V9.5" />
  </>,
);

export const Filter = createIcon('Filter', <path d="M3.5 5h17L14 13v6l-4 2v-8L3.5 5Z" />);

export const MoreHorizontal = createIcon(
  'MoreHorizontal',
  <>
    <circle cx="5" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="19" cy="12" r="1.5" fill="currentColor" />
  </>,
);
