import { Link } from 'react-router-dom';
import { Utensils, Mail, MapPin, Phone } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-black text-slate-300 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="p-2 bg-amber-600 rounded-lg text-white">
                                <Utensils size={24} />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Restaurant</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Experience the finest culinary delights at Restaurant. We blend traditional flavors with modern innovation to create an unforgettable dining experience.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-slate-800 hover:bg-amber-600 hover:text-white rounded-full transition-all duration-300">
                                <FaFacebook size={18} className='ml-[1px]' />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 hover:bg-amber-600 hover:text-white rounded-full transition-all duration-300">
                                <FaInstagram size={18} />
                            </a>
                            <a href="#" className="p-2 bg-slate-800 hover:bg-amber-600 hover:text-white rounded-full transition-all duration-300">
                               <FaTwitter size={18} className='ml-[1px]' />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><NavLinkItem to="/">Home</NavLinkItem></li>
                            <li><NavLinkItem to="/about">About Us</NavLinkItem></li>
                            <li><NavLinkItem to="/contact">Contact</NavLinkItem></li>
                            <li><NavLinkItem to="/menu">Menu</NavLinkItem></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-amber-600 shrink-0 mt-0.5" />
                                <span className="text-sm">123 near ABC street, XYZ road,<br />India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-amber-600 shrink-0" />
                                <span className="text-sm">1234567890</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={18} className="text-amber-600 shrink-0" />
                                <span className="text-sm">restaurant@gmail.com</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6 uppercase text-xs tracking-widest">Newsletter</h4>
                        <p className="text-sm text-slate-400 mb-4">Subscribe to get special offers and menu updates.</p>
                        <form className="space-y-3">
                            <input
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-600 transition-shadow"
                            />
                            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-lg">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
                    <p>&copy; {currentYear} Restaurant. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

function NavLinkItem({ children, to }) {
    return (
        <Link to={to} className="text-sm hover:text-amber-600 transition-colors duration-200">
            {children}
        </Link>
    );
}
