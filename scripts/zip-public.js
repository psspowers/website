import { promises as fs } from 'fs';
import path from 'path';
import { createWriteStream } from 'fs';
import archiver from 'archiver';

async function zipPublicDirectory() {
  try {
    console.log('Creating zip archive of the public directory...');

    const outputFileName = 'public_files.zip';
    const outputPath = path.join(process.cwd(), outputFileName);
    const output = createWriteStream(outputPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Set compression level
    });

    output.on('close', () => {
      console.log(`Successfully created ${outputFileName} (${archive.pointer()} bytes)`);
      console.log('You can now download this file.');
    });

    archive.on('error', (err) => {
      throw err;
    });

    archive.pipe(output);

    // Append the 'public' directory
    archive.directory('public/', 'public');

    await archive.finalize();

  } catch (error) {
    console.error('Error creating public directory zip:', error);
    process.exit(1);
  }
}

zipPublicDirectory();
