import React, { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Utensils,
    ChevronRight,
    ShoppingBag,
    ClipboardList,
    ShieldCheck,
    Home,
    Edit,
    ChefHat,
    Table,
    Carrot,
} from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';

const DashboardLayout = () => {
    const { user, logout } = useContext(AuthContext);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminLinks = [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Table Management', path: '/dashboard/tables', icon: <Table size={20} /> },
        { name: 'Menu Categories', path: '/dashboard/menu-categories', icon: <Utensils size={20} /> },
        { name: 'Ingredients', path: '/dashboard/ingredients', icon: <Carrot size={20} /> },
        { name: 'Menu Items', path: '/dashboard/menu-items', icon: <ShoppingBag size={20} /> },
        { name: 'Orders', path: '/dashboard/orders', icon: <ClipboardList size={20} /> },
        { name: 'Kitchen', path: '/dashboard/kitchen', icon: <ChefHat size={20} /> },
        { name: 'Home', path: '/', icon: <Home size={20} /> },
    ];

    const superAdminLinks = [
        { name: 'Super Dashboard', path: '/dashboard', icon: <ShieldCheck size={20} /> },
        { name: 'Branches', path: '/dashboard/branches', icon: <Utensils size={20} /> },
        { name: 'Admins', path: '/dashboard/admins', icon: <Users size={20} /> },
        { name: 'SQL Editor', path: '/dashboard/sql-editor', icon: <Edit size={20} /> },
        { name: 'Home', path: '/', icon: <Home size={20} /> },
    ];

    const links = user?.role === 'superadmin' ? superAdminLinks : adminLinks;

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden selection:bg-amber-100 selection:text-amber-800">
            {!isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                />
            )}

            <aside
                className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 ${isSidebarOpen ? '-translate-x-full' : 'translate-x-0'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-amber-600 rounded-lg text-white">
                                <Utensils size={20} />
                            </div>
                            <span className="font-bold text-slate-900 text-lg">Admin Panel</span>
                        </div>
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:cursor-pointer hover:text-black hover:bg-slate-100 rounded-lg"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
                        <div className="px-2 mb-4">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Main Navigation</p>
                        </div>
                        {links.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                end={link.path === '/dashboard'}
                                onClick={() => setIsSidebarOpen(true)}
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${isActive
                                        ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                                        : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                                    }`
                                }
                            >
                                <div className="flex items-center gap-3">
                                    {link.icon}
                                    <span className="font-medium">{link.name}</span>
                                </div>
                                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                            </NavLink>
                        ))}
                    </nav>

                    <div className="p-4 border-t border-slate-100">
                        <div className="flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-slate-100/50">
                            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold uppercase">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-xs text-slate-500 truncate capitalize">{user?.role}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex hover:cursor-pointer items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
                    <button
                        className="p-2 text-slate-600 hover:cursor-pointer hover:bg-slate-100 rounded-lg lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="h-9 w-9 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto scrollbar-hidden">
                    <div className="p-2 lg:p-4">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
