import React, { useContext, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Utensils, Home, BookOpen, Info, Phone, User, LayoutDashboard } from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';

export default function Header() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const { user, token, logout } = useContext(AuthContext);
    const isShowDashboard = user?.role === 'admin' || user?.role === 'superadmin';


    const navLinks = [
        { name: 'Home', path: '/', icon: <Home size={18} /> },
        { name: 'About', path: '/about', icon: <Info size={18} /> },
        { name: 'Contact', path: '/contact', icon: <Phone size={18} /> },
    ];

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
        setIsOpen(false);
    }

    return (
        <header className="sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto px-4 bg-white/90 backdrop-blur-md rounded-b-xl sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-amber-600 rounded-lg text-white group-hover:bg-amber-700 transition-colors">
                            <Utensils size={24} />
                        </div>
                        <span className="text-xl font-bold text-slate-900 tracking-tight">Restaurant</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-5">
                        {navLinks.map((link) => (
                            <NavLink key={link.name} to={link.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-amber-600 ${isActive ? 'text-amber-600' : 'text-slate-600'
                                    }`
                                }
                            >
                                {link.icon}
                                {link.name}
                            </NavLink>
                        ))}
                        {(user || token) && (
                            <Link to={isShowDashboard ? '/dashboard' : '/profile'} className='p-2.5 border border-gray-200 hover:bg-[#fcfaf7] rounded-full group'>
                                {isShowDashboard ? <LayoutDashboard size={18} className='group-hover:text-amber-600' /> : <User size={18} className='group-hover:text-amber-600' />}
                            </Link>
                        )}
                        {(user || token) ?
                            <button onClick={handleLogout} className="w-full text-center bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                                LogOut
                            </button> :
                            <Link to='/login' className="bg-amber-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                                Staff Login
                            </Link>
                        }
                    </nav>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-slate-600 p-2 hover:bg-slate-100 hover:cursor-pointer rounded-md transition-colors"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            <div className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <aside
                className={`fixed top-0 left-0 z-50 h-full w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <Link to="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                            <div className="p-1.5 bg-amber-600 rounded-lg text-white">
                                <Utensils size={20} />
                            </div>
                            <span className="font-bold text-slate-900">Restaurant</span>
                        </Link>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 text-slate-500 hover:cursor-pointer hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex-grow py-6 px-4 space-y-2 overflow-y-auto">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-4 py-3 group rounded-xl text-md font-medium transition-all ${isActive
                                        ? 'bg-amber-600 text-white shadow-md shadow-amber-200'
                                        : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-600'}>
                                            {link.icon}
                                        </span>
                                        {link.name}
                                    </>
                                )}
                            </NavLink>
                        ))}
                        {(user || token) &&
                            <NavLink to={(isShowDashboard) ? '/dashboard' : '/profile'} onClick={() => setIsOpen(false)} className={({ isActive }) => `flex gap-4 px-4 py-3 group rounded-xl text-md items-center font-medium transition-all ${isActive
                                ? 'bg-amber-600 text-white shadow-md'
                                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-600'
                                }`
                            }>
                                {({ isActive }) => (
                                    <>
                                        <span className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-amber-600'}>
                                            {isShowDashboard ? <LayoutDashboard size={18} /> : <User size={18} />}
                                        </span>
                                        {isShowDashboard ? 'Dashboard' : 'Profile'}
                                    </>
                                )}
                            </NavLink>
                        }
                        <div className="p-4 border-t border-gray-200">
                            {(user || token) ?
                                <button onClick={handleLogout} className="w-full text-center bg-amber-600 text-white px-5 py-3.5 rounded-full text-sm font-semibold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                                    LogOut
                                </button> :
                                <Link to='/login' onClick={() => setIsOpen(false)} className="block text-center bg-amber-600 text-white px-5 py-3.5 rounded-full text-sm font-semibold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                                    Staff Login
                                </Link>
                            }
                        </div>
                    </nav>
                </div>
            </aside>
        </header>
    );
}
