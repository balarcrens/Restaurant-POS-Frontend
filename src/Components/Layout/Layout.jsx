import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen selection:bg-amber-100 selection:text-amber-800">
            <Header />

            <main className="flex-grow">
                <div className="animate-in fade-in duration-700">
                    <Outlet />
                </div>
            </main>

            <Footer />
        </div>
    );
}
