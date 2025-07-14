import { execSync } from 'child_process';
import fs from 'fs';

try {
  console.log('Starting build process...');
  
  // Run vite build first
  execSync('npx vite build', { stdio: 'inherit' });
  
  // Check if build succeeded
  if (fs.existsSync('dist/public/index.html')) {
    console.log('✅ Frontend build successful');
  }
  
  // Run server build
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --outfile=dist/index.js', { stdio: 'inherit' });
  
  if (fs.existsSync('dist/index.js')) {
    console.log('✅ Backend build successful');
  }
  
  console.log('✅ Build completed successfully');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}