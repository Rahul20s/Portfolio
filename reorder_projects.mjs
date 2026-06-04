import fs from 'fs';

let content = fs.readFileSync('src/config.ts', 'utf8');

// The objects are between `{` and `},` or `}`.
// Let's find IntraDesk and OCR.
const intraRegex = /(\{\s*id:\s*6,\s*title:\s*"IntraDesk Portal"[\s\S]*?video:\s*"\/video\/intradesk\.mp4"\s*\},\s*)/;
const ocrRegex = /(\{\s*id:\s*8,\s*title:\s*"CFMARC OCR System"[\s\S]*?video:\s*"\/video\/cfmarc-ocr\.mp4"\s*\},\s*)/;

const intraMatch = content.match(intraRegex);
const ocrMatch = content.match(ocrRegex);

if (intraMatch && ocrMatch) {
    // Remove them from their current positions
    content = content.replace(intraRegex, '');
    content = content.replace(ocrRegex, '');

    // Insert them right after CFM AI Application (which ends with `video: "/video/ai-chat-app.mp4"\n        },`)
    const insertAfter = 'video: "/video/ai-chat-app.mp4"\n        },\n';
    
    const replacement = `${insertAfter}        ${intraMatch[1]}        ${ocrMatch[1]}`;
    content = content.replace(insertAfter, replacement);
    
    fs.writeFileSync('src/config.ts', content, 'utf8');
    console.log('Successfully reordered projects.');
} else {
    console.log('Could not find matches');
}
