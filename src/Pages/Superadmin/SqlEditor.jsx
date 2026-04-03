import React, { useState, useContext, useRef } from 'react';
import axios from 'axios';
import {
    Play,
    Database,
    Table,
    Terminal,
    AlertCircle,
    Eraser,
    SearchX,
    Loader2
} from 'lucide-react';
import AuthContext from '../../Context/Auth/AuthContext';
import { toast } from 'react-toastify';

export default function SqlEditor() {
    const { token } = useContext(AuthContext);
    const [query, setQuery] = useState('SELECT * FROM users LIMIT 10;');
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const textAreaRef = useRef(null);

    const DB_URL = import.meta.env.VITE_DB_URL;

    const handleRunQuery = async () => {
        if (!query.trim()) return;
        try {
            setIsLoading(true);
            setError(null);
            setResults(null);
            const startTime = performance.now();

            const res = await axios.post(`${DB_URL}/api/sql/query`, { query }, {
                headers: { "authorization": token }
            });

            const endTime = performance.now();
            toast.success('Query executed successfully');
            setResults(res.data);
            setStats({
                rowCount: res.data.length,
                executionTime: (endTime - startTime).toFixed(2)
            });
        } catch (err) {
            toast.error('Failed to execute query');
            setError(err.response?.data?.error || err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setQuery('');
        setError(null);
        setResults(null);
        setStats(null);
    };

    const handleQuickExample = (sql) => {
        setQuery(sql);
        setError(null);
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleRunQuery();
        }
    };

    const quickQueries = [
        { label: "List Admins", sql: "SELECT * FROM users WHERE role = 'admin';" },
        { label: "Active Branches", sql: "SELECT * FROM branches;" },
        { label: "Recent Orders", sql: "SELECT * FROM orders ORDER BY createdat DESC LIMIT 5;" },
        { label: "Stats Summary", sql: "SELECT count(*) as total, role FROM users GROUP BY role;" }
    ];

    return (
        <div className="sm:p-8 p-4 pb-12 max-w-7xl mx-auto animate-in fade-in duration-500">
            <div className="flex flex-wrap gap-4 justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                        SQL <span className="text-amber-600">Console</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Execute raw database queries securely.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    {quickQueries.map((item, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleQuickExample(item.sql)}
                            className="px-3 py-1.5 text-[11px] font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden mb-6 flex flex-col">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mt-0.5">Query Input</span>
                    </div>
                </div>

                <div className="relative group">
                    <textarea
                        ref={textAreaRef}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Write your SELECT query here..."
                        spellCheck="false"
                        className="w-full h-40 p-6 font-mono text-sm text-slate-800 bg-white focus:outline-none resize-none leading-relaxed tracking-tight"
                    />

                    <div className="absolute bottom-4 right-4 flex items-center gap-3">
                        <button
                            onClick={handleClear}
                            className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
                            title="Clear Editor"
                        >
                            <Eraser size={18} />
                        </button>
                        <button
                            onClick={handleRunQuery}
                            disabled={isLoading}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${isLoading
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 text-white hover:bg-slate-800 hover:cursor-pointer'
                                }`}
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} className="fill-current" />}
                            Run Query
                        </button>
                    </div>
                </div>

                <div className="p-3 bg-slate-900/5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold ml-2 italic">Ctrl + Enter to execute</span>
                    {stats && (
                        <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <span className="flex items-center gap-1.5"><Database size={10} /> {stats.rowCount} rows</span>
                            <span className="flex items-center gap-1.5"><Loader2 size={10} /> {stats.executionTime}ms</span>
                        </div>
                    )}
                </div>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-rose-50 border-2 border-rose-100 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-4 duration-300">
                    <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
                    <div>
                        <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 text-red-600">SQL Error</p>
                        <p className="text-sm font-medium text-rose-900/80">{error}</p>
                    </div>
                </div>
            )}

            {results && (
                <div className="bg-white border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                        <Table size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mt-0.5">Execution Results</span>
                    </div>

                    <div className="overflow-x-auto scrollbar-hidden max-h-[500px]">
                        {results.length > 0 ? (
                            <table className="w-full border-collapse">
                                <thead className="sticky top-0 z-10 bg-slate-50 shadow-sm border-b border-slate-100">
                                    <tr>
                                        {Object.keys(results[0]).filter(key => key.toLowerCase() !== 'password').map((key) => (
                                            <th key={key} className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                                {key}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {results.map((row, i) => (
                                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                            {Object.entries(row)
                                                .filter(([key]) => key.toLowerCase() !== 'password')
                                                .map(([key, val], j) => (
                                                    <td key={j} className="px-6 py-3.5 text-sm text-slate-600 font-medium whitespace-nowrap">
                                                        {val === null ? (
                                                            <span className="text-slate-300 italic text-xs">null</span>

                                                        ) : typeof val === 'boolean' ? (
                                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${val ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                                {val.toString()}
                                                            </span>

                                                        ) : ['createdat', 'updatedat', 'date', 'dob'].includes(key.toLowerCase()) ? (
                                                            <span className="text-xs font-semibold text-slate-500">
                                                                {new Date(val).toLocaleString('en-IN', {
                                                                    dateStyle: 'medium',
                                                                    timeStyle: 'short'
                                                                })}
                                                            </span>

                                                        ) : (
                                                            val?.toString()
                                                        )}
                                                    </td>
                                                ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                                <SearchX size={48} className="mb-3 opacity-20" />
                                <p className="text-base font-bold">Query successful but no rows returned.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}