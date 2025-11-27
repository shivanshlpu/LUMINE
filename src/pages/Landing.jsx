import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginCard from '../components/LoginCard';
import { HandsPraying, ShieldCheck, LockKey } from '@phosphor-icons/react';
import { useTranslation } from '../context/LanguageContext';

const Landing = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentRole, setCurrentRole] = useState('devotee');
    const [isLoading, setIsLoading] = useState(false);
    const [globalError, setGlobalError] = useState('');

    const handleLogin = async ({ userId, password, rememberMe, role }) => {
        setIsLoading(true);
        setGlobalError('');

        try {
            if (role === 'mandir_admin' && userId === 'admin' && password === 'admin123') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                handleSuccess({ token: 'mock-admin-token', redirectUrl: '/admin/dashboard' }, rememberMe);
                return true;
            }

            if (role === 'devotee' && userId === 'shiva900' && password === 'shivansh') {
                await new Promise(resolve => setTimeout(resolve, 1000));
                handleSuccess({ token: 'mock-devotee-token', redirectUrl: '/dashboard' }, rememberMe);
                return true;
            }

            if (role === 'security_guard' && userId.trim().toLowerCase() === 'guard' && (password === 'shivansh' || password === 'SHIVASH')) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                handleSuccess({ token: 'mock-guard-token', redirectUrl: '/guard/dashboard' }, rememberMe);
                return true;
            }

            const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
            const response = await fetch(`${apiUrl}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                handleSuccess(data, rememberMe);
                return true;
            } else {
                throw new Error(data.error || "Invalid Credentials or Server Offline.");
            }

        } catch (error) {
            setGlobalError(error.message || "Invalid Credentials or Server Offline.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccess = (data, rememberMe) => {
        if (rememberMe) {
            localStorage.setItem('lumine_token', data.token);
        } else {
            sessionStorage.setItem('lumine_token', data.token);
        }

        setTimeout(() => {
            navigate(data.redirectUrl);
        }, 1000);
    };

    return (
        <div className="bg-sand font-sans text-gray-800 min-h-screen flex flex-col bg-mandala">
            <Header />

            <main className="flex-grow flex items-center justify-center p-4 lg:p-8">
                <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

                    <div className="hidden lg:block space-y-8 animate-fade-in-up">
                        <div className="space-y-4">
                            <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium border border-orange-200">
                                ✨ Jai Shree Ram
                            </span>
                            <h1 className="font-serif text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                                <span data-key="welcomeMain">{t('welcomeMain')}</span> <br />
                                <span className="text-saffron-600" data-key="welcomeSub">{t('welcomeSub')}</span>
                            </h1>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-saffron-50 shadow-sm">
                                <div className="p-2 bg-saffron-100 rounded-lg text-saffron-600">
                                    <HandsPraying weight="duotone" className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800" data-key="card1Title">{t('card1Title')}</h3>
                                    <p className="text-sm text-gray-500" data-key="card1Desc">{t('card1Desc')}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-saffron-50 shadow-sm">
                                <div className="p-2 bg-saffron-100 rounded-lg text-saffron-600">
                                    <ShieldCheck weight="duotone" className="text-2xl" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800" data-key="card2Title">{t('card2Title')}</h3>
                                    <p className="text-sm text-gray-500" data-key="card2Desc">{t('card2Desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full max-w-md mx-auto lg:mx-0">
                        <div className="lg:hidden text-center mb-8 space-y-2">
                            <h1 className="font-serif text-3xl font-bold text-gray-900">
                                <span data-key="welcomeMain">{t('welcomeMain')}</span> <span className="text-saffron-600" data-key="welcomeSub">{t('welcomeSub')}</span>
                            </h1>
                        </div>

                        <LoginCard
                            currentRole={currentRole}
                            onRoleChange={setCurrentRole}
                            onLogin={handleLogin}
                            isLoading={isLoading}
                            globalError={globalError}
                        />

                        <div className="mt-6 text-center text-xs text-gray-400 flex items-center justify-center gap-1">
                            <LockKey weight="fill" className="text-sm" />
                            <span>256-bit SSL Encrypted Connection</span>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Landing;
