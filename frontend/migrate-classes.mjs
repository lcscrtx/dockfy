import fs from 'fs';
import path from 'path';

const replaceMap = [
    // Cards
    { regex: /bg-white\s+rounded-(?:xl|2xl|lg)\s+shadow-(?:sm|md)\s+border\s+border-slate-[0-9]{3}/g, replacement: 'card-base' },
    { regex: /bg-white\s+border\s+border-slate-[0-9]{3}\s+rounded-(?:xl|2xl|lg)\s+shadow-(?:sm|md)/g, replacement: 'card-base' },

    // Colors & Text
    { regex: /text-slate-900/g, replacement: 'text-text-primary' },
    { regex: /text-slate-800/g, replacement: 'text-text-primary' },
    { regex: /text-slate-700/g, replacement: 'text-text-secondary' },
    { regex: /text-slate-600/g, replacement: 'text-text-secondary' },
    { regex: /text-slate-500/g, replacement: 'text-text-tertiary' },
    { regex: /text-slate-400/g, replacement: 'text-text-tertiary' },

    // Borders
    { regex: /border-slate-[0-9]{3}/g, replacement: 'border-base' },
    { regex: /border-t-slate-[0-9]{3}/g, replacement: 'border-t-base' },
    { regex: /border-b-slate-[0-9]{3}/g, replacement: 'border-b-base' },
    { regex: /border-l-slate-[0-9]{3}/g, replacement: 'border-l-base' },
    { regex: /border-r-slate-[0-9]{3}/g, replacement: 'border-r-base' },
    { regex: /divide-slate-[0-9]{3}/g, replacement: 'divide-base' },

    // Backgrounds
    { regex: /bg-slate-50/g, replacement: 'bg-white' },
    { regex: /bg-slate-100/g, replacement: 'bg-black/5' },
    { regex: /bg-slate-200/g, replacement: 'bg-black/10' },
    { regex: /bg-slate-900/g, replacement: 'bg-primary-500' },
    { regex: /hover:bg-slate-50/g, replacement: 'hover:bg-black/5' },
    { regex: /hover:bg-slate-100/g, replacement: 'hover:bg-black/10' },

    // Border radius constraints (design system max is 8px/12px)
    { regex: /rounded-2xl/g, replacement: 'rounded-lg' },
    { regex: /rounded-xl/g, replacement: 'rounded-lg' },

    // Font Weights
    // Inter shouldn't use extra-bold or similar mismatching weights
    { regex: /font-bold/g, replacement: 'font-semibold' },

    // Shadows
    { regex: /shadow-sm/g, replacement: 'shadow-low' },
    { regex: /shadow-md/g, replacement: 'shadow-mid' },
    { regex: /shadow-lg/g, replacement: 'shadow-high' },

    // Unmapped Icons fixes
    { regex: /FileCheck/g, replacement: 'DocumentCheckIcon' },
    { regex: /FilePlus/g, replacement: 'DocumentPlusIcon' }
];

const walk = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const f = path.join(dir, file);
        if (fs.statSync(f).isDirectory()) {
            walk(f);
        } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
            // Don't modify AppLayout.tsx and Login.tsx since we did it manually
            if (f.includes('AppLayout.tsx') || f.includes('Login.tsx') || f.includes('index.css')) return;

            let content = fs.readFileSync(f, 'utf8');
            let changed = false;

            replaceMap.forEach(({ regex, replacement }) => {
                if (regex.test(content)) {
                    content = content.replace(regex, replacement);
                    changed = true;
                }
            });

            if (changed) {
                console.log('Processed classes in', f);
                fs.writeFileSync(f, content);
            }
        }
    });
};

walk('/Users/macminiwfbd02/Desktop/dockfy/frontend/src');
