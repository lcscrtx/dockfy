import fs from 'fs';
import path from 'path';

const iconMap = {
    'LayoutDashboard': 'Squares2X2Icon',
    'LayoutList': 'QueueListIcon',
    'Kanban': 'ViewColumnsIcon',
    'FolderOpen': 'FolderOpenIcon',
    'UserCircle2': 'UserCircleIcon',
    'Home': 'HomeIcon',
    'DollarSign': 'CurrencyDollarIcon',
    'FileCode': 'CodeBracketSquareIcon',
    'LogOut': 'ArrowRightOnRectangleIcon',
    'Plus': 'PlusIcon',
    'ChevronLeft': 'ChevronLeftIcon',
    'Menu': 'Bars3Icon',
    'Mail': 'EnvelopeIcon',
    'Lock': 'LockClosedIcon',
    'ArrowRight': 'ArrowRightIcon',
    'Loader2': 'ArrowPathIcon',
    'ChevronRight': 'ChevronRightIcon',
    'CheckCircle2': 'CheckCircleIcon',
    'ChevronDown': 'ChevronDownIcon',
    'X': 'XMarkIcon',
    'Search': 'MagnifyingGlassIcon',
    'SearchIcon': 'MagnifyingGlassIcon',
    'Upload': 'ArrowUpTrayIcon',
    'Trash2': 'TrashIcon',
    'Edit2': 'PencilSquareIcon',
    'Edit': 'PencilIcon',
    'Eye': 'EyeIcon',
    'FileText': 'DocumentTextIcon',
    'Download': 'ArrowDownTrayIcon',
    'Filter': 'FunnelIcon',
    'MoreHorizontal': 'EllipsisHorizontalIcon',
    'MoreVertical': 'EllipsisVerticalIcon',
    'Calendar': 'CalendarIcon',
    'MapPin': 'MapPinIcon',
    'Building2': 'BuildingOffice2Icon',
    'Link': 'LinkIcon',
    'Clock': 'ClockIcon',
    'FileSignature': 'PencilSquareIcon',
    'RefreshCw': 'ArrowPathIcon',
    'AlertCircle': 'ExclamationCircleIcon',
    'AlertTriangle': 'ExclamationTriangleIcon',
    'Phone': 'PhoneIcon',
    'Briefcase': 'BriefcaseIcon',
    'Check': 'CheckIcon',
    'Bell': 'BellIcon',
    'Settings': 'Cog6ToothIcon',
    'Users': 'UsersIcon',
    'Building': 'BuildingOfficeIcon',
    'ListTodo': 'ClipboardDocumentListIcon',
    'UserPlus': 'UserPlusIcon',
    'UploadCloud': 'CloudArrowUpIcon',
    'Save': 'CheckIcon',
    'ArrowUpRight': 'ArrowUpRightIcon'
};

const walk = (dir) => {
    fs.readdirSync(dir).forEach(file => {
        const f = path.join(dir, file);
        if (fs.statSync(f).isDirectory()) {
            walk(f);
        } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
            let content = fs.readFileSync(f, 'utf8');
            if (content.includes('lucide-react')) {
                console.log('Replacing in', f);
                content = content.replace(/["']lucide-react["']/g, '"@heroicons/react/24/outline"');

                Object.keys(iconMap).forEach(key => {
                    const regex = new RegExp(`\\b${key}\\b`, 'g');
                    content = content.replace(regex, iconMap[key]);
                });
                fs.writeFileSync(f, content);
            }
        }
    });
};

walk('/Users/macminiwfbd02/Desktop/dockfy/frontend/src');
