import { join } from 'path';
import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import dts from 'vite-plugin-dts';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default ({ mode }: { mode: string }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  const copyScssFiles = ['mixins', 'theme', 'variables'];

  return defineConfig({
    build: {
      outDir: 'dist',
      sourcemap: mode === 'development' ? 'inline' : false,
      lib: {
        formats: ['es'],
        entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
        name: 'MelkorUI',
        fileName: 'index',
      },
      rollupOptions: {
        external: ['vue'],
      },
      commonjsOptions: {
        esmExternals: true 
      },
    },
    publicDir: false,
    plugins: [
      vue(),
      svgLoader(),
      dts({
        staticImport: true,
        insertTypesEntry: true,
        outputDir: fileURLToPath(new URL('./dist/@types', import.meta.url)),
        include: [fileURLToPath(new URL('./src', import.meta.url))],
        tsConfigFilePath: fileURLToPath(new URL('./tsconfig.app.json', import.meta.url)),
      }),
      viteStaticCopy({
        targets: copyScssFiles.map(file => ({
          src: `./src/assets/scss/${file}.scss`,
          dest: 'scss'
        })),
        watch: {
          options: {
            persistent: true,
          }
        }
      })
    ],
    resolve: {
      alias: [
        {
          find: /~(.+)/,
          replacement: fileURLToPath(new URL('./node_modules/$i', import.meta.url)),
        },
        {
          find: /@style/,
          replacement: fileURLToPath(new URL('./src/assets/scss', import.meta.url)),
        },
        {
          find: /@src/,
          replacement: fileURLToPath(new URL('./src', import.meta.url)),
        },
      ],
    },
  });
};