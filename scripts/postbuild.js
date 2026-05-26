import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';

async function optimizeImages() {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const distDir = path.join(process.cwd(), 'dist');

  async function processDirectory(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath);
      } else if (imageExtensions.includes(path.extname(entry.name).toLowerCase())) {
        try {
          const optimizedImage = await sharp(fullPath)
            .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 80 })
            .toBuffer();

          await fs.writeFile(fullPath, optimizedImage);
          console.log(`Optimized: ${fullPath}`);
        } catch (error) {
          console.error(`Error optimizing ${fullPath}:`, error);
        }
      }
    }
  }

  await processDirectory(distDir);
}

async function run() {
  console.log('Running post-build optimizations...');
  await optimizeImages();
  console.log('Post-build optimizations complete!');
}

run().catch(console.error);