/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    ClipboardList,
    DollarSign,
    Clock,
    LayoutGrid,
    ChefHat,
    IndianRupee,
    X,
    TrendingUp,
    RefreshCcw
} from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState(null);
    const [recentItems, setRecentItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRevenueModelOpen, setIsRevenueModelOpen] = useState(false);
    const [isOrderModelOpen, setIsOrderModelOpen] = useState(false);
    const [revenueStats, setRevenueStats] = useState([]);
    const [revLoading, setRevLoading] = useState(false);

    const DB_URL = import.meta.env.VITE_DB_URL;

    useEffect(() => {
        if (user?.branch_id) {
            fetchDashboardData();
        }
    }, [user]);

    useEffect(() => {
        fetchRevenueStats();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const [statsRes, itemsRes] = await Promise.all([
                axios.get(`${DB_URL}/api/dashboard/${user.branch_id}`, {
                    headers: { authorization: localStorage.getItem('authorization') }
                }),
                axios.get(`${DB_URL}/api/items/branch/${user.branch_id}`, {
                    headers: { authorization: localStorage.getItem('authorization') }
                })
            ]);
            setIsLoading(false);
            setStats(statsRes.data);
            setRecentItems(itemsRes.data.slice(0, 5));
        } catch (err) {
            console.error(err);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRevenueStats = async () => {
        try {
            setRevLoading(true);
            const res = await axios.get(`${DB_URL}/api/dashboard/revenue/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setRevenueStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setRevLoading(false);
        }
    };

    const statCards = [
        { name: 'Total Revenue', value: `₹${stats?.totalRevenue || 0}`, icon: <DollarSign className="text-emerald-600" />, color: 'emerald', onClick: () => setIsRevenueModelOpen(true) },
        { name: 'Total Orders', value: stats?.totalOrders || 0, icon: <ClipboardList className="text-blue-600" />, color: 'blue', onClick: () => setIsOrderModelOpen(true) },
        { name: 'Active Tables', value: stats?.activeTables || 0, icon: <LayoutGrid className="text-amber-600" />, color: 'amber' },
        { name: 'Pending Orders', value: stats?.pendingOrders || 0, icon: <Clock className="text-rose-600" />, color: 'rose' },
    ];

    return (
        <div className="space-y-8 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Admin <span className="text-amber-600">Dashboard</span></h1>
                    <p className="text-slate-500 mt-1">Checking in on your restaurant's pulse today.</p>
                </div>

                <button
                    onClick={() => fetchDashboardData()}
                    disabled={isLoading}
                    className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                >
                    <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <div key={stat.name} onClick={stat.onClick} className={`bg-white p-6 ${stat.onClick ? 'hover:cursor-pointer' : ''} rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 hover:shadow-2xl transition-all group overflow-hidden relative`}>
                        <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 bg-${stat.color}-500 group-hover:opacity-20 transition-opacity`}></div>
                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-xs font-semibold text-slate-400 uppercase relative z-10">{stat.name}</p>
                        {isLoading ? <div className="animate-pulse h-8 w-16 bg-slate-200 rounded mt-2 relative z-10"></div> :
                            <p className="text-3xl font-bold text-slate-900 mt-1 relative z-10">{stat.value}</p>}
                    </div>
                ))}
            </div>

            {isRevenueModelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 m-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                        <div className="sm:p-8 p-4 sm:pb-6 pb-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-50 ">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-emerald-600">Revenue</h2>
                                    <p className="text-sm text-slate-400 font-medium truncate w-30 md:w-full tracking-wide uppercase">Monthly performance metrics</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsRevenueModelOpen(false)}
                                className="p-2 rounded-xl hover:cursor-pointer transition-all border border-transparent group"
                            >
                                <X className="text-slate-400 group-hover:text-rose-500 transition-colors" size={24} />
                            </button>
                        </div>

                        <div className="sm:p-8 p-4 sm:pb-6 pb-3 max-h-[60vh] overflow-y-auto">
                            {revLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Generating report...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4 p-2 bg-slate-50 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <div>Month</div>
                                        <div className="text-center">Orders</div>
                                        <div className="text-right">Revenue</div>
                                    </div>
                                    {revenueStats.map((stat, index) => (
                                        <div key={index} className="grid grid-cols-3 gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                            <div className="font-bold text-slate-700">{stat.month}</div>
                                            <div className="text-center">
                                                <span className="px-3 py-1 rounded-full text-blue-600 text-xs font-bold">
                                                    {stat.orders} orders
                                                </span>
                                            </div>
                                            <div className="text-right font-black text-slate-900 flex items-center justify-end gap-1">
                                                <IndianRupee size={14} className="text-emerald-600" /> {parseFloat(stat.revenue).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                    {revenueStats.length === 0 && (
                                        <div className="text-center py-12 text-slate-400 italic">
                                            No revenue data available yet.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isOrderModelOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 m-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
                        <div className="sm:p-8 p-4 sm:pb-6 pb-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-emerald-50 ">
                                    <TrendingUp size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-emerald-600">Order</h2>
                                    <p className="text-sm text-slate-400 font-medium truncate w-30 md:w-full tracking-wide uppercase">Monthly performance metrics</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOrderModelOpen(false)}
                                className="p-2 rounded-xl hover:cursor-pointer transition-all border border-transparent group"
                            >
                                <X className="text-slate-400 group-hover:text-rose-500 transition-colors" size={24} />
                            </button>
                        </div>

                        <div className="sm:p-8 p-4 sm:pb-6 pb-3 max-h-[60vh] overflow-y-auto">
                            {revLoading ? (
                                <div className="flex flex-col items-center justify-center py-12 gap-4">
                                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-600"></div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Generating report...</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4 p-2 bg-slate-50 rounded-xl text-xs font-black text-slate-400 uppercase tracking-widest">
                                        <div>Month</div>
                                        <div className="text-center">Orders</div>
                                    </div>
                                    {revenueStats.map((stat, index) => (
                                        <div key={index} className="grid grid-cols-2 gap-4 p-2 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group">
                                            <div className="font-bold text-slate-700">{stat.month}</div>
                                            <div className="text-center">
                                                <span className="px-3 py-1 rounded-full text-blue-600 text-xs font-bold">
                                                    {stat.orders} orders
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {revenueStats.length === 0 && (
                                        <div className="text-center py-12 text-slate-400 italic">
                                            No revenue data available yet.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-3 sm:p-8 border border-slate-50">
                    <div className="flex items-center gap-2 flex-wrap justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900">Latest Menu <span className="text-amber-600">Items</span></h2>
                            <p className="text-sm text-slate-400 font-medium">Recently added to your branch menu.</p>
                        </div>
                        <button onClick={() => navigate('menu-items')} className="flex hover:cursor-pointer items-center gap-2 text-sm font-bold text-amber-600 hover:text-amber-700 bg-amber-50 ml-auto px-4 py-2 rounded-xl transition-colors">
                            View All Items
                        </button>
                    </div>

                    <div className="space-y-4">
                        {isLoading ? [1, 2, 3].map((n) => (
                            <div key={n} className="flex items-center justify-between p-4 rounded-2xl bg-slate-100 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-slate-200">
                                        <ChefHat size={20} />
                                    </div>
                                    <div>
                                        <p className="h-4 w-24 bg-slate-200 rounded"></p>
                                        <p className="h-3 w-16 bg-slate-200 rounded mt-1"></p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="h-4 w-12 bg-slate-200 rounded ml-auto"></p>
                                    <p className="h-3 w-20 bg-slate-200 rounded mt-1 ml-auto"></p>
                                </div>
                            </div>
                        ))
                            : recentItems.map(item => (
                                <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                                            <ChefHat size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{item.name}</p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Added recently</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900 flex items-center justify-end gap-1"><IndianRupee size={14} /> {item.price}</p>
                                        <p className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.isavailable ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {item.isavailable ? 'Available' : 'Sold Out'}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        {recentItems.length === 0 && (
                            <div className="py-12 text-center text-slate-400 italic font-medium">
                                No items found. Start building your menu!
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-50 flex items-center gap-4">
                        <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-xl font-bold text-slate-900">12 Staff</p>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Active Members</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
