import { lazy, Suspense, useContext } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout/Layout';
import './App.css';
import ProtectedRoute from './Components/ProtectedRoute';
import DashboardLayout from './Components/Layout/DashboardLayout';
import AuthContext from './Context/Auth/AuthContext';
import ScrollToTop from './Components/ScrollToTop';
import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/ReactToastify.css';

const Home = lazy(() => import('./Pages/Home'));
const About = lazy(() => import('./Pages/About'));
const Contact = lazy(() => import('./Pages/Contact'));
const Login = lazy(() => import('./Pages/Login'));
const AdminDashboard = lazy(() => import('./Pages/Admin/AdminDashboard'));
const Category = lazy(() => import('./Pages/Admin/Category'));
const MenuItems = lazy(() => import('./Pages/Admin/MenuItems'));
const Orders = lazy(() => import('./Pages/Admin/Orders'));
const TableManagement = lazy(() => import('./Pages/Admin/TableManagement'));
const Ingredients = lazy(() => import('./Pages/Admin/Ingredients'));
const Kitchen = lazy(() => import('./Pages/Admin/Kitchen'));
const SuperAdminDashboard = lazy(() => import('./Pages/Superadmin/SuperAdminDashboard'));
const Admin = lazy(() => import('./Pages/Superadmin/Admin'));
const Branches = lazy(() => import('./Pages/Superadmin/Branches'));
const SqlEditor = lazy(() => import('./Pages/Superadmin/SqlEditor'));
const NotFound = lazy(() => import('./Pages/NotFound'));

const PageLoader = () => (
    <div className="flex items-center justify-center h-screen bg-white">
        <div className="relative">
            <div className="h-24 w-24 rounded-full border-t border-amber-600 animate-spin"></div>
        </div>
    </div>
);

function App() {
    const { user } = useContext(AuthContext);

    return (
        <BrowserRouter>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path="about" element={<About />} />
                        <Route path="contact" element={<Contact />} />

                        <Route path="login" element={<Login />} />

                        <Route path="*" element={<NotFound />} />
                    </Route>

                    <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }>
                        <Route index element={user?.role === 'superadmin' ? <SuperAdminDashboard /> : <AdminDashboard />} />

                        <Route path="menu-categories" element={<Category />} />
                        <Route path="menu-items" element={<MenuItems />} />
                        <Route path="ingredients" element={<Ingredients />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="kitchen" element={<Kitchen />} />
                        <Route path="tables" element={<TableManagement />} />

                        <Route path="branches" element={<Branches />} />
                        <Route path="admins" element={<Admin />} />
                        <Route path="sql-editor" element={<SqlEditor />} />
                    </Route>
                </Routes>
            </Suspense>
            <ScrollToTop />
        </BrowserRouter>
    );
}

export default App;