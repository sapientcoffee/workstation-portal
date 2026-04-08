// scripts/check-css.js
import fs from 'fs';

const cssPath = 'apps/web/src/index.css';
const cssContent = fs.readFileSync(cssPath, 'utf8');

const requiredClasses = ['.modal-backdrop', '.modal-content', '.btn-danger'];
let missing = false;

requiredClasses.forEach(cls => {
    if (!cssContent.includes(cls)) {
        console.error(`FAIL: Missing CSS class ${cls} in ${cssPath}`);
        missing = true;
    }
});

if (missing) {
    process.exit(1);
} else {
    console.log('PASS: All required modal CSS classes are present.');
}
