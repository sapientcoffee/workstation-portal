// scripts/verify-frontend.js
import { execSync } from 'child_process';
import fs from 'fs';

try {
    const appContent = fs.readFileSync('src/App.jsx', 'utf8');
    
    if (!appContent.includes('Trash2')) {
        console.error('FAIL: src/App.jsx does not import or use Trash2.');
        process.exit(1);
    }
    
    if (!appContent.includes('modal-backdrop')) {
        console.error('FAIL: src/App.jsx does not implement the modal structure.');
        process.exit(1);
    }
    
    // Attempt to lint
    console.log('Running linter...');
    execSync('npm run lint', { stdio: 'inherit' });

    // Attempt to build
    console.log('Running build check...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('PASS: Frontend code builds successfully.');
} catch (error) {
    console.error('FAIL: Frontend verification failed.', error.message);
    process.exit(1);
}
