const fs = require('fs');
const path = './src/Source/TrainingCore/core/Curriculum.ts';
let content = fs.readFileSync(path, 'utf8');

// The simplest way is to iterate over each task using regex or parsing,
// but since we know the structure, we can fix it.
// Wait, we can just look for `    title: '...` which is inside `exampleSolutions` (indent 8 spaces) vs `  title: '...` which is inside the main task (indent 4 spaces).

let taskCounter = 1;

content = content.split('\n').map(line => {
  if (line.startsWith("    title: '")) {
    // This is a main task title
    // It currently might look like `    title: '43. TSubclassOf — Class References',`
    // Wait, the indent is 4 spaces! `    title: `
    return line.replace(/title:\s*'(\d+\.\s*)?(.*)'/, "title: '" + (taskCounter++) + ". $2'");
  }
  if (line.startsWith("        title: '")) {
    // This is an example solution title (8 spaces)
    return line.replace(/title:\s*'(\d+\.\s*)?(.*)'/, "title: '$2'");
  }
  return line;
}).join('\n');

fs.writeFileSync(path, content, 'utf8');
console.log("Fixed titles");
