import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // GitHub Pages serves project sites from /<repository>/ rather than from /.
  // Keep the local development URL unchanged.
  base: process.env.GITHUB_ACTIONS ? '/md-with-git-branded/' : '/',
  plugins: [react()],
});
