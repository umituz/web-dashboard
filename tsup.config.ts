import { defineConfig } from 'tsup';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/presentation/index.ts',
    'src/domain/types/index.ts',
    'src/domain/theme/index.ts',
    'src/infrastructure/hooks/index.ts',
    'src/infrastructure/utils/index.ts',
  ],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    'react-router-dom',
    'react-i18next',
    '@umituz/web-design-system',
    '@umituz/web-design-system/utils',
    '@umituz/web-design-system/atoms',
    'lucide-react',
    'clsx',
    'tailwind-merge',
    'class-variance-authority',
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
