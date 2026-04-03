/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, LayoutGrid, Users, CheckCircle2, Clock, RefreshCcw } from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function TableManagement() {
    const { user } = useContext(AuthContext);
    const [tables, setTables] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        table_number: '',
        capacity: '',
        status: 'free'
    });

    const DB_URL = import.meta.env.VITE_DB_URL;

    useEffect(() => {
        if (user?.branch_id) {
            fetchTables();
        }
    }, [user]);

    const fetchTables = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${DB_URL}/api/tables/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setIsLoading(false);
            setTables(res.data);
        } catch (err) {
            setIsLoading(false);
            console.error(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, branch_id: user.branch_id };
        try {
            if (editingTable) {
                await axios.put(`${DB_URL}/api/tables/${editingTable.id}`, payload, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                toast.success('Table updated successfully');
            } else {
                await axios.post(`${DB_URL}/api/tables/add`, payload, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                toast.success('Table Added successfully');
            }
            fetchTables();
            closeModal();
        } catch (err) {
            toast.error(err.message);
            console.error(err.message);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${DB_URL}/api/tables/${id}/status`, { status }, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            fetchTables();
            toast.success('Table status updated successfully');
        } catch (err) {
            toast.error('Failed to update table status');
            console.error(err.message);
        }
    };

    const openModal = (table = null) => {
        if (table) {
            setEditingTable(table);
            setFormData({
                table_number: table.table_number,
                capacity: table.capacity,
                status: table.status
            });
        } else {
            setEditingTable(null);
            setFormData({ table_number: '', capacity: '', status: 'free' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTable(null);
        setFormData({ table_number: '', capacity: '', status: 'free' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the table and may affect linked reservations.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${DB_URL}/api/tables/${id}`, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });
                fetchTables();
                toast.success('Table deleted successfully');
            } catch (err) {
                toast.error('Failed to delete table');
                console.error(err.message);
            }
        }
    };

    return (
        <div className="sm:p-8 p-4 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Table <span className="text-amber-600">Management</span></h1>
                    <p className="text-slate-500 mt-1">Organize your restaurant layout and track table status.</p>
                </div>

                <div className="flex flex-wrap gap-4 items-center ml-auto">
                    <button
                        onClick={fetchTables}
                        disabled={isLoading}
                        className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                    >
                        <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <div className="relative hidden md:block">
                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find table..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm w-64"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center hover:cursor-pointer gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 font-semibold"
                    >
                        <Plus size={20} /> Add New Table
                    </button>
                </div>
            </div>

            <div className="md:hidden mb-6">
                <div className="relative">
                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Find table..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tables
                    .filter(table => table.table_number.toString().includes(searchTerm) || table.status.includes(searchTerm.toLowerCase()))
                    .map((table) => (
                        <div key={table.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 transition-all hover:shadow-2xl group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-2xl opacity-10 ${table.status === 'free' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className={`p-4 rounded-2xl ${table.status === 'free' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                    <LayoutGrid size={28} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(table)} className="p-2 text-slate-400 hover:cursor-pointer hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(table.id)} className="p-2 text-slate-400 hover:cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold text-slate-900 mb-2">Table {table.table_number}</h3>
                                <div className="flex items-center gap-2 text-slate-500 font-semibold mb-6">
                                    <Users size={16} /> Capacity: {table.capacity} Persons
                                </div>

                                <div className="flex flex-col gap-3">
                                    <span className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest ${table.status === 'free' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {table.status === 'free' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                                        Current: {table.status}
                                    </span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateStatus(table.id, table.status === 'free' ? 'occupied' : 'free')}
                                            className={`flex-grow py-3 rounded-xl font-bold hover:cursor-pointer text-sm transition-all active:scale-95 ${table.status === 'free'
                                                ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100'
                                                : 'bg-amber-600 text-white hover:bg-amber-700 shadow-md shadow-amber-100'
                                                }`}
                                        >
                                            Mark as {table.status === 'free' ? 'Occupied' : 'Free'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                {tables.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-semibold">No tables found.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={closeModal} className="absolute hover:cursor-pointer right-6 top-6 p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {editingTable ? 'Edit' : 'Add'} <span className="text-amber-600">Table</span>
                        </h2>
                        <p className="text-slate-500 mb-8">Set up your dining area configuration.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Table Number</label>
                                <div className="relative">
                                    <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input
                                        type="number"
                                        required
                                        value={formData.table_number}
                                        onChange={(e) => setFormData({ ...formData, table_number: e.target.value })}
                                        className="w-full bg-slate-50 border-b-2 border-slate-100 pl-12 pr-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                        placeholder="01"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Capacity (Persons)</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input
                                        type="number"
                                        required
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                        className="w-full bg-slate-50 border-b-2 border-slate-100 pl-12 pr-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                        placeholder="4"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="group relative w-full bg-slate-900 text-white font-bold py-4 rounded-2xl overflow-hidden transition-all hover:bg-slate-800 shadow-xl hover:cursor-pointer active:scale-95 mt-4">
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <Save size={18} /> {editingTable ? 'Update Table' : 'Add Table'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
