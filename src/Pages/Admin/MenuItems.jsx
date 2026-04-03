/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, ChefHat, IndianRupee, Tag, CheckCircle2, Search, ChevronDown, RefreshCcw } from 'lucide-react';

import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function MenuItems() {
    const { user } = useContext(AuthContext);
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalSearchTerm, setModalSearchTerm] = useState('');
    const [isIngredientDropdownOpen, setIsIngredientDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category_id: '',
        ingredients: [],
        isavailable: true
    });

    const DB_URL = import.meta.env.VITE_DB_URL;

    useEffect(() => {
        if (user?.branch_id) {
            fetchItems();
            fetchCategories();
            fetchIngredients();
        }
    }, [user]);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${DB_URL}/api/items/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setIsLoading(false);
            setItems(res.data);
        } catch (err) {
            setIsLoading(false);
            console.error(err.message);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await axios.get(`${DB_URL}/api/categories/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setCategories(res.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchIngredients = async () => {
        try {
            const res = await axios.get(`${DB_URL}/api/ingredients/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setAllIngredients(res.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const toggleIngredient = (id) => {
        const current = [...formData.ingredients];
        if (current.includes(id)) {
            setFormData({ ...formData, ingredients: current.filter(i => i !== id) });
        } else {
            setFormData({ ...formData, ingredients: [...current, id] });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, branch_id: user.branch_id };
        try {
            if (editingItem) {
                await axios.put(`${DB_URL}/api/items/${editingItem.id}`, payload, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                toast.success('Item updated successfully');
            } else {
                await axios.post(`${DB_URL}/api/items/create`, payload, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                toast.success('Item added successfully');
            }
            fetchItems();
            closeModal();
        } catch (err) {
            toast.error('Failed to save item');
            console.error(err.message);
        }
    };

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                price: item.price,
                category_id: item.category_id,
                ingredients: Array.isArray(item.ingredients) ? item.ingredients : [],
                isavailable: item.isavailable
            });
        } else {
            setEditingItem(null);
            setFormData({ name: '', price: '', category_id: '', ingredients: [], isavailable: true });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingItem(null);
        setModalSearchTerm('');
        setIsIngredientDropdownOpen(false);
        setFormData({ name: '', price: '', category_id: '', ingredients: [], isavailable: true });
    };


    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the item and may affect linked reservations.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${DB_URL}/api/items/${id}`, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                fetchItems();
                toast.success('Item deleted successfully');
            } catch (err) {
                console.error(err.message);
                toast.error('Failed to delete item');
            }
        }
    };

    return (
        <div className="sm:p-8 p-4 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Menu <span className="text-amber-600">Items</span></h1>
                    <p className="text-slate-500 mt-1">Manage your branch's offerings and kitchen details.</p>
                </div>
                <div className="flex flex-wrap gap-4 items-center ml-auto">
                    <button
                        onClick={fetchItems}
                        disabled={isLoading}
                        className="cursor-pointer flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                    >
                        <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>
                    <div className="relative hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Find item..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm w-64"
                        />
                    </div>
                    <button
                        onClick={() => openModal()}
                        className="flex items-center gap-2 hover:cursor-pointer bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 font-semibold"
                    >
                        <Plus size={20} /> Add New Item
                    </button>
                </div>
            </div>

            <div className="md:hidden mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Find item..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items
                    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((item) => (

                        <div key={item.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 transition-all hover:shadow-2xl group flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-2xl ${item.isavailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                        <ChefHat size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => openModal(item)} className="p-2 text-slate-400 hover:cursor-pointer hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                            <Edit2 size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="p-2 hover:cursor-pointer text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-1">{item.name}</h3>
                                <div className="flex items-center gap-2 text-amber-600 font-bold text-lg mb-3">
                                    <IndianRupee size={16} /> {item.price}
                                </div>
                                <div className='flex flex-wrap gap-2 justify-between text-sm text-slate-500'>
                                    <div>{categories.find(cat => cat.id === item.category_id)?.name || 'Uncategorized'}</div>
                                    <p> ID: {item.id} </p>
                                </div>
                            </div>
                            <div className={`mt-2 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm font-semibold ${item.isavailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                                <CheckCircle2 size={16} /> {item.isavailable ? 'Available Now' : 'Out of Stock'}
                            </div>
                        </div>
                    ))}
                {items.length === 0 && (
                    <div className="col-span-full py-30 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-semibold">No menu items found.</p>
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] sm:p-8 p-6 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={closeModal} className="absolute hover:cursor-pointer right-6 top-6 p-2 text-slate-400 hover:text-red-500 transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">
                            {editingItem ? 'Edit' : 'Add'} <span className="text-amber-600">Item</span>
                        </h2>
                        <p className="text-slate-500 mb-8">Update item details and kitchen requirements.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Item Name</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border-b-2 border-slate-100 pl-12 pr-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                        placeholder="Margherita Pizza"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                        <input
                                            type="number"
                                            required
                                            value={formData.price}
                                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                            className="w-full bg-slate-50 border-b-2 border-slate-100 pl-12 pr-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                            placeholder="299"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <select
                                        required
                                        value={formData.category_id}
                                        onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                        className="w-full bg-slate-50 hover:cursor-pointer border-b-2 border-slate-100 px-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(cat => (
                                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2 group relative">

                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ingredients</label>
                                <div
                                    onClick={() => setIsIngredientDropdownOpen(!isIngredientDropdownOpen)}
                                    className="w-full bg-slate-50 border-b-2 border-slate-100 px-4 py-4 focus-within:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl cursor-pointer flex flex-wrap gap-2 items-center min-h-[60px]"
                                >
                                    {formData.ingredients.length === 0 ? (
                                        <span className="text-slate-400">Select Ingredients...</span>
                                    ) : (
                                        formData.ingredients.map(ingId => {
                                            const ing = allIngredients.find(i => i.id === ingId);
                                            return ing ? (
                                                <span key={ingId} className="bg-amber-100 text-amber-700 px-3 py-1 text-xs font-bold flex items-center gap-1">
                                                    {ing.name}
                                                    <X size={14} className="hover:text-amber-900 cursor-pointer"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleIngredient(ingId);
                                                        }}
                                                    />
                                                </span>
                                            ) : null;
                                        })
                                    )}
                                    <div className="ml-auto text-slate-400">
                                        <ChevronDown size={18} className={`transition-transform duration-300 ${isIngredientDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {isIngredientDropdownOpen && (
                                    <div className="absolute z-[110] left-0 right-0 top-full mt-1 bg-white border border-slate-100 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        <div className="p-3 border-b border-slate-50">
                                            <div className="relative">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                                                <input
                                                    type="text"
                                                    placeholder="Search ingredients..."
                                                    value={modalSearchTerm}
                                                    autoFocus
                                                    onChange={(e) => setModalSearchTerm(e.target.value)}
                                                    className="w-full bg-slate-50 border border-slate-100 pl-9 pr-4 py-2 rounded-xl focus:border-amber-500 outline-none transition-all text-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>
                                        <div className="max-h-[100px] overflow-y-auto custom-scrollbar p-2">
                                            {allIngredients
                                                .filter(ing => ing.name.toLowerCase().includes(modalSearchTerm.toLowerCase()))
                                                .map((ing) => (
                                                    <div key={ing.id} onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleIngredient(ing.id);
                                                    }}
                                                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${formData.ingredients.includes(ing.id)
                                                            ? 'bg-amber-50 text-amber-600'
                                                            : 'hover:bg-slate-50 text-slate-600'
                                                            }`}
                                                    >
                                                        <span className="text-sm hover:text-amber-600 font-semibold">{ing.name}</span>
                                                        {formData.ingredients.includes(ing.id) && <CheckCircle2 size={16} />}
                                                    </div>
                                                ))}
                                            {allIngredients.length === 0 && (
                                                <div className="py-4 text-center">
                                                    <p className="text-slate-400 text-xs italic">No ingredients available.</p>
                                                </div>
                                            )}
                                            {allIngredients.length > 0 && allIngredients.filter(ing => ing.name.toLowerCase().includes(modalSearchTerm.toLowerCase())).length === 0 && (
                                                <div className="py-4 text-center">
                                                    <p className="text-slate-400 text-xs italic">No matches found</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="available"
                                    checked={formData.isavailable}
                                    onChange={(e) => setFormData({ ...formData, isavailable: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                                />
                                <label htmlFor="available" className="text-sm font-bold text-slate-700 cursor-pointer">
                                    Mark as available in menu
                                </label>
                            </div>

                            <button type="submit" className="group relative w-full hover:cursor-pointer bg-slate-900 text-white font-bold py-4 rounded-2xl overflow-hidden transition-all hover:bg-slate-800 shadow-xl active:scale-95 mt-4">
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <Save size={18} /> {editingItem ? 'Update Item' : 'Create Item'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
