/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    User,
    Mail,
    Shield,
    MapPin,
    Search,
    Calendar,
    ChevronRight,
    SearchX,
    RefreshCcw
} from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function Admin() {
    const { token, user: currentUser } = useContext(AuthContext);
    const [admins, setAdmins] = useState([]);
    const [branches, setBranches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'admin',
        branchid: ''
    });

    useEffect(() => {
        fetchAdmins();
        fetchBranches();
    }, []);

    const fetchAdmins = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get('http://localhost:5000/api/users/all', {
                headers: { "authorization": token }
            });
            setAdmins(res.data);
        } catch (err) {
            console.error("Error fetching admins:", err.message);
            toast.error('Failed to load administrators');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchBranches = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/branches', {
                headers: { "authorization": token }
            });
            setBranches(res.data);
        } catch (err) {
            console.error("Error fetching branches:", err.message);
            toast.error('Failed to load branches');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAdmin) {
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password;

                await axios.put(`http://localhost:5000/api/users/${editingAdmin.id}`, updateData, {
                    headers: { "authorization": token }
                });

                toast.success('Admin updated successfully');
            } else {
                await axios.post('http://localhost:5000/api/users/register', formData, {
                    headers: { "authorization": token }
                });

                toast.success('Admin created successfully');
            }
            fetchAdmins();
            closeModal();
        } catch (err) {
            console.error("Error saving admin:", err);
            toast.error(err.response?.data?.message || "Failed to save admin");
        }
    };

    const handleDelete = async (id) => {
        if (id === currentUser.id) {
            toast.error("You cannot delete yourself!");
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the Administrator and this action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/users/${id}`, {
                    headers: { "authorization": token }
                });
                fetchAdmins();

                toast.success('Admin deleted successfully');
            } catch (err) {
                toast.error('Failed to delete admin');
                console.error("Error deleting admin:", err);
            }
        }
    };

    const openModal = (admin = null) => {
        if (admin) {
            setEditingAdmin(admin);
            setFormData({
                name: admin.name,
                email: admin.email,
                password: '',
                role: admin.role,
                branchid: admin.branch_id || ''
            });
        } else {
            setEditingAdmin(null);
            setFormData({ name: '', email: '', password: '', role: 'admin', branchid: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAdmin(null);
        setFormData({ name: '', email: '', password: '', role: 'admin', branchid: '' });
    };

    const getBranchName = (branchId) => {
        const branch = branches.find(b => b.id === branchId);
        return branch ? branch.name : 'System Wide';
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sm:p-8 p-4 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900">Admin <span className="text-amber-600">Personnel</span></h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Manage branch administrators and system access levels.</p>
                </div>

                <div className="flex flex-wrap gap-3 items-center sm:ml-auto">
                    <button
                        onClick={() => { fetchAdmins(); fetchBranches(); }}
                        disabled={isLoading}
                        className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                    >
                        <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <div className="relative group hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find administrator..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 pl-11 pr-5 py-2.5 rounded-xl focus:border-amber-500 outline-none transition-all shadow-sm w-64 group-hover:border-slate-300 text-sm"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center hover:cursor-pointer gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 font-bold text-sm"
                    >
                        <Plus size={18} className="stroke-[3]" /> Add Admin
                    </button>
                </div>
            </div>

            <div className="md:hidden mb-6">
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Find administrator..."
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
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Branch</th>
                                <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest hidden lg:table-cell">Joined Date</th>
                                <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4">
                                            <div className="h-10 bg-slate-100 rounded-lg w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredAdmins.length > 0 ? (
                                filteredAdmins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base shadow-sm border border-amber-100/50">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 group-hover:text-amber-600 transition-colors text-sm">{admin.name}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium">{admin.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase 
                                            ${admin.role === 'superadmin'
                                                    ? 'bg-purple-50 text-purple-600'
                                                    : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                <Shield size={10} className="stroke-[3]" />
                                                {admin.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex items-center sm:gap-2 text-slate-600 text-[13px] flex-wrap font-medium">
                                                <MapPin size={14} className="text-slate-400" />
                                                {getBranchName(admin.branch_id)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5 hidden lg:table-cell">
                                            <div className="flex items-center gap-2 text-slate-400 font-medium text-[12px]">
                                                <Calendar size={14} />
                                                {new Date(admin.createdat).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3.5">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(admin)}
                                                    className="p-2 text-slate-400 hover:cursor-pointer hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(admin.id)}
                                                    className={`p-2 text-slate-400 hover:cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all ${admin.id === currentUser.id ? 'opacity-0 pointer-events-none' : ''}`}
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
                                            <p className="text-base font-bold">No administrators found.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {
                isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                        <div className="bg-white w-full max-w-lg rounded-[2rem] p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                            <button onClick={closeModal} className="absolute right-6 top-6 p-2 text-slate-300 hover:text-red-500 hover:cursor-pointer transition-colors">
                                <X size={20} />
                            </button>

                            <div className="mb-6">
                                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                                    {editingAdmin ? 'Edit' : 'Add'} <span className="text-amber-600">Administrator</span>
                                </h2>
                                <span className="text-xs text-slate-400 font-medium">Configure access levels and credentials.</span>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={16} />
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-slate-50 border-b-2 border-slate-100 pl-11 pr-4 py-3 focus:border-amber-500 outline-none transition-all text-slate-900 text-sm rounded-t-xl"
                                                placeholder="Full Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={16} />
                                            <input
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full bg-slate-50 border-b-2 border-slate-100 pl-11 pr-4 py-3 focus:border-amber-500 outline-none transition-all text-slate-900 text-sm rounded-t-xl"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">
                                            Password {editingAdmin && <span className="normal-case text-slate-400 italic font-medium">(optional)</span>}
                                        </label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={16} />
                                            <input
                                                type="password"
                                                required={!editingAdmin}
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className="w-full bg-slate-50 border-b-2 border-slate-100 pl-11 pr-4 py-3 focus:border-amber-500 outline-none transition-all text-slate-900 text-sm rounded-t-xl"
                                                placeholder="••••••••"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Role Type</label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={16} />
                                            <select
                                                value={formData.role}
                                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                                className="w-full bg-slate-50 hover:cursor-pointer border-b-2 border-slate-100 pl-11 pr-4 py-3 focus:border-amber-500 outline-none transition-all text-slate-900 text-sm rounded-t-xl font-bold"
                                            >
                                                <option value="admin">Administrator</option>
                                                <option value="superadmin">Super Admin</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {formData.role === 'admin' && (
                                    <div className="space-y-1.5 group">
                                        <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">Assign to Branch</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors" size={16} />
                                            <select
                                                required={formData.role === 'admin'}
                                                value={formData.branchid}
                                                onChange={(e) => setFormData({ ...formData, branchid: e.target.value })}
                                                className="w-full bg-slate-50 hover:cursor-pointer border-b-2 border-slate-100 pl-11 pr-4 py-3 focus:border-amber-500 outline-none transition-all text-slate-900 text-sm rounded-t-xl font-bold"
                                            >
                                                <option value="">Select a Branch</option>
                                                {branches.map(branch => (
                                                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <button type="submit" className="group relative w-full bg-slate-900 hover:cursor-pointer text-white font-black py-4 rounded-xl overflow-hidden transition-all hover:bg-slate-800 shadow-xl active:scale-[0.98] mt-2 flex items-center justify-center gap-2 text-sm">
                                    <Save size={16} className="stroke-[3]" />
                                    <span>{editingAdmin ? 'Update Admin' : 'Create Admin'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
