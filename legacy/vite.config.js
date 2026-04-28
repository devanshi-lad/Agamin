import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        market: resolve(__dirname, 'market.html'),
        ecosystem: resolve(__dirname, 'ecosystem.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
        bitcoin: resolve(__dirname, 'bitcoin.html'),
        learn: resolve(__dirname, 'learn.html'),
        nfts: resolve(__dirname, 'nfts.html'),
        exchanges: resolve(__dirname, 'exchanges.html')
      }
    }
  }
});
