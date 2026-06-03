import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = path.join(process.cwd(), 'public', 'images');

fs.readdir(directoryPath, (err, files) => {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    
    files.forEach(file => {
        const ext = path.extname(file).toLowerCase();
        // Convert .png and .jpg/.jpeg to .webp
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
            const filePath = path.join(directoryPath, file);
            const outputFilePath = path.join(directoryPath, `${path.basename(file, ext)}.webp`);

            // Don't overwrite Profile.jpeg but create a WebP version
            sharp(filePath)
                .webp({ quality: 80 })
                .toFile(outputFilePath)
                .then(info => {
                    console.log(`Converted ${file} to WebP. Size: ${info.size} bytes`);
                })
                .catch(err => {
                    console.error(`Error converting ${file}:`, err);
                });
        }
    });
});
