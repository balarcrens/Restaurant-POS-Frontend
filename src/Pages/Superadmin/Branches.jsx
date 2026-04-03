/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    MapPin,
    Phone,
    Search,
    Calendar,
    RotateCcw,
    SearchX,
    Building2,
    IndianRupee,
    ListOrdered,
    RefreshCcw
} from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2'

export default function Branches() {
    const location = useLocation();
    const { token } = useContext(AuthContext);
    const [branches, setBranches] = useState([]);
    const [branchesDetail, setBranchesDetail] = useState(null);
    const [branchMonthlyStats, setBranchMonthlyStats] = useState([]);
    const [isStatsLoading, setIsStatsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showTooltip, setShowTooltip] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: ''
    });

    const DB_URL = import.meta.env.VITE_DB_URL;

    useEffect(() => {
        if (location.state?.showTooltip) {
            setShowTooltip(true);

            setTimeout(() => setShowTooltip(false), 4000);
        }
    }, [location.state]);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${DB_URL}/api/branches`, {
                headers: { "authorization": token }
            });
            setBranches(res.data);
        } catch (err) {
            console.error("Error fetching branches:", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBranchDetail = async (branchId) => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${DB_URL}/api/branches/${branchId}/revenue`, {
                headers: { "authorization": token }
            });
            setBranchesDetail(res.data);
        } catch (err) {
            console.error("Error fetching branches detail:", err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBranchMonthlyStats = async (branchId) => {
        try {
            setIsStatsLoading(true);
            const res = await axios.get(`${DB_URL}/api/dashboard/revenue/${branchId}`, {
                headers: { authorization: token }
            });
            setBranchMonthlyStats(res.data);
        } catch (err) {
            console.error("Error fetching monthly stats:", err.message);
        } finally {
            setIsStatsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBranch) {
                await axios.put(`${DB_URL}/api/branches/${editingBranch.id}`, formData, {
                    headers: { "authorization": token }
                });

                toast.success('Branch updated successfully');
            } else {
                await axios.post(`${DB_URL}/api/branches`, formData, {
                    headers: { "authorization": token }
                });

                toast.success('Branch created successfully');
            }
            fetchBranches();
            closeModal();
        } catch (err) {
            console.error("Error saving branch:", err.message);
            toast.error(err.response?.data?.message || "Failed to save branch");
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the branch and may affect linked staff.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${DB_URL}/api/branches/${id}`, {
                    headers: { "authorization": token }
                });
                fetchBranches();
                toast.success('Branch deleted successfully');
            } catch (err) {
                console.error("Error deleting branch:", err.message);
                toast.error('Failed to delete branch');
            }
        }
    };

    const handleResetData = async (branchId) => {
        const result = await Swal.fire({
            title: "Reset Branch Data?",
            text: "This will remove all branch-related data (orders, stats, etc.). This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f59e0b",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, reset it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.post(`${DB_URL}/api/branches/${branchId}/reset`, {}, {
                    headers: { "authorization": token }
                });

                toast.success('Branch data reset successfully');
            } catch (err) {
                console.error("Error resetting branch data:", err.message);
                toast.error('Failed to reset branch data.');
            }
        }
    };

    const openModal = (branch = null) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                name: branch.name,
                address: branch.address,
                phone: branch.phone || ''
            });
        } else {
            setEditingBranch(null);
            setFormData({ name: '', address: '', phone: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingBranch(null);
        setFormData({ name: '', address: '', phone: '' });
    };

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.phone.includes(searchTerm)
    );

    return (
        <div className="sm:p-8 p-4 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Restaurant <span className="text-amber-600">Branches</span></h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Configure locations and manage operational nodes.</p>
                </div>

                <div className="flex flex-wrap gap-3 items-center sm:ml-auto">
                    <button
                        onClick={fetchBranches}
                        disabled={isLoading}
                        className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                    >
                        <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find branch location..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 pl-11 pr-5 py-2.5 rounded-xl focus:border-amber-500 outline-none transition-all shadow-sm w-64 group-hover:border-slate-300 text-sm"
                        />
                    </div>
                    <div className='relative'>
                        <button
                            onClick={() => openModal()}
                            className="flex items-center gap-2 hover:cursor-pointer bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 font-bold text-sm"
                        >
                            <Plus size={18} className="stroke-[3]" /> Add Branch
                        </button>

                        {showTooltip && (
                            <div className="absolute top-full sm:-left-29 left-0 mt-3 z-50 w-64 animate-in fade-in slide-in-from-top-2 duration-500">
                                <div className="absolute -top-1.5 left-6 sm:left-auto sm:right-6 w-3 h-3 bg-slate-900 rotate-45 border-t border-l border-slate-800"></div>

                                <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl shadow-slate-400/50 border border-slate-800 flex items-start gap-3">
                                    <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500 shrink-0">
                                        <Plus size={16} className="stroke-[3]" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-amber-500 mb-0.5">Quick Action</p>
                                        <p className="text-sm font-medium text-slate-300 leading-snug">
                                            Register a new restaurant location to expand your business.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="md:hidden mb-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Find branch location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-11 pr-5 py-3 rounded-xl focus:border-amber-500 outline-none transition-all shadow-sm text-sm"
                    />
                </div>
            </div>

            <div className="bg-white border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto scrollbar-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Branch Overview</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Location Details</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Launch Date</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4">
                                            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredBranches.length > 0 ? (
                                filteredBranches.map((branch) => (
                                    <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base shadow-sm border border-amber-100/50">
                                                    <Building2 size={20} />
                                                </div>
                                                <div className='hover:cursor-pointer' onClick={() => {
                                                    setIsDetailModalOpen(true);
                                                    fetchBranchDetail(branch.id);
                                                    fetchBranchMonthlyStats(branch.id);
                                                }} >
                                                    <p className="font-bold text-slate-900 group-hover:text-amber-600 truncate w-30 transition-colors text-sm">{branch.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium">ID: #{branch.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium text-[13px]">
                                                <MapPin size={14} className="text-slate-400 flex-shrink-0" />
                                                <span className="truncate max-w-[180px]">{branch.address}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-2 text-slate-600 font-medium text-[13px]">
                                                <Phone size={14} className="text-slate-400 flex-shrink-0" />
                                                {branch.phone || 'N/A'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 hidden lg:table-cell">
                                            <div className="flex items-center gap-2 text-slate-400 font-medium text-[12px]">
                                                <Calendar size={14} />
                                                {new Date(branch.createdat).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(branch)}
                                                    title="Edit Branch"
                                                    className="p-2 text-slate-400 hover:cursor-pointer hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleResetData(branch.id)}
                                                    title="Reset Branch Data"
                                                    className="p-2 text-slate-400 hover:cursor-pointer hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                                >
                                                    <RotateCcw size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(branch.id)}
                                                    title="Delete Branch"
                                                    className="p-2 text-slate-400 hover:cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-400">
                                            <SearchX size={48} className="mb-3 opacity-20" />
                                            <p className="text-base font-bold">No branches found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={closeModal} className="absolute right-6 top-6 p-2 text-slate-300 hover:text-red-500 hover:cursor-pointer transition-colors">
                            <X size={20} />
                        </button>

                        <div className="mb-6">
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                {editingBranch ? 'Edit' : 'Add'} <span className="text-amber-600">Branch</span>
                            </h2>
                            <span className="text-xs text-slate-400 font-medium">Set location and contact details for the branch.</span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Branch Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border-b-2 border-slate-100 pl-11 pr-4 py-3 focus:border-amber-500 outline-none transition-all text-slate-900 text-sm rounded-t-xl"
                                        placeholder="ABC Restaurant"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.address}
                                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-slate-50 border-b-2 border-slate-100 pl-11 pr-4 py-3 focus:border-amber-500 outline-none transition-all text-slate-900 text-sm rounded-t-xl"
                                        placeholder="123 ABC Street, City"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5 group">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={16} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-slate-50 border-b-2 border-slate-100 pl-11 pr-4 py-3 focus:border-amber-500 outline-none transition-all text-slate-900 text-sm rounded-t-xl"
                                        placeholder="1234567890"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="group relative w-full bg-slate-900 text-white font-black py-4 rounded-xl overflow-hidden transition-all hover:bg-slate-800 hover:cursor-pointer shadow-xl active:scale-[0.98] mt-2 flex items-center justify-center gap-2 text-sm">
                                <Save size={16} className="stroke-[3]" />
                                <span>{editingBranch ? 'Update Location' : 'Register Branch'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {isDetailModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative animate-in zoom-in-95 duration-300 border-2 border-white/20 overflow-hidden">
                        <button
                            onClick={() => setIsDetailModalOpen(false)}
                            className="absolute hover:cursor-pointer top-3 right-3 sm:right-6 sm:top-6 p-2 rounded-xl text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="sm:p-8 p-4 sm:pb-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-4">
                            <div className="p-4 rounded-2xl bg-amber-50 text-amber-600 shadow-sm border border-amber-100/50">
                                <Building2 size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black flex sm:flex-row flex-col text-slate-900 leading-none mb-1 gap-1">
                                    {branchesDetail?.name} <span className="text-amber-600">Analytics</span>
                                </h2>
                                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">Branch Insights & Operational metrics</span>
                            </div>
                        </div>

                        <div className="sm:p-8 p-4 sm:pb-6 pb-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-3 sm:text-start text-center gap-1 sm:gap-4 mb-4">
                                <div className="bg-slate-50 p-3 sm:p-5 rounded-2xl border border-slate-100 group hover:border-amber-200 transition-colors">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-amber-600">Total Revenue</p>
                                    <p className="text-xl font-black text-slate-900 flex items-center sm:justify-start justify-center gap-1.5 leading-none">
                                        <IndianRupee size={16} className="text-emerald-500" />
                                        {parseFloat(branchesDetail?.revenue || 0).toLocaleString()}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-3 sm:p-5 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-colors">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-600">Total Orders</p>
                                    <p className="text-xl font-black text-slate-900 flex items-center sm:justify-start justify-center gap-1.5 leading-none">
                                        <ListOrdered size={16} className="text-blue-500" />
                                        {branchesDetail?.order_count || 0}</p>
                                </div>
                                <div className="bg-slate-50 p-3 sm:p-5 rounded-2xl border border-slate-100 group hover:border-emerald-200 transition-colors">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-emerald-600">Avg Order Value</p>
                                    <p className="text-xl font-black text-slate-900 flex items-center sm:justify-start justify-center gap-1.5 leading-none">
                                        <IndianRupee size={16} className="text-emerald-500" />
                                        {branchesDetail?.order_count > 0 ? (branchesDetail?.revenue / branchesDetail?.order_count).toFixed(2) : 0}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {isStatsLoading ? (
                                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-amber-600"></div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading stats...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5 overflow-x-auto overflow-y-auto scrollbar-hidden max-h-[50vh]">
                                        <div className='min-w-[400px]'>
                                            <div className="grid grid-cols-12 gap-4 sm:px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 rounded-xl">
                                                <div className="col-span-5">Month Period</div>
                                                <div className="col-span-3 text-center">Volume</div>
                                                <div className="col-span-4 text-right">Revenue</div>
                                            </div>
                                            {branchMonthlyStats.map((stat, index) => (
                                                <div key={index} className="grid grid-cols-12 gap-4 md:p-4 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 group items-center">
                                                    <div className="col-span-5 font-bold text-slate-700 text-sm group-hover:text-slate-900">{stat.month}</div>
                                                    <div className="col-span-3 text-center">
                                                        <span className="px-2.5 py-1 rounded-full text-blue-600 text-[10px] font-black uppercase">
                                                            {stat.orders}
                                                        </span>
                                                    </div>
                                                    <div className="col-span-4 text-right font-black text-slate-900 flex items-center justify-end gap-1 text-sm">
                                                        <IndianRupee size={12} className="text-emerald-500" />
                                                        {parseFloat(stat.revenue).toLocaleString()}
                                                    </div>
                                                </div>
                                            ))}
                                            {branchMonthlyStats.length === 0 && (
                                                <div className="text-center py-12 text-slate-300 italic text-sm font-medium">
                                                    No monthly data recorded yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

