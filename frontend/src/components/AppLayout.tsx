import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
    FileText,
    LayoutDashboard,
    Kanban,
    FolderOpen,
    UserCircle2,
    Home,
    LogOut,
    Plus,
    ChevronLeft,
    Menu,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';

const navItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/board', icon: Kanban, label: 'Board' },
    { to: '/templates', icon: FolderOpen, label: 'Templates' },
    { to: '/pessoas', icon: UserCircle2, label: 'Pessoas' },
    { to: '/imoveis', icon: Home, label: 'Imóveis' },
];

export function AppLayout({ children }: { children: ReactNode }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    const initials = user?.email?.slice(0, 2).toUpperCase() || 'U';

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col z-40 transition-all duration-300 ease-in-out ${collapsed ? 'w-[68px]' : 'w-[240px]'
                    }`}
            >
                {/* Logo */}
                <div className={`h-16 flex items-center border-b border-slate-100 px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        {!collapsed && (
                            <span className="font-bold text-lg tracking-tight text-slate-900 whitespace-nowrap">
                                Dockfy
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100 flex-shrink-0 ${collapsed ? 'hidden' : ''}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                </div>

                {/* New Document CTA */}
                <div className={`px-3 pt-5 pb-2 ${collapsed ? 'px-2' : ''}`}>
                    <button
                        onClick={() => navigate('/templates')}
                        className={`w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-all active:scale-[0.97] shadow-sm ${collapsed ? 'p-2.5' : 'px-4 py-2.5'
                            }`}
                        title="Novo Documento"
                    >
                        <Plus className="w-4 h-4 flex-shrink-0" />
                        {!collapsed && <span>Novo Documento</span>}
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive
                                    ? 'bg-slate-900 text-white shadow-sm'
                                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                } ${collapsed ? 'justify-center px-2.5' : ''}`
                            }
                            title={item.label}
                        >
                            <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                            {!collapsed && <span>{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* User Section */}
                <div className={`border-t border-slate-100 p-3 ${collapsed ? 'px-2' : ''}`}>
                    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
                        <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-xs font-semibold text-slate-600 flex-shrink-0">
                            {initials}
                        </div>
                        {!collapsed && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 truncate">{user?.email}</p>
                            </div>
                        )}
                        <button
                            onClick={handleLogout}
                            className={`text-slate-400 hover:text-slate-700 transition-colors p-1.5 rounded-md hover:bg-slate-100 flex-shrink-0 ${collapsed ? 'hidden' : ''}`}
                            title="Sair"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Expand toggle when collapsed */}
                {collapsed && (
                    <div className="border-t border-slate-100 p-2">
                        <button
                            onClick={() => setCollapsed(false)}
                            className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </aside>

            {/* Main content */}
            <main
                className={`flex-1 h-screen overflow-auto transition-all duration-300 ease-in-out ${collapsed ? 'ml-[68px]' : 'ml-[240px]'
                    }`}
            >
                {children}
            </main>
        </div>
    );
}
