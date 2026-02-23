import fs from 'fs';
import path from 'path';

const iconMap = {
  'Wallet': 'WalletIcon',
  'DocumentCheckIcon2': 'DocumentCheckIcon',
  'Handshake': 'UsersIcon',
  'GripVertical': 'Bars2Icon',
  'Edit3': 'PencilSquareIcon',
  'Code': 'CodeBracketIcon',
  'Printer': 'PrinterIcon',
  'ArrowLeft': 'ArrowLeftIcon',
  'Copy': 'DocumentDuplicateIcon',
  'History': 'ClockIcon',
  'RefreshCcw': 'ArrowPathIcon',
  'ArrowRightLeft': 'ArrowsRightLeftIcon',
  'Pencil': 'PencilIcon',
  'Key': 'KeyIcon',
  'ShoppingBag': 'ShoppingBagIcon',
  'User': 'UserIcon'
};

const walk = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const f = path.join(dir, file);
    if (fs.statSync(f).isDirectory()) {
      walk(f);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      let content = fs.readFileSync(f, 'utf8');
      
      let changed = false;
      Object.keys(iconMap).forEach(key => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        if (regex.test(content)) {
          content = content.replace(regex, iconMap[key]);
          changed = true;
        }
      });
      
      if (changed) {
        console.log('Fixed missing icons in', f);
        fs.writeFileSync(f, content);
      }
    }
  });
};

walk('/Users/macminiwfbd02/Desktop/dockfy/frontend/src');
