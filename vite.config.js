import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import crypto from 'crypto';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const imageKitPrivateKey = env.IMAGEKIT_PRIVATE_KEY;
  const imageKitPublicKey = env.VITE_IMAGEKIT_PUBLIC_KEY || env.IMAGEKIT_PUBLIC_KEY;

  return {
    plugins: [
      react(),
      {
        name: 'imagekit-auth-dev-endpoint',
        configureServer(server) {
          server.middlewares.use('/api/imagekit-auth', (req, res) => {
            if (req.method !== 'GET') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            if (!imageKitPrivateKey || !imageKitPublicKey) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error:
                    'Missing IMAGEKIT_PRIVATE_KEY or VITE_IMAGEKIT_PUBLIC_KEY/IMAGEKIT_PUBLIC_KEY in environment.'
                })
              );
              return;
            }

            const token = crypto.randomBytes(16).toString('hex');
            const expire = Math.floor(Date.now() / 1000) + 30 * 60;
            const signature = crypto
              .createHmac('sha1', imageKitPrivateKey)
              .update(token + expire)
              .digest('hex');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                token,
                expire,
                signature,
                publicKey: imageKitPublicKey
              })
            );
          });
        }
      }
    ],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') }
    }
  };
});
