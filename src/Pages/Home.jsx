import { ArrowRight, Star, Clock, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';
import Highlight from "../assets/marker_underline.png"

export default function Home() {
    return (
        <div className="flex flex-col">
            <section className="relative h-[600px] flex items-center justify-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10"></div>
                <img
                    src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2070"
                    alt="Restaurant Interior"
                    className="absolute inset-0 w-full h-full object-cover animate-pulse-slow blur-sm scale-105 will-change-transform transition-all duration-700"
                    onLoad={(e) => {
                        e.currentTarget.classList.remove('blur-sm', 'scale-105');
                    }}
                />

                <div className="relative z-20 text-center max-w-4xl px-4">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                        Exquisite Dining <br />
                        <span className="text-amber-500">Redefined</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto font-light">
                        Discover a symphony of flavors crafted with passion and served with elegance. Your journey into culinary excellence starts here.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/menu"
                            className="bg-amber-600 hover:bg-amber-700 text-white sm:px-8 sm:py-4 py-2 px-5 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-2 group shadow-xl hover:shadow-amber-500/20"
                        >
                            Explore Menu <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/30 px-8 sm:py-4 py-2  rounded-full font-bold text-lg transition-all shadow-lg">
                            Book a Table
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-10 inline-block bg-no-repeat bg-bottom pb-7"
                        style={{
                            backgroundImage: `url(${Highlight})`,
                            backgroundSize: "100% 35px"
                        }}
                    >
                        Why Choose Us?
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-10">
                        <FeatureCard
                            icon={<Utensils className="text-amber-600" size={32} />}
                            title="Master Chefs"
                            description="Our kitchen is led by world-renowned chefs who bring decades of international experience to every plate."
                        />
                        <FeatureCard
                            icon={<Star className="text-amber-600" size={32} />}
                            title="Premium Ingredients"
                            description="We source only the freshest organic ingredients from local farmers and select international suppliers."
                        />
                        <FeatureCard
                            icon={<Clock className="text-amber-600" size={32} />}
                            title="Fast Service"
                            description="Experience fine dining without the wait. Our staff is dedicated to providing efficient yet graceful service."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="p-8 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white transition-all duration-300 text-center">
            <div className="w-16 h-16 bg-white rounded-xl shadow-lg flex items-center justify-center mx-auto mb-6">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{description}</p>
        </div>
    );
}
