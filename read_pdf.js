const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('MrRobinOfficial_Guide-UnrealEngine_ This repository is designed to help developers learn how to get started with Unreal Engine and C++..pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('pdf_content.txt', data.text);
    console.log('Done!');
}).catch(console.error);
