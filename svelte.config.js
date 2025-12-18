import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    runes: true
  },
  onwarn: (warning, handler) => {
    if (warning.code === 'a11y-click-events-have-key-events') return;
    handler(warning);
  }
}