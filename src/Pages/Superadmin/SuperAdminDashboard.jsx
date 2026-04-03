/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import {
    ShieldCheck,
    Home,
    Activity,
    DollarSign,
    RefreshCcw
} from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const SuperAdminDashboard = () => {
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();
    const [superstats, setSuperStats] = useState({});
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const DB_URL = import.meta.env.VITE_DB_URL;

    const getSuperAdminData = async () => {
        try {
            setIsLoading(true);
            const [statsRes, branchesRes] = await Promise.all([
                axios.get(`${DB_URL}/api/dashboard/superadmin`, {
                    headers: { "authorization": token }
                }),
                axios.get(`${DB_URL}/api/branches`, {
                    headers: { "authorization": token }
                })
            ]);

            setIsLoading(false);
            setSuperStats(statsRes.data);
            setBranches(branchesRes.data);
        } catch (error) {
            console.log("Error fetching dashboard data:", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getSuperAdminData();
    }, []);

    const stats = [
        { name: 'Total Branches', value: superstats.totalBranches || 0, icon: <Home className="text-amber-600" />, status: 'Online' },
        { name: 'System Admins', value: superstats.totalAdmins || 0, icon: <ShieldCheck className="text-blue-600" />, status: 'Active' },
        { name: 'Total Revenue', value: `₹${superstats.totalRevenue?.toFixed(2) || 0}`, icon: <DollarSign className="text-emerald-600" />, status: 'Generated' },
        { name: 'System Health', value: '99.9%', icon: <Activity className="text-emerald-600" />, status: 'Normal' },
    ];

    return (
        <div className="space-y-8 sm:p-8 p-4">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Super Admin <span className="text-amber-600">Dashboard</span>
                    </h1>
                    <p className="text-slate-400 mt-2">Overseeing all restaurant operations and branch performance.</p>
                </div>

                <button
                    onClick={getSuperAdminData}
                    disabled={isLoading}
                    className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                >
                    <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-amber-200 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-slate-50 rounded-xl">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.name}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-50">
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{stat.status}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">Branch Overview</h2>
                        <p className="text-sm text-slate-500 line-clamp-1">Real-time performance across all locations.</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/branches', {
                            state: { showTooltip: true }
                        })}
                        title="Click to register a new restaurant location"
                        className="bg-amber-600 hover:cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors shadow-sm active:scale-95"
                    >
                        Add New Branch
                    </button>
                </div>

                <div className="overflow-x-auto scrollbar-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Branch Name</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Location</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Contact</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="4" className="px-6 py-4">
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : branches.length > 0 ? (
                                branches.slice(0, 5).map((branch) => (
                                    <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900 text-sm">{branch.name}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{branch.address}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-xs text-slate-500 font-medium">{branch.phone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic text-sm">
                                        No branches registered yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {branches.length > 5 && (
                        <div className="p-4 bg-slate-50/30 text-center border-t border-slate-100">
                            <button
                                onClick={() => navigate('/dashboard/branches')}
                                className="text-xs font-bold text-amber-600 hover:text-amber-700"
                            >
                                View All {branches.length} Branches
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SuperAdminDashboard;
