import fs from 'fs';

let content = fs.readFileSync('src/config.ts', 'utf8');

// Function to convert title to GitHub repo format (approximate)
function getRepoUrl(title) {
    const formatted = title.replace(/\s+/g, '-');
    return `https://github.com/Rahul20s/${formatted}`;
}

// Find all projects
const regex = /(title:\s*"(.*?)"[\s\S]*?githubUrl:\s*)""/g;

content = content.replace(regex, (match, p1, p2) => {
    return `${p1}"${getRepoUrl(p2)}"`;
});

fs.writeFileSync('src/config.ts', content, 'utf8');
console.log('Added GitHub links to all projects.');
