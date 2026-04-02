/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { ChefHat, Timer, Table as TableIcon, AlertCircle, Play, PackageCheck, ClipboardCheck, Trash2, Search, Eye, X, RefreshCcw } from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function Kitchen() {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user?.branch_id) {
            fetchOrders();
            const interval = setInterval(fetchOrders, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const res = await axios.get(`http://localhost:5000/api/orders/branch/${user.branch_id}`, {
                headers: { authorization: localStorage.getItem('authorization') }
            });

            const activeOrders = res.data.filter(o => ['pending', 'preparing', 'ready', 'complete'].includes(o.status));
            setIsLoading(false);
            setOrders(activeOrders);
        } catch (err) {
            setIsLoading(false);
            console.error(err.message);
        }
    };

    const getIngredients = (data) => {
        if (!data) return [];
        return Array.isArray(data) ? data : [];
    };

    const updateStatus = async (id, newStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus }, {
                headers: { authorization: localStorage.getItem('authorization') }
            });
            fetchOrders();
            toast.success(`Order marked as ${newStatus}`);
        } catch (err) {
            console.error(err.message);
            toast.error('Failed to update order status');
        }
    };

    const handleCancel = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This will cancel the order and may affect linked order items.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:5000/api/orders/${id}`, {
                    headers: { authorization: localStorage.getItem('authorization') }
                });
                fetchOrders();
                toast.success('Order cancelled successfully');
            } catch (err) {
                console.error(err.message);
                toast.error('Failed to cancel order');
            }
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending': return { label: 'New Order', color: 'text-rose-600', icon: <AlertCircle size={14} /> };
            case 'preparing': return { label: 'In Progress', color: 'text-amber-600', icon: <ChefHat size={14} /> };
            case 'ready': return { label: 'Ready', color: 'text-emerald-600', icon: <PackageCheck size={14} /> };
            default: return { label: status, color: 'text-slate-400', icon: <Timer size={14} /> };
        }
    };

    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        (order.table_id && order.table_id.toString().includes(searchTerm)) ||
        (order.order_type && order.order_type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        order.items?.some(item => item.item_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const openModal = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <div className="sm:p-8 p-4 pb-20 max-w-7xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Kitchen <span className="text-amber-600">Display</span></h1>
                    <p className="text-slate-500 mt-1">Real-time orders for preparation and pickup.</p>
                </div>
                <div className="flex flex-wrap gap-4 items-center ml-auto">
                    <button
                        onClick={fetchOrders}
                        disabled={isLoading}
                        className="cursor-pointer hidden md:flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                    >
                        <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                    </button>

                    <div className="relative hidden md:block">
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
            </div>

            <div className="md:hidden mb-6 flex items-center gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Find Order/Table..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-2xl focus:border-amber-500 outline-none transition-all shadow-sm"
                    />
                </div>
                <button
                    onClick={fetchOrders}
                    disabled={isLoading}
                    className="cursor-pointer md:hidden flex items-center gap-1.5 text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-100 rounded-2xl p-2 shadow-sm transition disabled:opacity-60"
                >
                    <RefreshCcw size={16} className={isLoading ? "animate-spin" : ""} />
                </button>
            </div>

            {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
                </div>
            ) : (
                <div className="bg-white border border-slate-50 overflow-hidden">
                    <div className="overflow-x-auto scrollbar-hidden">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Order</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Table/Type</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Items</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-20 text-center">
                                            <p className="text-slate-400 font-semibold italic">No active orders found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => {
                                        const config = getStatusConfig(order.status);

                                        return (
                                            <tr key={order.id} className="hover:bg-slate-50/50 transition-colors group">
                                                <td className="px-6 py-6 border-b-0">
                                                    <span className="font-black text-slate-900">#{order.id}</span>
                                                </td>
                                                <td className="px-6 py-6 border-b-0">
                                                    <div className="flex items-center gap-2">
                                                        <TableIcon size={16} className="text-amber-600" />
                                                        <span className="font-bold text-slate-700">
                                                            {order.table_id ? `Table ${order.table_id}` : 'Takeaway'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 border-b-0 max-w-sm">
                                                    <div className="space-y-1">
                                                        {order.items?.map((item, idx) => (
                                                            <div key={idx} className="text-sm">
                                                                <span className="font-black text-amber-600 mr-1">{item.quantity}x</span>
                                                                <span className="font-bold text-slate-800">{item.item_name}</span>
                                                                {getIngredients(item.ingredient_names).length > 0 && (
                                                                    <span className="text-[10px] text-slate-400 ml-2 italic">
                                                                        ({getIngredients(item.ingredient_names).join(', ')})
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 border-b-0">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 w-fit ${config.color}`}>
                                                        {config.icon} {config.label}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-6 border-b-0 text-right">
                                                    <div className="flex justify-end gap-2 text-nowrap">
                                                        <button
                                                            onClick={() => openModal(order)}
                                                            className="p-2 text-slate-400 hover:cursor-pointer hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
                                                            title="View Details"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        {order.status === 'pending' && (
                                                            <button
                                                                onClick={() => updateStatus(order.id, 'preparing')}
                                                                className="p-2 bg-slate-900 hover:cursor-pointer text-white rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-90"
                                                                title="Start Cooking"
                                                            >
                                                                <Play size={18} fill="currentColor" />
                                                            </button>
                                                        )}
                                                        {order.status === 'preparing' && (
                                                            <button
                                                                onClick={() => updateStatus(order.id, 'ready')}
                                                                className="p-2 bg-amber-600 hover:cursor-pointer text-white rounded-xl hover:bg-amber-700 transition-all shadow-md active:scale-90"
                                                                title="Mark as Ready"
                                                            >
                                                                <PackageCheck size={18} />
                                                            </button>
                                                        )}
                                                        {order.status === 'ready' && (
                                                            <button
                                                                onClick={() => updateStatus(order.id, 'completed')}
                                                                className="p-2 bg-emerald-600 hover:cursor-pointer text-white rounded-xl hover:bg-emerald-700 transition-all shadow-md active:scale-90"
                                                                title="Complete Order"
                                                            >
                                                                <ClipboardCheck size={18} />
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleCancel(order.id)}
                                                            className="p-2 text-slate-400 hover:cursor-pointer hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                                                            title="Cancel Order"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {isModalOpen && selectedOrder && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <button onClick={closeModal} className="absolute right-6 top-6 p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <X size={24} />
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Order Details</span>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1.5 ${getStatusConfig(selectedOrder.status).color}`}>
                                {getStatusConfig(selectedOrder.status).icon} {getStatusConfig(selectedOrder.status).label}
                            </span>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">
                            Order <span className="text-amber-600">#{selectedOrder.id}</span>
                        </h2>

                        <div className="grid grid-cols-1 gap-6 mb-8 p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Service Type</p>
                                <p className="font-bold text-slate-900 flex items-center gap-2">
                                    <TableIcon size={16} className="text-amber-600" />
                                    {selectedOrder.table_id ? `Table ${selectedOrder.table_id}` : 'Takeaway'}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 pb-2">Order Items</p>
                            {selectedOrder.items?.map((item, idx) => (
                                <div key={idx} className="flex flex-col gap-2 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm">
                                                {item.quantity}x
                                            </span>
                                            <p className="font-bold text-slate-800 text-lg">{item.item_name}</p>
                                        </div>
                                    </div>
                                    {item.ingredient_names && item.ingredient_names.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {item.ingredient_names.map((ing, i) => (
                                                <span key={i} className="text-[10px] font-black uppercase tracking-wider bg-slate-50 border border-slate-100 text-slate-500 px-2.5 py-1 rounded-md">
                                                    + {ing}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={closeModal}
                                className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                            >
                                Close View
                            </button>
                            {selectedOrder.status !== 'ready' && selectedOrder.status !== 'completed' && (
                                <button
                                    onClick={() => {
                                        updateStatus(selectedOrder.id, selectedOrder.status === 'pending' ? 'preparing' : 'ready');
                                        closeModal();
                                    }}
                                    className="flex-[2] bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                                >
                                    {selectedOrder.status === 'pending' ? <Play size={18} fill="currentColor" /> : <PackageCheck size={18} />}
                                    {selectedOrder.status === 'pending' ? 'Start Preparation' : 'Mark as Ready'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}
