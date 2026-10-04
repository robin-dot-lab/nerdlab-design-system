import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  core: { disableTelemetry: true },
  // Stories import the React, chart, icon and mail sources directly: edits show up without rebuilding the package.
  viteFinal: async (cfg) => ({
    ...cfg,
    resolve: {
      ...cfg.resolve,
      alias: {
        ...(cfg.resolve?.alias as Record<string, string>),
        '@robin-dot-lab/react': fileURLToPath(new URL('../../../packages/react/src/index.ts', import.meta.url)),
        '@robin-dot-lab/charts': fileURLToPath(new URL('../../../packages/charts/src/index.ts', import.meta.url)),
        '@robin-dot-lab/icons': fileURLToPath(new URL('../../../packages/icons/src/index.ts', import.meta.url)),
        '@robin-dot-lab/mail': fileURLToPath(new URL('../../../packages/mail/src/index.ts', import.meta.url)),
      },
    },
  }),
};
export default config;
