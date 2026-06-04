import fs from 'fs';

let content = fs.readFileSync('src/config.ts', 'utf8');

// The CFMARC Business Connect regex
const cfmarcRegex = /(\{\s*id:\s*7,\s*title:\s*"CFMARC Business Connect"[\s\S]*?liveUrl:\s*""[\s\S]*?video:\s*""\s*\},\s*)/;

const match = content.match(cfmarcRegex);

if (match) {
    // Remove from current position
    content = content.replace(cfmarcRegex, '');

    // Replace liveUrl
    let projectStr = match[1].replace('liveUrl: ""', 'liveUrl: "https://rahul20s.github.io/CFMARC/"');

    // Insert right after CFMARC OCR System
    const insertAfter = 'video: "/video/cfmarc-ocr.mp4"\n        },\n';
    
    content = content.replace(insertAfter, `${insertAfter}        ${projectStr}`);
    
    fs.writeFileSync('src/config.ts', content, 'utf8');
    console.log('Successfully moved CFMARC Business Connect and added liveUrl');
} else {
    console.log('Could not find CFMARC Business Connect block');
}
