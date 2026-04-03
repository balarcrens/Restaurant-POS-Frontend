/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Save, ChefHat, IndianRupee, Tag, CheckCircle2, Search, RefreshCcw } from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function Ingredients() {
    const { user } = useContext(AuthContext);
    const [ingredients, setIngredients] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        isavailable: true
    });
    const [isLoading, setIsLoading] = useState(false);

    const DB_URL = import.meta.env.VITE_DB_URL;

    useEffect(() => {
        if (user?.branch_id) {
            fetchIngredients();
        }
    }, [user]);

    const fetchIngredients = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`${DB_URL}/api/ingredients/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setIsLoading(false);
            setIngredients(res.data);
        } catch (err) {
            setIsLoading(false);
            console.error(err.message);
            if (err.response?.status === 404) {
                setIngredients([]);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = { ...formData, branch_id: user.branch_id };
        try {
            if (editingIngredient) {
                await axios.put(`${DB_URL}/api/ingredients/${editingIngredient.id}`, payload, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                toast.success('Ingredient updated successfully');
            } else {
                await axios.post(`${DB_URL}/api/ingredients/create`, payload, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });

                toast.success('Ingredient added successfully');
            }
            fetchIngredients();
            closeModal();
        } catch (err) {
            console.error(err.message);
            toast.error('Failed to save ingredient');
        }
    };

    const openModal = (ingredient = null) => {
        if (ingredient) {
            setEditingIngredient(ingredient);
            setFormData({
                name: ingredient.name,
                price: ingredient.price,
                isavailable: ingredient.isavailable
            });
        } else {
            setEditingIngredient(null);
            setFormData({ name: '', price: '', isavailable: true });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingIngredient(null);
        setFormData({ name: '', price: '', isavailable: true });
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will permanently delete the ingredient and may affect linked menu items.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`${DB_URL}/api/ingredients/${id}`, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });
                fetchIngredients();
                toast.success('Ingredient deleted successfully');
            } catch (err) {
                console.error(err.message);
                toast.error('Failed to delete ingredient');
            }
        }
    };

    const filteredIngredients = ingredients.filter(ing =>
        ing.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="sm:p-8 p-4 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Manage <span className="text-amber-600">Ingredients</span></h1>
                    <p className="text-slate-500 mt-1">Define extras and add-ons for your menu items.</p>
                </div>

                <div className='flex flex-wrap gap-4 items-center ml-auto'>
                    <button
                        onClick={fetchIngredients}
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
                                placeholder="cheese, sauce, etc..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => openModal()}
                        className="flex sm:items-center hover:cursor-pointer gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 font-semibold"
                    >
                        <Plus size={20} /> Add New Ingredient
                    </button>
                </div>
            </div>

            <div className="md:hidden mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="cheese, sauce, etc..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-12 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredIngredients.map((ing) => (
                    <div key={ing.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 transition-all hover:shadow-2xl group flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-2xl ${ing.isavailable ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}`}>
                                    <ChefHat size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openModal(ing)} className="p-2 text-slate-400 hover:cursor-pointer hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all">
                                        <Edit2 size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(ing.id)} className="p-2 text-slate-400 hover:cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-1">{ing.name}</h3>
                            <div className="flex items-center gap-2 text-amber-600 font-bold text-lg mb-3">
                                <IndianRupee size={16} /> {ing.price}
                            </div>
                        </div>
                        <div className='flex flex-wrap justify-between items-center gap-2'>
                            <div className={`border-t border-slate-100 flex items-center gap-2 text-sm font-semibold ${ing.isavailable ? 'text-emerald-600' : 'text-slate-400'}`}>
                                <CheckCircle2 size={16} /> {ing.isavailable ? 'Available' : 'Out of Stock'}
                            </div>
                            <p className="text-sm text-slate-400 ml-0.5">
                                ID: {ing.id}
                            </p>
                        </div>
                    </div>
                ))}
                {filteredIngredients.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-semibold">No ingredients found.</p>
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
                            {editingIngredient ? 'Edit' : 'Add'} <span className="text-amber-600">Ingredient</span>
                        </h2>
                        <p className="text-slate-500 mb-8">Set pricing and availability for add-ons.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Ingredient Name</label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border-b-2 border-slate-100 pl-12 pr-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                        placeholder="Extra Cheese"
                                    />
                                </div>
                            </div>

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
                                        placeholder="50"
                                    />
                                </div>
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
                                    Mark as available for selection
                                </label>
                            </div>

                            <button type="submit" className="group hover:cursor-pointer relative w-full bg-slate-900 text-white font-bold py-4 rounded-2xl overflow-hidden transition-all hover:bg-slate-800 shadow-xl active:scale-95 mt-4">
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    <Save size={18} /> {editingIngredient ? 'Update Ingredient' : 'Create Ingredient'}
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
