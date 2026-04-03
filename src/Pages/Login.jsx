import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, EyeClosed, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import axios from 'axios';
import AuthContext from '../Context/Auth/AuthContext';
import { toast } from 'react-toastify';

export default function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [isPassShow, setisPassShow] = useState(false);
    const { login } = useContext(AuthContext);

    const DB_URL = import.meta.env.VITE_DB_URL;

    const handleShowPass = () => {
        setisPassShow((prev) => !prev)
    }

    const onSubmit = async (data) => {
        try {
            const res = await axios.post(`${DB_URL}/api/users/login`, data);

            login(res.data.user, res.data.token);
            toast.success('Login successful');
            reset();
            navigate('/');
        } catch (error) {
            toast.error('Login failed : ' + (error.response?.data?.message || error.message));
            console.log(error.message);
        }
    };

    return (
        <div className="bg-[#fcfaf7] min-h-screen font-serif flex items-center justify-center px-4 py-20">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-50">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome <span className="text-amber-600">Back</span></h1>
                    <p className="text-slate-500 font-sans">Please enter your details to login.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 font-sans">
                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input
                                type="email"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                                })}
                                className="w-full bg-slate-50 border-b-2 border-slate-100 pl-12 pr-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                placeholder="example@gmail.com"
                            />
                        </div>
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                            <input
                                type={isPassShow ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" }
                                })}
                                className="w-full bg-slate-50 border-b-2 border-slate-100 pl-12 pr-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl"
                                placeholder="••••••••"
                            />
                            {isPassShow ?
                                <button type="button" onClick={handleShowPass}>
                                    <Eye className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 group-hover:text-amber-500 transition-colors" size={18} />
                                </button>
                                : <button type="button" onClick={handleShowPass}>
                                    <EyeClosed className="absolute cursor-pointer right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 group-hover:text-amber-500 transition-colors" size={18} />
                                </button>
                            }
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-end text-sm">
                        <a href="#" className="text-amber-600 hover:underline underline-offset-4 font-bold hover:text-amber-700">Forgot Password?</a>
                    </div>

                    <button type="submit" className="group relative w-full bg-slate-900 text-white font-bold py-4 rounded-2xl overflow-hidden transition-all hover:bg-slate-800 shadow-xl active:scale-95 mt-4">
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            Sign In <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </form>


            </div>
        </div>
    );
}
