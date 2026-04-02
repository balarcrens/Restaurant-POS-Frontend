import { Link } from 'react-router-dom';
import { Home, Phone, Utensils } from 'lucide-react';
import heroImage from '../assets/404_not_found.png';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-10 relative overflow-hidden">
            <div className="max-w-6xl w-full flex flex-col items-center gap-12 relative z-10 animate-fade-in text-center">
                <div className="w-full max-w-4xl">
                    <div className="relative group">
                        <div className="relative rounded-[40px] overflow-hidden transition-all duration-700">
                            <img
                                src={heroImage}
                                loading="eager"
                                alt="404 - Confused Chef"
                                className="w-full h-auto object-contain will-change-transform transition-all duration-700 blur-sm scale-105"
                                onLoad={(e) => {
                                    e.currentTarget.classList.remove('blur-sm', 'scale-105');
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-8 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <span className="h-px w-8 bg-[#fb923c]/30"></span>
                            <span className="text-[#fb923c] font-bold tracking-[0.2em] uppercase text-xs">Error 404</span>
                            <span className="h-px w-8 bg-[#fb923c]/30"></span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-serif text-[#4a3a3a] leading-tight">
                            Wait, where did the <br />
                            <span className="italic text-[#fb923c]">Kitchen go?</span>
                        </h1>
                        <p className="text-[#7a6a6a] text-lg md:text-xl font-light leading-relaxed">
                            Our chef seems to have misplaced the page you're looking for.
                            It's not on the menu today, but we can help you find your seat!
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Link
                            to="/"
                            className="group flex items-center justify-center gap-3 px-10 py-4 bg-[#4a3a3a] text-white rounded-2xl font-bold hover:bg-[#fb923c] transform hover:-translate-y-1 transition-all duration-500 shadow-xl shadow-[#4a3a3a]/10 hover:shadow-[#fb923c]/30"
                        >
                            <Home size={20} className="group-hover:scale-110 transition-transform" />
                            Return to Dining
                        </Link>
                        <Link
                            to="/contact"
                            className="group flex items-center justify-center gap-3 px-10 py-4 bg-white border-2 border-[#e5e7eb] text-[#4a3a3a] rounded-2xl font-bold hover:border-[#fb923c]/30 hover:bg-[#fff7ed] transition-all duration-500 shadow-sm"
                        >
                            <Phone size={20} className="transition-transform group-hover:animate-pulse" />
                            Talk to Staff
                        </Link>
                    </div>

                    <div className="pt-10 flex items-center justify-center gap-4 opacity-40">
                        <Utensils size={18} className="text-[#4a3a3a]" />
                        <span className="text-sm font-mono text-[#4a3a3a]">STATUS: KITCHEN_LOST_ORDER</span>
                        <Utensils size={18} className="text-[#4a3a3a]" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
