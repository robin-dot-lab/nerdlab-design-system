'use client';

// React Aria Components ship without a 'use client' directive: re-exported straight from the package
// index, they would load in a React Server Component graph and crash there (createContext). This client
// module is the boundary for the pieces the kit passes through (ADR-021).
export { Focusable, I18nProvider, useLocale } from 'react-aria-components';
