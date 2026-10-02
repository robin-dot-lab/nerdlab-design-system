import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// No alias to package sources on purpose: the app consumes @robin-dot-lab/* through their
// package.json "exports", i.e. the built dist/ files, exactly like an external application.
export default defineConfig({ plugins: [react()], base: './' });
