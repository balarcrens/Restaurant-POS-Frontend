import React from 'react';
import { Mail, Phone, MapPin, Send, Clock, Globe } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import contactHero from '../assets/contact_hero.png';

export default function Contact() {
    return (
        <div className="bg-[#fcfaf7] min-h-screen font-serif selection:bg-amber-100 selection:text-amber-900">
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src={contactHero}
                        alt="Contact Us"
                        className="w-full h-full object-cover will-change-transform transition-all duration-700 blur-sm scale-101"
                        onLoad={(e) => {
                            e.currentTarget.classList.remove('blur-sm', 'scale-101');
                        }}
                    />
                    <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[1px]" />
                </div>
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight opacity-0 translate-y-4 animate-[fade-in-up_0.7s_0.1s_forwards]">Get In <span className="text-amber-400">Touch</span></h1>
                    <p className="text-amber-100/80 text-lg max-w-xl mx-auto font-sans opacity-0 translate-y-4 animate-[fade-in-up_0.7s_0.3s_forwards]">We are here to ensure your experience is nothing short of exceptional.</p>
                </div>
            </section>

            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    <div className="lg:col-span-5 space-y-12">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-slate-900">Visit Our <br />Establishment</h2>
                            <p className="text-slate-600 font-sans leading-relaxed text-lg">
                                Whether you have a query about our menu, wish to host a private event, or simply want to share your experience, we would be delighted to hear from you.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <ContactItem
                                icon={<MapPin size={24} />}
                                title="Location"
                                detail="123 near ABC street, XYZ road, India"
                            />
                            <ContactItem
                                icon={<Phone size={24} />}
                                title="Reservations"
                                detail="123457890"
                            />
                            <ContactItem
                                icon={<Mail size={24} />}
                                title="Inquiries"
                                detail="restaurant@gmail.com"
                            />
                        </div>

                        <div className="sm:p-8 py-4 px-6 bg-white rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 text-amber-600">
                                <Clock size={24} />
                                <h3 className="text-xl font-bold text-slate-900">Opening Hours</h3>
                            </div>
                            <div className="space-y-3 font-sans text-slate-600 border-t border-slate-50 pt-6">
                                <div className="flex justify-between">
                                    <span>Mon - Thu</span>
                                    <span className="font-bold text-slate-900">11:00 AM - 10:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Fri - Sat</span>
                                    <span className="font-bold text-slate-900">11:00 AM - 11:30 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="font-bold text-slate-900">10:00 AM - 9:00 PM</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 pt-4">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest font-sans">Connect</span>
                            <div className="h-px w-12 bg-slate-200" />
                            <div className="flex gap-4 flex-wrap">
                                {[FaInstagram, FaFacebook, FaTwitter, Globe].map((Icon, idx) => (
                                    <a key={idx} href="#" className="p-2 text-slate-400 hover:text-amber-600 transition-colors">
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-7 bg-white max-h-fit rounded-[2.5rem] p-4 sm:p-7 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-50">
                        <div className="mb-12">
                            <h3 className="text-3xl font-bold text-slate-900 mb-2">Send an Inquiry</h3>
                            <p className="text-slate-500 font-sans">Expected response time: within 24 hours.</p>
                        </div>

                        <form className="space-y-8 font-sans">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input type="text" className="w-full bg-slate-50 border-b-2 border-slate-100 px-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl" placeholder="Full Name" />
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                                    <input type="email" className="w-full bg-slate-50 border-b-2 border-slate-100 px-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl" placeholder="example@gmail.com" />
                                </div>
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                                <select className="w-full bg-slate-50 border-b-2 border-slate-100 px-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl appearance-none">
                                    <option>General Inquiry</option>
                                    <option>Table Reservation</option>
                                    <option>Private Event</option>
                                    <option>Career Opportunities</option>
                                </select>
                            </div>
                            <div className="space-y-2 group">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                                <textarea rows="4" className="w-full bg-slate-50 border-b-2 border-slate-100 px-4 py-4 focus:border-amber-500 outline-none transition-all text-slate-900 rounded-t-xl resize-none" placeholder="Share your thoughts with us..."></textarea>
                            </div>

                            <button className="group relative w-full bg-slate-900 text-white font-bold py-3 sm:py-5 rounded-2xl overflow-hidden transition-all hover:bg-slate-800 shadow-xl active:scale-95">
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Deliver Message <Send size={18} className="sm:group-hover:translate-x-1 sm:group-hover:-translate-y-1 transition-transform" />
                                </span>
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}

function ContactItem({ icon, title, detail }) {
    return (
        <div className="flex gap-6 items-start group">
            <div className="shrink-0 p-4 bg-white border border-slate-100 rounded-2xl text-amber-600 shadow-sm group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1">
                {icon}
            </div>
            <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">{title}</h4>
                <p className="text-xl font-bold text-slate-900 leading-snug wrap-anywhere">{detail}</p>
            </div>
        </div>
    );
}
