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
export const ArrowUp = createIcon('ArrowUp', <path d="M12 19V5M6 11l6-6 6 6" />);
export const ArrowDown = createIcon('ArrowDown', <path d="M12 5v14M6 13l6 6 6-6" />);

/** Bare marks for a coloured disc drawn by the skin (Callout): no circle of their own. */
export const InfoMark = createIcon(
  'InfoMark',
  <>
    <path d="M12 11v7" />
    <circle cx="12" cy="6.5" r="0.6" fill="currentColor" />
  </>,
);
export const ExclamationMark = createIcon(
  'ExclamationMark',
  <>
    <path d="M12 5v8.5" />
    <circle cx="12" cy="18.5" r="0.6" fill="currentColor" />
  </>,
);

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

export const Copy = createIcon(
  'Copy',
  <>
    <rect x="8.5" y="8.5" width="12" height="12" rx="2" />
    <path d="M15.5 8.5V5a1.5 1.5 0 0 0-1.5-1.5H5A1.5 1.5 0 0 0 3.5 5v9A1.5 1.5 0 0 0 5 15.5h3.5" />
  </>,
);

export const Eye = createIcon(
  'Eye',
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
    <circle cx="12" cy="12" r="3" />
  </>,
);
export const EyeOff = createIcon(
  'EyeOff',
  <>
    <path d="M9.9 5.8A9.6 9.6 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-2.6 3.4M6.6 6.6C3.9 8.3 2.5 12 2.5 12S6 18.5 12 18.5a9 9 0 0 0 5.4-1.8" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2M3.5 3.5l17 17" />
  </>,
);

export const Mail = createIcon(
  'Mail',
  <>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="M3.5 7l8.5 6.5L20.5 7" />
  </>,
);

export const Inbox = createIcon(
  'Inbox',
  <>
    <path d="M3.5 13.5l2.6-7.3A1.5 1.5 0 0 1 7.5 5h9a1.5 1.5 0 0 1 1.4 1.2l2.6 7.3V18a1.5 1.5 0 0 1-1.5 1.5h-14A1.5 1.5 0 0 1 3.5 18Z" />
    <path d="M3.5 13.5h4.5l1.5 2.5h5l1.5-2.5h4.5" />
  </>,
);

export const PanelLeft = createIcon(
  'PanelLeft',
  <>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
    <path d="M9.5 4.5v15" />
  </>,
);

export const Paperclip = createIcon('Paperclip', <path d="M20 11.5l-7.8 7.8a5 5 0 0 1-7.1-7.1l8.2-8.2a3.3 3.3 0 0 1 4.7 4.7l-8.2 8.2a1.7 1.7 0 0 1-2.4-2.4l7.6-7.6" />);

export const Download = createIcon('Download', <path d="M12 4v11M7 10.5l5 5 5-5M4.5 20h15" />);

export const Trash = createIcon(
  'Trash',
  <>
    <path d="M4 6.5h16M9.5 6.5V4.5h5v2M6 6.5l1 13a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5l1-13" />
    <path d="M10 10.5v6M14 10.5v6" />
  </>,
);

const sheet = 'M14 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8L14 3.5Z M14 3.5V8h4.5';

export const File = createIcon('File', <path d={sheet} />);
export const FileText = createIcon('FileText', <><path d={sheet} /><path d="M9 12.5h6M9 16h6" /></>);
export const FileImage = createIcon(
  'FileImage',
  <>
    <path d={sheet} />
    <circle cx="10" cy="11.5" r="1.3" />
    <path d="M18.5 17l-3.5-3.5-6.5 7" />
  </>,
);
export const FileArchive = createIcon('FileArchive', <><path d={sheet} /><path d="M11 5v2M11 9v2M11 13v2M9.5 17h3" /></>);

export const Code = createIcon('Code', <path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15" />);

export const Clock = createIcon(
  'Clock',
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3.5 2" />
  </>,
);
