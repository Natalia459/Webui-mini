import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import viteCompression from 'vite-plugin-compression'
import svgLoader from 'vite-svg-loader'
import fs from 'fs'
import path from 'path'


const htmlHashPlugin = {
  name: 'html-hash',
  enforce: 'post',
  generateBundle(options, bundle) {
    const indexHtml = bundle['index.html'];
    indexHtml.fileName = `index.4bd3782d.html`;
  },
};

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    base: '/',
    server: {
      https: {
        key: fs.readFileSync(path.resolve(__dirname, 'localhost.key')),
        cert: fs.readFileSync(path.resolve(__dirname, 'localhost.crt'))
      },
      port: 443,
      proxy: {
        '/login': {
          target: process.env.BASE_URL || 'http://localhost:8000',
          changeOrigin: true,
          onProxyRes(proxyRes) {
            delete proxyRes.headers['strict-transport-security']
          },
          onError: (err) => {
          console.error('Proxy error:', err)
          },
          secure: true
        }
      }
    },
    
    plugins: [
      vue({
        template: {
          compilerOptions: {
            compatConfig: { MODE: 2 } // Vue 3 compatibility mode
          }
        }
      }),
      [htmlHashPlugin],
      svgLoader(), 
      viteCompression({ 
        algorithm: 'gzip',
        ext: '.gz',
        filter: /\.(js|css|html|ico)$/,
        threshold: 0,
        deleteOriginFile: true
      })
    ],
    
    build: {
      sourcemap: false,
      outDir: 'dist',
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 1000,
      inlineDynamicImports: false,
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
        },
        output: {
          manualChunks: undefined, // Turn off code splitting
          // entryFileNames: 'js/app.[hash:8].js',
          // // entryFileNames: 'css/[name].[hash:8].css',
          // chunkFileNames: '[name].[hash:8].js',
          // assetFileNames: (assetInfo) => {
          //   if (assetInfo.name?.endsWith('.css')) {
          //     return 'css/app.[hash:8].css';  // CSS → /css
          //   }
          //   if (assetInfo.name?.endsWith('.ico')) {
          //     return 'favicon.[hash:8].ico';  // favicon → корень
          //   }
          //   if (assetInfo.name?.endsWith('.html')) {
          //     return 'index.[contenthash:8].html';  // index → корень
          //   }
          //   return '[name].[hash:8].[ext]';  
          // }
          entryFileNames: 'js/app.2d609357.js',
          // entryFileNames: 'css/[name].[hash:8].css',
          chunkFileNames: '[name].2d609357.js',
          assetFileNames: (assetInfo) => {
            if (assetInfo.name?.endsWith('.css')) {
              return 'css/app.54f1f246.css';  // CSS → /css
            }
            if (assetInfo.name?.endsWith('.ico')) {
              return 'favicon.eff4e01d.ico';  // favicon → корень
            }
          }
        }
      }
    },
    
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
        
    optimizeDeps: {
      exclude: isProduction ? [] : ['vue-demi']
    }
  }
})