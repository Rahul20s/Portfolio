import fs from 'fs';

let content = fs.readFileSync('src/config.ts', 'utf8');

// 1. Remove the incorrectly added fields from experiences
content = content.replace(/,\s*githubUrl:\s*"",\s*liveUrl:\s*"",\s*video:\s*""\s*,\s*responsibilities/g, ',\n            responsibilities');

// 2. Add video URLs to the specific projects
content = content.replace(/(title:\s*"CFM AI Application"[\s\S]*?)video:\s*""/g, '$1video: "/video/ai-chat-app.mp4"');
content = content.replace(/(title:\s*"CFMARC OCR System"[\s\S]*?)video:\s*""/g, '$1video: "/video/cfmarc-ocr.mp4"');
content = content.replace(/(title:\s*"IntraDesk Portal"[\s\S]*?)video:\s*""/g, '$1video: "/video/intradesk.mp4"');

fs.writeFileSync('src/config.ts', content, 'utf8');
console.log('Fixed experiences and updated video URLs');
