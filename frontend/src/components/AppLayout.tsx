import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  Home,
  LayoutGrid,
  FileText,
  BookText,
  Link2,
  Users,
  Building2,
  BarChart3,
  Search,
  Bell,
  LogOut,
  User,
  UserRound,
  Menu,
  X,
  ChevronRight,
  Settings,
  Sparkles,
} from "lucide-react";

const navGroups = [
  {
    title: "Visão Geral",
    items: [
      { to: "/", label: "Dashboard", icon: Home },
      { to: "/board", label: "Board", icon: LayoutGrid },
    ],
  },
  {
    title: "Documentos",
    items: [
      { to: "/templates", label: "Templates", icon: FileText },
      { to: "/meus-modelos", label: "Meus Modelos", icon: Link2 },
      { to: "/clausulas", label: "Cláusulas", icon: BookText },
      { to: "/pessoas", label: "Pessoas", icon: Users },
      { to: "/imoveis", label: "Imóveis", icon: Building2 },
    ],
  },
  {
    title: "Financeiro",
    items: [{ to: "/financeiro", label: "Recebimentos", icon: BarChart3 }],
  },
  {
    title: "Conta",
    items: [
      { to: "/elia-beta", label: "elia (beta)", icon: Sparkles },
      { to: "/perfil", label: "Meu Perfil", icon: UserRound },
    ],
  },
];

interface AppLayoutProps {
  children: ReactNode;
}

function getRouteMeta(pathname: string) {
  if (pathname === "/") return { section: "Overview", title: "Dashboard" };
  if (pathname === "/board") return { section: "Overview", title: "Board" };
  if (pathname === "/templates")
    return { section: "Documentos", title: "Templates" };
  if (pathname === "/meus-modelos")
    return { section: "Documentos", title: "Meus Modelos" };
  if (pathname === "/clausulas")
    return { section: "Documentos", title: "Cláusulas" };
  if (pathname === "/pessoas")
    return { section: "Cadastros", title: "Pessoas" };
  if (pathname === "/imoveis")
    return { section: "Cadastros", title: "Imóveis" };
  if (pathname === "/financeiro")
    return { section: "Financeiro", title: "Recebimentos" };
  if (pathname === "/perfil")
    return { section: "Conta", title: "Meu Perfil" };
  if (pathname === "/elia-beta")
    return { section: "Assistente", title: "elia (beta)" };
  if (pathname.startsWith("/wizard"))
    return { section: "Documentos", title: "Wizard" };
  if (pathname.startsWith("/document/"))
    return { section: "Documentos", title: "Detalhes" };
  return { section: "Workspace", title: "Elia" };
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const routeMeta = useMemo(
    () => getRouteMeta(location.pathname),
    [location.pathname],
  );

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  const metadata = (user?.user_metadata ?? {}) as {
    full_name?: string;
    avatar_url?: string;
  };

  const displayName = metadata.full_name?.trim()
    ? metadata.full_name.trim()
    : user?.email
    ? user.email
        .split("@")[0]
        .replace(/[._]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
    : "Usuário";
  const avatarUrl = metadata.avatar_url || "";

  return (
    <div className="relative min-h-screen bg-canvas text-text-primary">
      {mobileNavOpen && (
        <button
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          aria-label="Fechar navegação"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-[260px] bg-[#F1F3F7] border-r border-base flex flex-col transition-transform duration-200 lg:translate-x-0 ${mobileNavOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
            <div className="h-16 px-4 flex items-center border-b border-base relative">
              <img
                src="/logo-elia.svg"
                alt="elia"
                className="w-[104px] h-auto max-w-full"
              />
              <button
                onClick={() => setMobileNavOpen(false)}
                className="lg:hidden btn-icon absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Fechar menu"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-3 py-3 border-b border-base">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary"
                />
                <input
                  type="text"
                  placeholder="Search anything"
                  className="input-base h-9 pl-9 pr-8 text-[13px] bg-white/90"
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-text-tertiary border border-base rounded px-1 py-0.5 bg-[var(--color-surface-subtle)]">
                  ⌘ K
                </span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
              {navGroups.map((group) => (
                <div key={group.title}>
                  <h3 className="text-[10px] font-semibold uppercase tracking-widest text-text-tertiary px-2 mb-2">
                    {group.title}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === "/"}
                        onClick={() => setMobileNavOpen(false)}
                        className={({ isActive }) => {
                          const base =
                            "h-9 rounded-[10px] px-2.5 flex items-center gap-2.5 text-[13px] font-medium border transition-all";
                          return isActive
                            ? `${base} bg-white text-text-primary border-[#D7DEEA] shadow-low`
                            : `${base} border-transparent text-[#5F6D87] hover:text-text-primary hover:bg-white/75`;
                        }}
                      >
                        <item.icon size={15} className="shrink-0" />
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="p-3 border-t border-base">
              <div className="rounded-[10px] border border-base bg-white p-2.5 flex items-center gap-2.5">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-8 h-8 rounded-full border border-[#D9E6FF] object-cover bg-[#EEF3FF]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#EEF3FF] border border-[#D9E6FF] flex items-center justify-center text-[#2E4F8A]">
                    <User size={16} />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-text-primary truncate">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-text-tertiary truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary mt-2 w-full h-9 text-[13px] shadow-none"
              >
                <LogOut size={14} />
                Sair da conta
              </button>
            </div>
      </aside>

      <div className="min-h-screen bg-[#F8F9FB] lg:ml-[260px] flex flex-col">
        <header className="fixed top-0 left-0 right-0 lg:left-[260px] h-14 sm:h-16 border-b border-base bg-[#F8F9FB]/95 backdrop-blur px-3 sm:px-5 lg:px-7 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden btn-icon"
              aria-label="Abrir menu"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs sm:text-[13px] font-medium text-text-tertiary truncate">
                {routeMeta.section}
              </span>
              <ChevronRight size={14} className="text-text-tertiary/80 shrink-0" />
              <span className="text-xs sm:text-[13px] font-semibold text-text-primary truncate">
                {routeMeta.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button className="btn-icon">
              <Bell size={16} />
            </button>
            <button className="btn-icon">
              <Settings size={16} />
            </button>
            <div className="hidden sm:flex items-center gap-2 rounded-[10px] border border-base bg-white px-2.5 py-1.5">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-6 h-6 rounded-full border border-[#D9E6FF] object-cover bg-[#EEF3FF]"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-[#EEF3FF] border border-[#D9E6FF] flex items-center justify-center text-[#2E4F8A]">
                  <User size={13} />
                </div>
              )}
              <span className="text-[12px] font-semibold text-text-secondary max-w-[130px] truncate">
                {displayName}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 pt-14 sm:pt-16">{children}</main>
      </div>
    </div>
  );
}
