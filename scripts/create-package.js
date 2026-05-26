import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { createGzip } from 'zlib';
import archiver from 'archiver';

const execAsync = promisify(exec);

async function createDeploymentPackage() {
  try {
    console.log('Creating deployment package...');

    // 1. Build the project
    console.log('Building project...');
    await execAsync('npm run build');

    // 2. Create dist folder if it doesn't exist
    const distPath = join(process.cwd(), 'dist');
    await fs.mkdir(distPath, { recursive: true });

    // 3. Create deployment package
    const output = createWriteStream(join(process.cwd(), 'deployment.zip'));
    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', () => {
      console.log(`Deployment package created (${archive.pointer()} bytes)`);
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    // Add dist folder
    archive.directory('dist/', 'dist');

    // Add server files
    archive.file('server.js', { name: 'server.js' });
    archive.file('package.json', { name: 'package.json' });

    // Add readme with deployment instructions
    const readmeContent = `# Deployment Instructions

1. Extract the deployment package
2. Install dependencies:
   \`\`\`bash
   npm install --production
   \`\`\`
3. Start the server:
   \`\`\`bash
   node server.js
   \`\`\`

The server will start on port 3000 by default.
You can change the port by setting the PORT environment variable.

## Environment Variables

- PORT: Server port (default: 3000)

## Features

- Optimized static file serving
- Gzip compression
- Long-term caching
- Client-side routing support
- Image optimization
`;

    archive.append(readmeContent, { name: 'README.md' });

    await archive.finalize();

  } catch (error) {
    console.error('Error creating deployment package:', error);
    process.exit(1);
  }
}

createDeploymentPackage();