import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';
import visualizer from "rollup-plugin-visualizer";
import viteImagemin from 'vite-plugin-imagemin';
import viteCompression from 'vite-plugin-compression';
import legacyPlugin from '@vitejs/plugin-legacy';
import Components from 'unplugin-vue-components/vite' // 按需加载自定义组件
import { ViewUiResolver } from 'unplugin-vue-components/resolvers'
const path = require('path');
// https://vitejs.dev/config/
export default defineConfig(({ mode }): any => {
  const env = loadEnv(mode, process.cwd(), "NODE_ENV")
  // console.log(env.NODE_ENV,'NODE_ENV')
  return {
    base: env.NODE_ENV == "development" ? "/" : "/dataManage/",
    server: {
      hmr: true,
      proxy: {
        '/atlasApi': {
          target: 'http://192.168.4.180:8089/atlasApi/',
          changeOrigin: true,
          rewrite: path => {
            return path.replace(/^\/atlasApi/, '/')
          }
        },
        '/api': {
          target: 'http://192.168.4.180:8089',
          changeOrigin: true,
          rewrite: path => {
            return path.replace(/^\/api/, '/api')
          }
        },
      },
    },
    resolve: {
      // 配置路径别名
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    plugins: [
      vue(),
      // 按需引入
      Components({
        dts: true,
        // dirs: ['src'], //自定义组件 按需加载的文件夹 默认src/components
        resolvers: [
          ViewUiResolver() // ViewUi按需加载
        ]
      }),/*配置完成后， ViewU组件和项目中src/components目录(可以通过dirs配置项修改目录)下的组件都可以直接使用，无需写import语句了.*/
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),//gzip压缩
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),//打包分析
      PkgConfig(),//依赖预构建
      OptimizationPersist(),//依赖预构建 
      legacyPlugin({
        targets: ['chrome 52'], // 需要兼容的目标列表，可以设置多个
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'] // 面向IE11时需要此插件
      }),
      viteImagemin({
        gifsicle: {
          optimizationLevel: 7,
          interlaced: false
        },
        optipng: {
          optimizationLevel: 7
        },
        mozjpeg: {
          quality: 20
        },
        pngquant: {
          quality: [0.8, 0.9],
          speed: 4
        },
        svgo: {
          plugins: [
            {
              name: 'removeViewBox'
            },
            {
              name: 'removeEmptyAttrs',
              active: false
            }
          ]
        }
      }),
    ],
    build: {
      terserOptions: {
        // 生产环境移除console
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]',
          // manualChunks: {
          //   lodash: ['lodash'],
          //   echarts: ['echarts'],
          //   G6: ["@antv/g6"]
          // },
          //超大静态资源拆分
          manualChunks(id) {
            if (id.includes('node_modules')) {
              return id.toString().split('node_modules/')[1].split('/')[0].toString();
            }
          }
        }
      }
    },
  }
})
