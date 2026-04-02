import React from 'react';
import { Users, Target, Award, Heart, Scroll, Coffee, Utensils } from 'lucide-react';
import aboutHero from '../assets/about_hero.png';
import chefAtWork from '../assets/chef_at_work.png';
import Highlight from "../assets/marker_underline.png"

export default function About() {
    return (
        <div className="bg-[#fcfaf7] min-h-screen font-serif selection:bg-amber-100 selection:text-amber-900 overflow-hidden">
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={aboutHero}
                        alt="Restaurant Interior"
                        className="w-full h-full object-cover scale-105 will-change-transform transition-all duration-700 hover:scale-100 blur-sm"
                        onLoad={(e) => {
                            e.currentTarget.classList.remove('blur-sm', 'scale-105');
                        }}
                    />
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
                </div>
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <span className="inline-block text-amber-400 text-sm font-bold tracking-[0.3em] uppercase mb-6 opacity-0 translate-y-4 animate-[fade-in-up_0.7s_forwards]">
                        EST. 2010
                    </span>
                    <h1 className="text-5xl md:text-8xl font-bold text-white mb-8 tracking-tight opacity-0 translate-y-4 animate-[fade-in-up_0.7s_0.2s_forwards]">
                        Our Culinary <span className="text-amber-400">Heritage</span>
                    </h1>
                    <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full opacity-0 animate-[fade-in_1s_0.5s_forwards]" />
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight bg-no-repeat bg-bottom-left pb-6 mb-5" style={{
                                backgroundImage: `url(${Highlight})`,
                                backgroundSize: "55% 35px"
                            }}>
                                A Legacy of Taste and <br />
                                <span className="text-amber-600 underline-offset-8" >Craftsmanship</span>
                            </h2>
                            <p className="text-xl text-slate-500 italic">"Where every dish tells a story of tradition."</p>
                        </div>

                        <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-sans">
                            <p>
                                Founded in the heart of the city, Gourmet Bistro began as a humble family passion project. Our founder, Chef Antonio, envisioned a sanctuary where culinary boundaries are pushed while respecting the timeless techniques of classical cooking.
                            </p>
                            <p>
                                Today, we stand as a testament to that vision. We aren't just a restaurant; we are a destination for those who appreciate the finer details—the subtle crunch of a perfectly roasted garnish, the complex aroma of a slow-simmered sauce, and the warmth of genuine hospitality.
                            </p>
                        </div>

                        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white shadow-sm border border-slate-100 rounded-xl text-amber-600">
                                    <Scroll size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Authentic Recipes</h4>
                                    <p className="text-sm text-slate-500 font-sans">Passed down through generations.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white shadow-sm border border-slate-100 rounded-xl text-amber-600">
                                    <Utensils size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Expert Chefs</h4>
                                    <p className="text-sm text-slate-500 font-sans">Master artisans in the kitchen.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute -inset-2 bg-amber-100/50 rounded-[2rem] -rotate-3 transition-transform hover:rotate-0 duration-500" />
                        <div className="relative sm:aspect-[4/5] aspect-[2/2] rounded-[2rem] overflow-hidden shadow-2xl">
                            <img
                                src={chefAtWork}
                                alt="Chef at work"
                                className="w-full h-full object-cover scale-102 will-change-transform transition-all duration-700 hover:scale-110 blur-sm"
                                onLoad={(e) => {
                                    e.currentTarget.classList.remove('blur-sm', 'scale-102');
                                }}
                            />
                        </div>
                        <div className="absolute -bottom-10 md:-left-10 bg-white p-8 rounded-[2rem] shadow-xl max-w-[240px] block border border-slate-50">
                            <div className="text-amber-600 mb-2">
                                <Coffee size={32} />
                            </div>
                            <p className="font-bold text-slate-900 text-lg leading-snug">The best morning start since 2012.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-slate-900 py-24 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        <StatCard icon={<Users size={32} />} value="100k+" Label="Happy Guests" />
                        <StatCard icon={<Target size={32} />} value="12" Label="Local Branches" />
                        <StatCard icon={<Award size={32} />} value="25" Label="Culinary Awards" />
                        <StatCard icon={<Heart size={32} />} value="100%" Label="Fresh Material" />
                    </div>
                </div>
            </section>

            <section className="py-24 bg-white">
                <div className="max-w-5xl mx-auto px-4 text-center space-y-16">
                    <div className="space-y-4">
                        <h3 className="text-3xl md:text-4xl font-bold text-slate-900">Our Core Philosophy</h3>
                        <p className="text-slate-500 max-w-2xl mx-auto font-sans">We believe in three pillars that define every single experience at Gourmet Bistro.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: 'Quality', text: 'Sourcing only the freshest, sustainable ingredients from local farmers.' },
                            { title: 'Tradition', text: 'Respecting old-world techniques while embracing modern innovation.' },
                            { title: 'Community', text: 'Creating a space where neighbors become friends and friends become family.' }
                        ].map((item, idx) => (
                            <div key={idx} className="space-y-4 group">
                                <div className="text-5xl font-black text-amber-50 mx-auto w-fit group-hover:text-amber-200 transition-colors duration-300">0{idx + 1}</div>
                                <h4 className="text-xl font-bold text-slate-900">{item.title}</h4>
                                <p className="text-slate-600 font-sans leading-relaxed">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function StatCard({ icon, value, Label }) {
    return (
        <div className="text-center group">
            <div className="text-amber-500 flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">{icon}</div>
            <div className="text-2xl sm:text-5xl font-bold text-white mb-2 tracking-tight">{value}</div>
            <div className="text-xs text-amber-500/70 uppercase tracking-[0.2em] font-bold font-sans">{Label}</div>
        </div>
    );
}
