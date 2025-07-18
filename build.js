const fs = require('fs');
const path = require('path');

// Build script for the Chrome extension
console.log('🏋️‍♂️ Building Gym WhatsApp Extension...');

// Create build directory
const buildDir = './build';
if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
}

// Copy necessary files to build directory
const filesToCopy = [
    { src: './src/content.js', dest: './build/content.js' },
    { src: './src/service-worker.js', dest: './build/service-worker.js' },
    { src: './src/landing.html', dest: './build/landing.html' },
    { src: './manifest-updated.json', dest: './build/manifest.json' },
    { src: './images', dest: './build/images' },
    { src: './audio', dest: './build/audio' },
    { src: './_locales', dest: './build/_locales' }
];

function copyRecursive(src, dest) {
    if (fs.statSync(src).isDirectory()) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        const files = fs.readdirSync(src);
        files.forEach(file => {
            copyRecursive(path.join(src, file), path.join(dest, file));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

filesToCopy.forEach(file => {
    if (fs.existsSync(file.src)) {
        console.log(`📁 Copying ${file.src} to ${file.dest}`);
        copyRecursive(file.src, file.dest);
    } else {
        console.log(`⚠️  Warning: ${file.src} not found, skipping...`);
    }
});

console.log('✅ Build completed! Extension ready in ./build directory');
console.log('');
console.log('📦 To package for distribution:');
console.log('1. Zip the ./build folder contents');
console.log('2. Upload to Chrome Web Store or load as unpacked extension');
console.log('');
console.log('🔑 Demo key: DEMO-KEY-2025');