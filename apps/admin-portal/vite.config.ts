/// <reference types='vitest' />
import { defineConfig, loadEnv } from 'vite';
import EnvironmentPlugin from 'vite-plugin-environment';
import react from '@vitejs/plugin-react';


export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const tsconfigPaths = (await import('vite-tsconfig-paths')).default;

  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/admin-portal',
    server: {
      port: 5173,
      host: 'localhost',
      proxy: {
				'/api': {
					target: env.API_BASE_URL,
					changeOrigin: true,
					rewrite: (path: string) => path.replace(/^\/api/, ''),
				},
			},
    },
    preview: {
      port: 5173,
      host: 'localhost',
    },
    plugins: [react(), EnvironmentPlugin({}), tsconfigPaths()],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      reporters: ['default'],
      coverage: {
        reportsDirectory: './test-output/vitest/coverage',
        provider: 'v8' as const,
      },
    },
  }
})
