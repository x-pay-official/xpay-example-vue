#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting X-Pay SDK Vue Example...');

// Check if node_modules exists, if not run npm install
if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
  console.log('Installing dependencies...');
  const install = spawn('npm', ['install'], { stdio: 'inherit', shell: true });
  
  install.on('close', code => {
    if (code !== 0) {
      console.error('Failed to install dependencies');
      process.exit(1);
    }
    startDevServer();
  });
} else {
  startDevServer();
}

function startDevServer() {
  console.log('Starting development server...');
  console.log('Once started, open your browser to: http://localhost:3000');
  
  const dev = spawn('npm', ['run', 'dev'], { stdio: 'inherit', shell: true });
  
  dev.on('close', code => {
    if (code !== 0) {
      console.error('Development server stopped with code:', code);
    }
  });
}