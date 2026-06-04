import fs from 'fs';

let content = fs.readFileSync('src/config.ts', 'utf8');

// The objects end with `description: "..."` followed by `\n        }` or `\n        },`
content = content.replace(/(description: ".*?")/g, '$1,\n            githubUrl: "",\n            liveUrl: "",\n            video: ""');

fs.writeFileSync('src/config.ts', content, 'utf8');
console.log('Added githubUrl, liveUrl, and video fields to config.ts');
