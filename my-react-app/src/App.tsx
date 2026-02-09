
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/components/pages/Dashboard';
import Projects from '@/components/pages/Projects';
import ProjectDetail from '@/components/pages/ProjectDetail';
import Clients from '@/components/pages/Clients';
import Staff from '@/components/pages/Staff';
import Payroll from '@/components/pages/Payroll';
import Settings from '@/components/pages/Settings';
import Login from '@/components/pages/Login';
import LandingPage from '@/components/pages/LandingPage';
import NotFound from '@/components/pages/NotFound';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import { LoadingProvider } from '@/context/LoadingContext';
import { AxiosLoadingInterceptor } from '@/components/utils/AxiosLoadingInterceptor';
import GlobalLoader from '@/components/ui/GlobalLoader';
import './App.css';

function App() {
    return (
        <LoadingProvider>
            <AxiosLoadingInterceptor>
                <AuthProvider>
                    <AppProvider>
                        <Router>
                            <GlobalLoader />
                            <Routes>
                                <Route path="/" element={<LandingPage />} />
                                <Route path="/login" element={<Login />} />

                                <Route element={<ProtectedRoute />}>
                                    <Route path="/" element={<MainLayout />}>
                                        <Route index element={<Navigate to="/dashboard" replace />} />
                                        <Route path="dashboard" element={<Dashboard />} />
                                        <Route path="projects" element={<Projects />} />
                                        <Route path="projects/:id" element={<ProjectDetail />} />
                                        <Route path="clients" element={<Clients />} />
                                        <Route path="staff" element={<Staff />} />
                                        <Route path="payroll" element={<Payroll />} />
                                        <Route path="settings" element={<Settings />} />
                                    </Route>
                                </Route>

                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </Router>
                    </AppProvider>
                </AuthProvider>
            </AxiosLoadingInterceptor>
        </LoadingProvider>
    );
}

export default App;
