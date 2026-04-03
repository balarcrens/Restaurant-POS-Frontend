/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { ChefHat, Edit2, Plus, RefreshCcw, Save, Search, Tag, Trash2, X } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function Category() {
    const { user } = useContext(AuthContext);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        branch_id: '',
    });

    const DB_URL = import.meta.env.VITE_DB_URL;

    useEffect(() => {
        if (user?.branch_id) {
            fetchCategories();
        }
    }, [user?.branch_id]);

    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${DB_URL}/api/categories/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setIsLoading(false);
            setCategories(res.data);
        } catch (err) {
            setIsLoading(false);
            console.error(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            branch_id: user.branch_id
        };

        try {
            if (editingCategory) {
                await axios.put(`${DB_URL}/api/categories/${editingCategory.id}`, payload, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                toast.success('Category updated successfully');
            } else {
                await axios.post(`${DB_URL}/api/categories/create`, payload, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                toast.success('Category added successfully');
            }
            fetchCategories();
        } catch (err) {
            console.error(err.message);
            toast.error('Failed to add category');
        } finally {
            closeModal();
        }
    };

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                branch_id: category.branch_id
            });
        } else {
            setEditingCategory(null);
            setFormData({ name: '', branch_id: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', branch_id: '' });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the category and may affect linked items.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${DB_URL}/api/categories/${id}`, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });
                fetchCategories();
                toast.success('Category deleted successfully');
            } catch (err) {
                console.error(err.message);
                toast.error('Failed to delete category');
            }
        }
    }

    return (
        <div className="sm:p-8 p-4 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Menu <span className="text-amber-600">Categories</span></h1>
                    <p className="text-slate-500 mt-1">Manage your branch's offerings and kitchen details.</p>
                </div>

                <div className='flex flex-wrap gap-4 items-center ml-auto'>
                    <button
                        onClick={fetchCategories}
                        disabled={isLoading}
                        className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                    >
                        <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>

                    <div className="relative hidden md:block">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Pizzaz, Burgur, etc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="flex hover:cursor-pointer items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 font-semibold"
                    >
                        <Plus size={20} /> Add New Category
                    </button>
                </div>
            </div>

            <div className="md:hidden mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Pizza, Burgers, etc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-semibold">No categories found.</p>
                    </div>
                ) : (
                    categories.filter(category => category.name.toLowerCase().includes(searchTerm?.toLowerCase() || ''))
                        .map((category) => {
                            return (
                                <div key={category.id} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 transition-all duration-300 group">
                                    <div className="flex justify-between flex-wrap items-center mb-5 transition-all duration-400">
                                        <div className="p-3 flex gap-2 flex-wrap items-center rounded-xl bg-amber-50 text-amber-600">
                                            <ChefHat size={22} />

                                            <p className='hidden group-hover:block text-sm transition-all duration-300'>Category</p>
                                        </div>

                                        <div className="flex gap-2 transition">
                                            <button
                                                onClick={() => openModal(category)}
                                                className="p-2 text-slate-400 hover:cursor-pointer hover:text-amber-500 hover:bg-amber-50 rounded-lg transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category.id)}
                                                className="p-2 text-slate-400 hover:cursor-pointer hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-sm text-slate-400 ml-0.5">
                                        ID: {category.id}
                                    </p>

                                    <h3 className="text-lg font-semibold text-slate-800 capitalize">
                                        {category.name}
                                    </h3>
                                </div>
                            )
                        })
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={closeModal} className="absolute hover:cursor-pointer right-6 top-6 p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            Add <span className="text-amber-600">Category</span>
                        </h2>
                        <p className="text-slate-500 mb-8">Update category details and kitchen requirements.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category Name</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border-b-2 border-slate-100 pl-12 pr-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                        placeholder="Pizza, Burgers, etc."
                                    />
                                </div>
                            </div>

                            <button type="submit" className="group hover:cursor-pointer relative w-full bg-slate-900 text-white font-bold py-4 rounded-2xl overflow-hidden transition-all hover:bg-slate-800 shadow-xl active:scale-95 mt-4">
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <Save size={18} /> {editingCategory ? 'Update Category' : 'Create Category'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
