/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Plus, ShoppingCart, Table as TableIcon, IndianRupee, X, ChefHat, Trash2, Search, ArrowRight, RefreshCcw } from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';

export default function Orders() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [items, setItems] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [tables, setTables] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [newOrder, setNewOrder] = useState({
        table_id: '',
        order_type: 'dine-in',
        items: []
    });

    useEffect(() => {
        if (user?.branch_id) {
            fetchOrders();
            fetchItems();
            fetchTables();
            fetchIngredients();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`http://localhost:5000/api/orders/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setIsLoading(false);
            setOrders(res.data);
        } catch (err) {
            console.error(err.message);
            setIsLoading(false);
        }
    };

    const fetchItems = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/items/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setItems(res.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchIngredients = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/ingredients/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setAllIngredients(res.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const fetchTables = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/tables/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            setTables(res.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleAddItem = (item) => {
        const cartItem = {
            item_id: item.id,
            name: item.name,
            quantity: 1,
            price: item.price,
            sub_total: item.price,
            selected_ingredients: [],
            available_ingredients: Array.isArray(item.ingredients) ? item.ingredients : []
        };
        setNewOrder(prev => ({ ...prev, items: [...prev.items, cartItem] }));
    };

    const toggleIngredient = (idx, ingId) => {
        const updated = [...newOrder.items];
        const item = updated[idx];
        item.selected_ingredients = item.selected_ingredients.includes(ingId)
            ? item.selected_ingredients.filter(id => id !== ingId)
            : [...item.selected_ingredients, ingId];
        setNewOrder({ ...newOrder, items: updated });
    };

    const removeItem = (idx) => {
        setNewOrder({ ...newOrder, items: newOrder.items.filter((_, i) => i !== idx) });
    };

    const calculateTotal = () => {
        return newOrder.items.reduce((total, item) => {
            const ingTotal = item.selected_ingredients.reduce((sum, id) => {
                const ing = allIngredients.find(i => i.id === id);
                return sum + (ing ? parseFloat(ing.price) : 0);
            }, 0);
            return total + ((parseFloat(item.price) + ingTotal) * item.quantity);
        }, 0);
    };

    const handleCreateOrder = async (e) => {
        e.preventDefault();
        if (newOrder.items.length === 0) return alert('Please add items first');

        const payload = {
            ...newOrder,
            branch_id: user.branch_id,
            total_price: calculateTotal()
        };

        try {
            await axios.post('http://localhost:5000/api/orders/create', payload, {
                headers: { authorization: localStorage.getItem('authorization') }
            });

            await axios.put(`http://localhost:5000/api/tables/${newOrder.table_id}/status`, { status: 'occupied' }, {
                headers: { authorization: localStorage.getItem('authorization') }
            });

            fetchOrders();
            setIsCreateModalOpen(false);
            toast.success('Order created successfully');
            setNewOrder({ table_id: '', order_type: 'dine-in', items: [] });
        } catch (err) {
            console.error(err.message);
            toast.error('Failed to create order');
        }
    };

    const filteredItems = items.filter(item =>
        item?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item?.createdat?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredOrders = orders.filter(order =>
        order?.id?.toString().includes(searchTerm) ||
        (order?.table_id && order?.table_id?.toString().includes(searchTerm)) ||
        (order?.order_type && order?.order_type?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order?.items?.some(item => item?.item_name?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="sm:p-8 p-4 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Branch <span className="text-amber-600">Orders</span></h1>
                    <p className="text-slate-500 mt-1">Real-time order tracking and creation.</p>
                </div>

                <div className='flex flex-wrap gap-4 items-center ml-auto'>
                    <button
                        onClick={fetchOrders}
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
                                placeholder="Find Order/Table..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm w-64"
                            />
                        </div>
                    </div>

                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="flex items-center hover:cursor-pointer ml-auto gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl hover:bg-slate-800 transition-all shadow-lg active:scale-95 font-semibold"
                    >
                        <Plus size={20} /> New Order
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-200">
                        <p className="text-slate-400 font-semibold italic">No active orders found.</p>
                    </div>
                ) : (
                    filteredOrders.map(order => (
                        <div key={order.id} className="bg-white rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 border border-slate-50 transition-all hover:shadow-2xl">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Order #{order.id}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <TableIcon size={18} className="text-amber-600" /> {order.table_id ? `Table ${order.table_id}` : 'Takeaway'}
                                    </h3>
                                    <div className="mt-2 space-y-1">
                                        {order.items?.map((item, i) => {
                                            return (
                                                <div key={i} className="text-sm text-slate-500 font-medium">
                                                    {item.quantity} x {item.item_name}
                                                    {Array.isArray(item.selected_ingredients) && item.selected_ingredients.length > 0 && (
                                                        <span className="italic ml-1 text-sm text-slate-400">
                                                            ({item.selected_ingredients.map(val => {
                                                                if (!isNaN(val)) {
                                                                    const ing = allIngredients.find(i => i.id === Number(val));
                                                                    return ing ? ing.name : null;
                                                                }

                                                                if (typeof val === 'string') {
                                                                    return val;
                                                                }

                                                                return null;
                                                            })
                                                                .filter(Boolean)
                                                                .join(', ')
                                                            })
                                                        </span>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                                <div className="text-right text-amber-600 font-bold text-xl">
                                    <IndianRupee size={16} className="inline mr-1" />{order.total_price}
                                </div>
                            </div>
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4 pt-4 border-t border-slate-50">
                                {new Date(order.createdat).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} • {order.order_type}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isCreateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl relative flex flex-wrap-reverse lg:overflow-hidden overflow-y-auto scrollbar-hidden animate-in zoom-in-95 duration-300">
                        <div className="sm:w-[40%] w-full border-r border-slate-100 flex flex-col flex-grow">
                            <div className="p-8 pb-0 border-b border-slate-100">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6">Select <span className="text-amber-600">Items</span></h3>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search menu..."
                                        className="w-full bg-slate-50 py-3.5 pl-12 pr-4 rounded-2xl border-2 border-transparent focus:border-amber-500 outline-none transition-all"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex-grow overflow-y-auto scrollbar-hidden p-8 pt-2 space-y-4 custom-scrollbar">
                                {filteredItems.map(item => (
                                    <button
                                        key={item.id}
                                        onClick={() => item.isavailable && handleAddItem(item)}
                                        className={`w-full text-left bg-white p-5 rounded-2xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50/50 transition-all flex justify-between items-center group shadow-sm hover:shadow-md ${item.isavailable ? 'hover:cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
                                    >
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-amber-600 mb-1">{item.name}</div>
                                            <div className="text-xs font-bold text-amber-600 flex items-center gap-1">
                                                <IndianRupee size={12} /> {item.price}
                                            </div>
                                        </div>
                                        {item.isavailable ?
                                            <Plus size={20} className="text-slate-300 group-hover:text-amber-600" /> : <span className="text-xs font-bold uppercase text-rose-500">Unavailable</span>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex-grow flex flex-col bg-[#fcfaf7]/50 sm:max-h-207">
                            <div className="p-8 sm:pb-8 pb-2 border-b border-slate-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900">Custom <span className="text-amber-600">Order</span></h3>
                                    <p className="text-slate-500 text-sm">Customize items and confirm details.</p>
                                </div>
                                <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-slate-400 hover:cursor-pointer hover:text-red-500">
                                    <X size={28} />
                                </button>
                            </div>

                            <div className="flex-grow overflow-y-auto p-8 sm:pt-8 pt-2 sm:space-y-6 space-y-2 scrollbar-hidden">
                                {newOrder.items.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                                        <ShoppingCart size={64} className="opacity-20" />
                                        <p className="font-bold">Your cart is empty.</p>
                                    </div>
                                ) : (
                                    newOrder.items.map((cartItem, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-100 animate-in slide-in-from-right-4">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h4 className="text-xl font-bold text-slate-900">{cartItem.name}</h4>
                                                    <div className="text-amber-600 font-bold flex items-center gap-1">
                                                        <IndianRupee size={16} /> {cartItem.price}
                                                    </div>
                                                </div>
                                                <button onClick={() => removeItem(idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>

                                            <div className="text-xs mt-4 font-black uppercase text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                                                <ChefHat size={14} /> Customize Ingredients
                                            </div>
                                            <div className="overflow-y-auto scrollbar-hidden max-w-[500px]">
                                                <div className="flex gap-2 max-h-fit">
                                                    {cartItem.available_ingredients.map((ingId) => {
                                                        const ing = allIngredients.filter(i => i.isavailable === true).find(i => i.id === ingId);
                                                        if (!ing) return null;

                                                        return (
                                                            <button
                                                                key={ingId}
                                                                onClick={() => toggleIngredient(idx, ingId)}
                                                                className={`px-4 py-2 rounded-xl min-w-fit hover:cursor-pointer text-xs font-bold border-2 transition-all flex items-center gap-2 ${cartItem.selected_ingredients.includes(ingId)
                                                                    ? 'bg-amber-600 border-amber-600 text-white'
                                                                    : 'bg-white border-slate-100 text-slate-500 hover:border-amber-200'
                                                                    }`}
                                                            >
                                                                {ing.name} (+₹{ing.price})
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-8 bg-white border-t border-slate-100">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assign Table</label>
                                        <select
                                            value={newOrder.table_id}
                                            onChange={(e) => setNewOrder({ ...newOrder, table_id: e.target.value })}
                                            className="w-full bg-slate-50 hover:cursor-pointer py-4 sm:px-6 px-2 rounded-2xl border-2 border-slate-50 focus:border-amber-500 outline-none font-bold"
                                        >
                                            <option value="">Select Table</option>
                                            {tables.filter(table => table.status === 'free').map(table => {
                                                return (
                                                    <option key={table.id} value={table.id}>Table {table.table_number}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    <div className="text-right flex flex-col items-end justify-center gap-2">
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Amount</div>
                                        <div className="text-4xl font-black text-slate-900 flex items-center justify-end gap-2">
                                            <IndianRupee size={32} className="text-amber-600" /> {calculateTotal()}
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCreateOrder}
                                    className="w-full bg-slate-900 hover:cursor-pointer text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-[0.98]"
                                >
                                    Confirm & Send to Kitchen <ArrowRight size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
