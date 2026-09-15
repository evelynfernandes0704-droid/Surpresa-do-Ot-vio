import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

function uploadMuralPlugin() {
  return {
    name: 'upload-mural-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/upload-mural', (req: any, res: any) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk: any) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body);
              const base64Data = data.image.replace(/^data:image\/\w+;base64,/, '');
              const buffer = Buffer.from(base64Data, 'base64');
              const publicDir = path.resolve(process.cwd(), 'public');
              if (!fs.existsSync(publicDir)) {
                fs.mkdirSync(publicDir, { recursive: true });
              }
              const targetPath = path.join(publicDir, 'mural_otavio.jpg');
              fs.writeFileSync(targetPath, buffer);

              const srcDataDir = path.resolve(process.cwd(), 'src', 'data');
              if (!fs.existsSync(srcDataDir)) {
                fs.mkdirSync(srcDataDir, { recursive: true });
              }
              const tsPath = path.join(srcDataDir, 'muralDataUri.ts');
              fs.writeFileSync(tsPath, `export const MURAL_BASE64 = "data:image/jpeg;base64,${base64Data}";\n`);
              
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, message: 'Foto salva com sucesso!' }));
            } catch (err: any) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: err?.message || 'Erro ao salvar' }));
            }
          });
        } else {
          res.writeHead(405);
          res.end();
        }
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), uploadMuralPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
